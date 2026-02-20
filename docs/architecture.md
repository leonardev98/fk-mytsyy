# Arquitectura del proyecto

El frontend sigue **arquitectura hexagonal** (ports & adapters) y **SOLID**, organizado por **módulos**.

---

## Estructura por módulos

Cada feature vive en `modules/<nombre>/` con capas claras:

```
modules/
  <module>/
    domain/          # Entidades, tipos, value objects. Sin dependencias externas.
    application/     # Puertos (interfaces) y casos de uso. Depende solo de domain.
    adapters/        # Implementaciones de puertos (mock, API, etc.).
    ui/              # Componentes de presentación. Usan application, no adapters.
    index.ts         # Barrel: API pública del módulo.
```

- **Domain**: reglas y tipos del negocio. Cero dependencias de framework o I/O.
- **Application**: orquestación y contratos (ports). Los casos de uso dependen de los puertos, no de implementaciones concretas.
- **Adapters**: implementan los puertos (ej. `ChatMockAdapter`, luego `ChatApiAdapter`). Sustituibles sin tocar domain ni UI.
- **UI**: componentes que usan hooks/casos de uso; el puerto se inyecta por contexto o props desde el composition root.

---

## SOLID aplicado

| Principio | Cómo se aplica |
|-----------|-----------------|
| **S** Single Responsibility | Cada archivo/capa tiene una razón de cambio (domain = tipos, application = flujo, adapters = I/O, ui = presentación). |
| **O** Open/Closed | Nuevos adapters (ej. API real) sin modificar use cases ni UI. |
| **L** Liskov | Cualquier implementación de un port es sustituible por otra. |
| **I** Interface Segregation | Ports pequeños y específicos (ej. `ChatServicePort` con `getInitialMessages` y `sendMessage`). |
| **D** Dependency Inversion | UI y use cases dependen de abstracciones (ports); la app inyecta implementaciones (adapters) en el composition root. |

---

## Composition root

La **inyección del adapter** se hace en un único lugar (composition root), típicamente en `app/` o en un componente cliente dedicado:

- `app/components/ChatScene.tsx` crea `ChatMockAdapter` y lo pasa a `ChatServiceProvider`.
- Cuando exista backend, se sustituye por `ChatApiAdapter` solo en ese punto; el resto del módulo chat no cambia.

---

## App Router (Next.js)

- `app/`: solo rutas, layout y composición. Importa desde `@/modules/<module>`.
- Las páginas son Server Components por defecto; la composición con hooks/context va en Client Components (ej. `ChatScene`).

---

## Convenciones

1. **Imports**: desde fuera del módulo, importar solo desde el barrel: `@/modules/chat`.
2. **Dependencias entre capas**:  
   `domain` ← `application` ← `adapters`  
   `application` ← `ui`  
   Nunca: `ui` → `adapters`, ni `domain` → nada.
3. **Nuevos módulos**: replicar la estructura `domain`, `application`, `adapters`, `ui` e `index.ts`.

---

## Módulos y rutas (flujo guiado)

Navegación principal: **Dashboard** | **Explorar** (si no hay proyecto activo) | **Perfil**.

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/dashboard`. |
| `/dashboard` | Página principal. Sin sesión: CTA login. Sin proyecto activo: CTA a Explorar. Con proyecto: resumen, semana actual, progreso, tareas, validación, "Reportar resultados". |
| `/explorar` | Explorar ideas; elegir una crea proyecto activo y redirige a dashboard. Requiere login. |
| `/dashboard/proyecto` | Proyecto activo con pestañas: Plan (buyer persona + roadmap), Tareas, Validación, Branding (mejor nombre). |
| `/perfil` | Perfil de usuario. |
| `/login`, `/signup` | Auth. |
| `/marketplace` | Fuera del MVP nav; "Próximamente" (ruta sigue existiendo). |

Estado global: **ActiveProject** (id del proyecto activo en localStorage) para mostrar/ocultar Explorar y cargar el proyecto en dashboard.
