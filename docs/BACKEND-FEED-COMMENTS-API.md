# API de comentarios del feed (backend)

El frontend ya muestra **comentarios** en cada publicación del feed: lista de comentarios con **respuestas anidadas** (cada comentario puede tener respuestas mediante `parentId`). Los autores de publicaciones y de comentarios/respuestas son enlaces al perfil (`/profile/:username`). Los comentarios se guardan hoy solo en estado local; este documento es el **prompt/especificación** para implementar en el backend la API de comentarios y poder persistirlos.

---

## Contexto frontend

- **Autenticación:** misma que feed y proyectos: `Authorization: Bearer <access_token>`.
- **Modelo en UI:** cada comentario es un objeto `FeedComment` (ver más abajo). Puede ser de primer nivel (`parentId` null/omitido) o respuesta a otro comentario (`parentId` = id del comentario padre). El frontend recibe una **lista plana** de comentarios y agrupa en árbol por `parentId`.
- **Perfil:** el frontend enlaza a `/profile/:authorUsername`; el backend debe devolver `authorName`, `authorUsername` y opcionalmente `authorAvatar` para cada comentario (obtenidos del usuario autor).

---

## Endpoints a implementar (todos con JWT)

Base URL: la misma del backend (ej. `http://localhost:8080`). Todas las peticiones llevan el header:

```
Authorization: Bearer <access_token>
```

---

### 1. Listar comentarios de una publicación

```
GET /feed/posts/:postId/comments
Authorization: Bearer <access_token>
```

- **`:postId`** es el ID (UUID) de la publicación.
- Incluir solo comentarios de esa publicación.
- Orden sugerido: por `createdAt` ascendente (más antiguos primero), para que las respuestas queden en orden y el frontend pueda construir el árbol por `parentId` sin reordenar.

**Query params (opcionales):**

| Parámetro | Tipo   | Descripción |
|-----------|--------|-------------|
| `page`    | number | Página (1-based). Default 1. |
| `limit`   | number | Por página (ej. 50). Default 50, máximo ej. 100. |

**Respuesta 200:** array de comentarios en formato `FeedComment` (ver sección siguiente). Puede ser un array directo `[{ ... }, { ... }]` o un objeto con paginación, por ejemplo:

```json
{
  "comments": [ /* ver formato FeedComment abajo */ ],
  "page": 1,
  "limit": 50,
  "total": 12
}
```

Si se usa objeto con `comments`, el frontend usará `response.comments`; si es array directo, el frontend usará la respuesta como array.

**404** si la publicación no existe. **401** si no hay token o es inválido.  
Si la publicación existe pero el usuario no tiene permiso para verla (p. ej. audiencia "only_me" de otro usuario), devolver **403** o un array vacío según la política del producto.

---

### 2. Crear comentario (o respuesta)

```
POST /feed/posts/:postId/comments
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Body (JSON):**

```json
{
  "text": "¡Muy buen avance!",
  "parentId": null
}
```

Para una **respuesta** a otro comentario:

```json
{
  "text": "Gracias, la landing está en Vercel.",
  "parentId": "uuid-del-comentario-padre"
}
```

| Campo     | Tipo   | Requerido | Descripción |
|-----------|--------|-----------|-------------|
| `text`    | string | sí        | Contenido del comentario. Límite razonable (ej. 2000 caracteres). |
| `parentId`| string | no        | Si se envía, es la respuesta al comentario con ese `id`. Si es `null` o se omite, es un comentario de primer nivel. |

El backend debe:

- Validar que la publicación `postId` exista.
- Si se envía `parentId`, validar que exista un comentario con ese `id` y que pertenezca a la misma publicación `postId`.
- Extraer el usuario autenticado del JWT (`userId` y, si existen, `name`, `email`, username/slug para perfil).
- Crear el comentario asociado a ese usuario, con `postId`, `parentId` (opcional) y `text`.
- Devolver el comentario creado en formato `FeedComment`.

**Respuesta 201:** objeto `FeedComment` (ver sección siguiente).

**400** si `text` está vacío o supera el límite, o si `parentId` no existe o no pertenece al mismo post.  
**404** si la publicación no existe. **401** si no autenticado. **403** si el usuario no puede comentar en esa publicación (p. ej. no tiene permiso para ver el post).

---

## Formato de cada comentario (FeedComment)

El frontend espera cada ítem con esta forma (TypeScript):

```ts
type FeedComment = {
  id: string;
  postId: string;
  parentId?: string | null;
  authorName: string;
  authorUsername?: string | null;
  authorAvatar?: string | null;
  text: string;
  createdAt: string;
};
```

| Campo          | Tipo   | Notas |
|----------------|--------|--------|
| `id`           | string | UUID del comentario. |
| `postId`       | string | ID de la publicación. |
| `parentId`     | string \| null | `null` o omitido = comentario de primer nivel; si es un UUID = respuesta a ese comentario. |
| `authorName`   | string | Nombre para mostrar del autor (desde tabla/objeto de usuario). |
| `authorUsername` | string \| null | Username o slug para el enlace al perfil (`/profile/:authorUsername`). Puede ser `null` si el backend no tiene username. |
| `authorAvatar` | string \| null | URL del avatar del autor si existe; si no, `null` o omitir. |
| `text`        | string | Contenido del comentario. |
| `createdAt`   | string | Fecha en ISO (ej. `"2025-02-22T14:30:00.000Z"`). El frontend la formatea ("Hace 2 h", "Ayer", etc.). |

El backend debe rellenar autor desde el usuario autenticado al **crear** y al **listar** incluir en cada comentario los datos del usuario que lo escribió (nombre, username si existe, avatar si existe).

---

## Resumen para el desarrollador backend

1. **GET /feed/posts/:postId/comments**  
   Listar comentarios de la publicación. Orden por `createdAt` ascendente. Respuesta: array de `FeedComment` o objeto `{ comments, page, limit, total }`. 404 si el post no existe, 401 si no hay token.

2. **POST /feed/posts/:postId/comments**  
   Crear comentario o respuesta. Body: `{ text (obligatorio), parentId (opcional) }`. Validar que el post exista y que `parentId` (si se envía) sea un comentario de ese mismo post. Autor desde JWT. Respuesta 201: objeto `FeedComment`. 400 si validación falla, 404 si no existe el post, 401 si no autenticado.

3. **Formato FeedComment**  
   Incluir en cada ítem: `id`, `postId`, `parentId`, `authorName`, `authorUsername` (opcional), `authorAvatar` (opcional), `text`, `createdAt` (ISO).

4. **Auth**  
   Mismo mecanismo que feed y proyectos: `Authorization: Bearer <access_token>`, validar JWT y asociar cada comentario al `userId` del token.

5. **Perfiles**  
   El frontend usa `authorUsername` para enlazar a `/profile/:authorUsername`. Si el modelo de usuario tiene un campo username o slug, rellenarlo en cada comentario; si no, se puede devolver `null` y el frontend mostrará el nombre sin enlace.

Con esto el frontend puede sustituir el estado local de comentarios por llamadas a esta API (listar al abrir una publicación y POST al comentar o responder).
