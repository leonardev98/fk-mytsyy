# API del chat IA — 3 modos (EXPLORATION, PROPOSAL, EXECUTION)

Referencia alineada con el backend. Endpoint: `POST /ai/chat`.

## Request

```json
{
  "sessionId": "uuid-de-sesion",
  "message": "Tengo una idea de app para pequeños comercios",
  "history": [
    { "role": "user", "content": "Hola" },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "Tengo una idea de app" }
  ],
  "selectedProposal": null
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `sessionId` | string | no | Identificador de sesión. Se genera una vez con `crypto.randomUUID()`, se persiste en `localStorage` y se incluye en cada request. Para "Nueva conversación" se borra, se genera uno nuevo y se vacía el historial. |
| `message` | string | sí* | Mensaje actual del usuario (máx 4000 caracteres). *Obligatorio si no se envía `attachedContent`. |
| `history` | `{ role: "user" \| "assistant", content: string }[]` | no | Últimos mensajes para que la IA detecte el modo y la siguiente pregunta. |
| `selectedProposal` | `{ title, pitch?, whyItWins? } \| null` | no | Cuando el usuario eligió una propuesta (modo EXECUTION), enviar la seleccionada. No enviar si se envía `attachedContent`. |
| `attachedContent` | string | no | **Flujo "proyecto en documento":** texto extraído del archivo (PDF/TXT/Word). Máx. 50.000 caracteres. Con esto el backend responde en modo `execution` (sin exploración ni 3 propuestas). |

**Frontend:** Siempre enviar `history` en cada request. Una sola llamada por turno.

---

## Respuesta: tres modos

Todas incluyen `data.mode`. Según el modo, el resto cambia.

### Modo 1: `exploration`

- La API puede devolver:
  - `reply`: mensaje conversacional (saludo, reacción, small talk).
  - `questions`: array con **como mucho una** pregunta guía. Puede venir vacío si el turno es solo conversación.
- **Frontend:** Una sola burbuja de asistente: si existe `data.reply`, mostrarlo; si además `data.questions[0]` existe, mostrar después (misma burbuja) `data.questions[0]`. Si solo viene `questions[0]`, mostrar solo esa pregunta. Si solo viene `reply`, mostrar solo el reply. No usar preguntas fijas; todo viene del API. En cada turno enviar `history`.

### Modo 2: `proposal`

- `data.proposals` (3 items con `title`, `pitch`, `whyItWins`) y `data.frontendHint.primaryCTA` (ej. "Seleccionar proyecto").
- **Frontend:** 3 cards con botón según `primaryCTA`. No mostrar roadmap ni "Crear proyecto". Cuando el usuario pulse, enviar en el siguiente request `selectedProposal: { title, pitch, whyItWins }` y `message` (ej. "Esta").

### Modo 3: `execution`

- `data.introMessage` (opcional): mensaje corto del asistente antes del proyecto/roadmap (ej. "He leído tu proyecto. Aquí tienes tu plan para los primeros 30 días."). Suele venir cuando la petición incluyó `attachedContent`.
- `data.selectedProject`: `{ title, description }`.
- `data.roadmap.weeks`: array de 4 semanas con `week`, `goals`, `actions`.
- **Frontend:** Mostrar (si existe) `introMessage`, luego proyecto y plan de 4 semanas. CTA "Crear proyecto" / "Añadir a dashboard".

---

## Chat conversacional (tono coach)

- **Bienvenida inicial:** Un único mensaje corto al abrir (ej. "Hola 👋 Cuando quieras, cuéntame en qué andas o qué te gustaría crear."). No incluir preguntas cruciales; el backend las introduce cuando tenga sentido.
- **Sin preguntas fijas:** El contenido del asistente viene solo del API; no listas predefinidas ni texto que duplique la respuesta del API.

---

## Flujo con documento adjunto (proyecto ya definido)

Si el usuario sube un archivo (PDF, TXT o Word) con su idea o proyecto ya escrito, **no** se muestran preguntas de exploración ni las 3 propuestas: el backend devuelve **directamente** modo `execution` con cronograma de los primeros 30 días.

**Frontend:**

1. **Adjuntar archivo:** Botón de clip en el input; acepta PDF, .txt, .doc/.docx.
2. **Extraer texto en cliente:** Se usa `extract-document-text` (TXT con FileReader, PDF con pdfjs-dist, Word con mammoth). Máx. 50.000 caracteres.
3. **Request:** Se envía `message` (ej. "Te adjunto mi proyecto" o el texto que escriba el usuario) y `attachedContent` (string con el texto extraído). No se envía `selectedProposal` en este flujo.
4. **Respuesta:** El backend devuelve `mode: "execution"` con:
   - `introMessage` (opcional): ej. "He leído tu proyecto. Aquí tienes tu plan para los primeros 30 días."
   - `selectedProject`: { title, description } resumido del documento.
   - `roadmap.weeks`: 4 semanas (objetivos y acciones).

**Visualización:** Una sola burbuja de asistente con: (1) `introMessage` si existe, (2) proyecto (title + description), (3) cronograma por semanas. No se muestran las 3 cards ni preguntas de exploración.

## Evitar la misma pregunta duplicada

- **Una sola llamada por mensaje:** El `POST /ai/chat` no debe dispararse dos veces para el mismo mensaje. En el frontend la llamada está **fuera** del callback de `setState` y el botón se deshabilita con `loading`, para evitar doble clic o doble ejecución (p. ej. en React Strict Mode).
- **Una sola burbuja de asistente por respuesta:** Por cada respuesta del API se añade **un solo** mensaje de asistente al hilo. El mensaje de bienvenida inicial es distinto; la primera pregunta llega solo con la primera respuesta del backend.

---

## Flujo "proyecto en documento"

Si el usuario **sube un archivo** (PDF, TXT o Word) con su proyecto ya definido:

1. **Frontend:** Extraer texto en cliente (PDF.js, FileReader, mammoth) y enviar en `attachedContent` junto con `message` (ej. "Te adjunto mi proyecto"). No enviar `selectedProposal`.
2. **Backend:** Responde en modo **`execution`** (no `exploration` ni `proposal`): `introMessage`, `selectedProject`, `roadmap` (4 semanas).
3. **Frontend:** Una sola burbuja: intro (si existe) + proyecto + cronograma 30 días. **No** mostrar las 3 cards de propuestas ni preguntas de exploración.

Si el usuario **solo escribe** en el chat, el flujo es el normal: exploration → proposal → execution al elegir una propuesta.

---

## Errores

- **400** — Body inválido (`message` vacío o demasiado largo).
- **503** — Servicio no disponible (p. ej. `OPENAI_API_KEY` no configurada).
