# Foto de portada de proyecto — casuística y prompt para backend

## 1. Casuística (por qué guardar en BD)

### Situación actual (frontend)

- Cada proyecto puede tener una **foto de portada** (cover) que el usuario sube en la vista de detalle del proyecto.
- Hoy esa foto se guarda **solo en el navegador** (`localStorage`), con clave `mytsyy_project_image:<projectId>`.
- **Problemas de guardar en localStorage:**
  - La foto **no se sincroniza**: si el usuario entra desde otro dispositivo o borra datos del navegador, pierde la imagen.
  - **Límite de espacio** (~5 MB por origen): con varias fotos o imágenes grandes, falla el guardado sin mensaje claro (ya mitigado en front con compresión y mensaje de error).
  - No hay **persistencia real**: la imagen es del proyecto, debería vivir en el backend junto con el resto del proyecto.

### Comportamiento deseado

- La foto de portada es **un dato más del proyecto** y debe **persistir en la base de datos** (o en almacenamiento asociado al backend).
- **Un proyecto = una foto de portada** (opcional). Si el usuario sube otra, se reemplaza.
- El frontend ya tiene:
  - Modelo de dominio: `Project.imageUrl?: string`.
  - UI en detalle de proyecto: botón “Añadir foto” / “Cambiar foto”, preview de la imagen.
  - Cuando el backend exponga `imageUrl` en `GET /projects` y `GET /projects/:id`, el frontend usará esa URL en lugar de localStorage. Además, el frontend enviará la nueva imagen al backend cuando el usuario suba o cambie la foto (nuevo endpoint de “subir portada”).

### Resumen

| Dónde se guarda | Ventaja | Desventaja |
|-----------------|--------|------------|
| Solo localStorage (actual) | Sin cambios en backend | No persiste entre dispositivos, límite de espacio, se pierde al limpiar datos |
| **Base de datos / almacenamiento backend** | Persistente, por usuario y proyecto, mismo criterio que el resto de la API | Backend debe implementar almacenamiento (columna URL o blob + endpoint de subida) |

**Conclusión:** La foto de portada debe guardarse en el backend (BD o almacenamiento de archivos) y servirse como `imageUrl` en la API de proyectos.

---

## 2. Prompt para el backend (implementar o editar servicio)

Puedes copiar y pegar el siguiente bloque para que el backend implemente o adapte el servicio de foto de portada.

---

**OBJETIVO:** Persistir la foto de portada de cada proyecto en el backend y exponerla en la API de proyectos.

**CONTEXTO:** El frontend ya usa `GET /projects`, `GET /projects/:id`, etc. con JWT. Necesita poder (1) leer la URL de la portada del proyecto (`imageUrl`) en esas respuestas, y (2) subir o actualizar la portada con un nuevo endpoint.

**REQUISITOS:**

1. **Modelo de datos**
   - Añadir al proyecto un campo que represente la imagen de portada. Opciones:
     - **Recomendada:** columna `image_url` (TEXT/VARCHAR) en la tabla `projects`. La imagen se guarda en almacenamiento de archivos (disco, S3, etc.) y en `image_url` se guarda la URL pública (o la ruta relativa que el servidor sirva como URL).
     - Alternativa: columna BLOB/bytea si se almacena la imagen directamente en la BD (menos escalable para imágenes grandes).
   - Si la tabla ya existe sin la columna, añadir una migración: `ALTER TABLE projects ADD COLUMN image_url TEXT;` (o el tipo que uséis).

2. **Respuestas de API existentes**
   - En **GET /projects** (listado): incluir en cada proyecto el campo `imageUrl` (o `image_url` si el backend devuelve snake_case; el frontend puede mapear a `imageUrl`).
   - En **GET /projects/:id** (detalle): incluir el mismo campo `imageUrl` / `image_url` en el objeto proyecto.
   - Mismo criterio de autorización que el resto: solo proyectos del usuario autenticado.

3. **Nuevo endpoint: subir o actualizar la portada del proyecto**
   - **Método y ruta:** `PUT /projects/:id/cover` o `PATCH /projects/:id/cover` (o `POST /projects/:id/cover` si preferís “crear/actualizar” en un solo verbo).
   - **Autenticación:** JWT obligatorio (`Authorization: Bearer <token>`). Solo el dueño del proyecto puede subir la portada.
   - **Cuerpo de la petición:** una de las dos formas (la que encaje con vuestra stack):
     - **Opción A (recomendada):** `multipart/form-data` con un campo de tipo file (ej. `file` o `cover`). Aceptar formatos de imagen (JPEG, PNG, WebP). Tamaño máximo recomendado: por ejemplo 2–5 MB.
     - **Opción B:** `Content-Type: application/json` con un campo que contenga la imagen en **base64** (data URL o string base64), por ejemplo `{ "image": "data:image/jpeg;base64,..." }`. Útil si el frontend ya trabaja con data URL; el backend decodifica, guarda el archivo y guarda la URL en `projects.image_url`.
   - **Comportamiento:**
     - Si el proyecto no existe o no pertenece al usuario: **404** o **403** según vuestra convención.
     - Si la petición es válida: guardar la imagen (en disco, S3, etc.), actualizar `projects.image_url` con la URL (o ruta que se traduzca en URL) y actualizar `updated_at` del proyecto.
     - Respuesta **200:** cuerpo con el proyecto actualizado, incluyendo el campo `imageUrl` (o `image_url`) con la URL desde la que se puede servir la imagen. Así el frontend puede actualizar la UI sin hacer un GET adicional.
   - **Opcional:** si el frontend envía cuerpo vacío o un flag “eliminar portada”, podéis soportar **DELETE /projects/:id/cover** (o un `PATCH` con `imageUrl: null`) para poner `image_url` a NULL y borrar el archivo si lo tenéis en almacenamiento.

4. **Seguridad y buenas prácticas**
   - Validar que el archivo sea realmente una imagen (por tipo MIME o magic bytes) y rechazar el resto.
   - Limitar tamaño (ej. 2–5 MB por imagen).
   - No ejecutar el contenido subido; guardar como archivo estático y servir por URL.
   - Si usáis almacenamiento externo (S3, etc.), generar URLs firmadas o públicas según vuestra política.

5. **Resumen de contratos para el frontend**
   - **GET /projects** y **GET /projects/:id:** objeto(s) proyecto con `imageUrl` (string o null).
   - **PUT/PATCH/POST /projects/:id/cover:** body = multipart file o JSON con base64; respuesta 200 = proyecto actualizado con `imageUrl` rellenado.
   - Opcional: **DELETE /projects/:id/cover** (o equivalente) para quitar la portada (`imageUrl` null).

Cuando esto esté implementado, el frontend dejará de usar `localStorage` para la portada y usará solo la API (lectura en GET y subida en el nuevo endpoint).

---

## 3. Referencia rápida para el frontend (después del backend)

Cuando el backend exponga lo anterior:

- En **GET /projects** y **GET /projects/:id**, el frontend usará `project.imageUrl` para mostrar la portada en listado y detalle.
- Para “Añadir foto” / “Cambiar foto”, el frontend enviará la imagen a **PUT/PATCH/POST /projects/:id/cover** (multipart o base64 según lo que el backend acepte) y mostrará la respuesta (proyecto con `imageUrl`) en la UI.
- Se podrá eliminar el uso de `localStorage` para imágenes de proyecto (módulo `project-image.ts` o equivalente) y usar solo la API y, si hace falta, una capa de adaptador que llame al nuevo endpoint.
