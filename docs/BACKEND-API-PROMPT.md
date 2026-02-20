# API de proyectos y progreso (referencia frontend ↔ backend)

El frontend **ya usa** registro, login y chat (`/auth/register`, `/auth/login`, `/auth/me`, `POST /ai/chat`).

La **API de proyectos y progreso** está **implementada en el backend** y cumple esta especificación. El frontend envía el JWT del login en `Authorization: Bearer <token>`; el backend usa AuthGuard y devuelve/modifica solo proyectos del usuario.

| # | Endpoint | Estado |
|---|----------|--------|
| 1 | POST /projects | ✅ |
| 2 | GET /projects | ✅ |
| 3 | GET /projects/:id | ✅ |
| 4 | POST /projects/:id/progress | ✅ |
| 5 | GET /projects/:id/progress | ✅ |
| 6 | PATCH /projects/:id/status | ✅ |
| 7 | PUT/PATCH /projects/:id/cover (foto de portada) | pendiente |

**Foto de portada:** ver [BACKEND-PROJECT-COVER-IMAGE.md](./BACKEND-PROJECT-COVER-IMAGE.md) para casuística y prompt del servicio de imagen de proyecto (guardar en BD/almacenamiento y exponer `imageUrl`).

A continuación, la especificación que ambos lados respetan.

---

## Endpoints a implementar (todos con JWT)

En todas las peticiones:

```
Authorization: Bearer <access_token>
```

---

### 1. Crear proyecto

```
POST /projects
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Marketplace de comercios locales",
  "description": "Una plaza digital donde barrios compran y venden con un clic.",
  "source": "chat",
  "pitch": "...",
  "whyItWins": "...",
  "introMessage": "He leído tu proyecto. Aquí tienes tu plan para los primeros 30 días.",
  "roadmapWeeks": [
    { "week": 1, "goals": ["Definir oferta"], "actions": ["Escribir propuesta de valor"] },
    { "week": 2, "goals": ["Crear landing"], "actions": ["Diseñar y publicar página"] },
    { "week": 3, "goals": ["Optimizar pitch"], "actions": ["A/B test mensajes"] },
    { "week": 4, "goals": ["Medir tracción"], "actions": ["Revisar métricas"] }
  ]
}
```

| Campo           | Tipo   | Requerido | Descripción |
|----------------|--------|-----------|-------------|
| `title`        | string | sí        | Máx 500 caracteres. |
| `description`  | string | no        | |
| `source`       | string | no        | `"chat"` o `"document"`. Default `"chat"`. |
| `pitch`        | string | no        | |
| `whyItWins`    | string | no        | |
| `introMessage` | string | no        | |
| `roadmapWeeks` | array  | sí        | 1–4 elementos: `{ week, goals[], actions[] }`. |

**Respuesta 201:** proyecto creado con `id`, `userId`, `title`, `description`, `source`, `pitch`, `whyItWins`, `introMessage`, `status` (ej. `"active"`), `createdAt`, `updatedAt`, y relación `roadmap` con `weeks` (cada semana: `weekNumber`, `goals`, `actions`).

---

### 2. Listar proyectos del usuario

```
GET /projects
```

**Respuesta 200:** **array** de proyectos del usuario, ordenados por `updatedAt` descendente. Cada elemento:

- Campos del proyecto: `id`, `title`, `description`, `source`, `status`, `imageUrl` (opcional, URL de la foto de portada), `createdAt`, `updatedAt`, etc.
- `roadmap` con `weeks` (objetivos y acciones por semana).
- `lastProgress`: último avance (si existe): `{ entryDate, content, progressPercent, createdAt }`; si no hay ninguno, `lastProgress: null`.

El frontend acepta tanto un array directo `[{ ... }, { ... }]` como `{ "projects": [...] }`.

---

### 3. Ver un proyecto

```
GET /projects/:id
```

**Respuesta 200:** proyecto con `roadmap.weeks` y `imageUrl` (opcional).  
**403** si no es del usuario. **404** si no existe.

---

### 4. Añadir entrada de progreso

```
POST /projects/:id/progress
Content-Type: application/json
```

**Body:**
```json
{
  "entryDate": "2025-02-20",
  "content": "Definí la propuesta de valor y empecé el landing.",
  "progressPercent": 15
}
```

| Campo            | Tipo   | Requerido | Descripción |
|------------------|--------|-----------|-------------|
| `entryDate`      | string | sí        | YYYY-MM-DD. |
| `content`        | string | no        | Notas. |
| `progressPercent`| number | no        | 0–100. |

**Respuesta 201:** entrada creada (`id`, `projectId`, `entryDate`, `content`, `progressPercent`, `createdAt`).

---

### 5. Listar progreso de un proyecto

```
GET /projects/:id/progress
```

**Respuesta 200:** array de entradas de progreso, ordenadas por fecha descendente (límite ej. 100).

---

### 6. Actualizar estado del proyecto (opcional)

```
PATCH /projects/:id/status
Content-Type: application/json
```

**Body:** `{ "status": "active" }` — valores: `draft`, `active`, `paused`, `completed`.  
**Respuesta 200:** proyecto actualizado.

---

## SQL de referencia

Esquema de tablas sugerido en `docs/sql/002_create_projects_roadmap_progress.sql` (proyectos, roadmaps, roadmap_weeks, progress_entries), asumiendo que ya existe la tabla `users` del login. Para la foto de portada añadir columna `image_url TEXT` en `projects` (ver [BACKEND-PROJECT-COVER-IMAGE.md](./BACKEND-PROJECT-COVER-IMAGE.md)).
