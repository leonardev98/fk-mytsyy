# 🚀 Prompt Frontend – Página de Perfil Pública + Navegación desde Dashboard (MYTSYY)

Estoy desarrollando el frontend de **MYTSYY** con Next.js (App Router), TypeScript y TailwindCSS.

Quiero implementar una **página de perfil público por usuario**, similar a LinkedIn / GitHub, donde cualquier persona pueda ver:

- Información del usuario
- Sus proyectos
- Sus ideas
- Su actividad
- Métricas visibles

Todo esto inicialmente **solo a nivel frontend** (mock data), sin backend todavía.

---

## 🎯 Objetivo

1. Cada usuario debe tener una ruta pública:

   ```
   /profile/[username]
   ```

   Ejemplo:

   ```
   /profile/leonard-andrews
   ```

2. Desde el Dashboard, al hacer click en el nombre o avatar del usuario, debe navegar automáticamente a su página de perfil.

---

## 🧱 Estructura Técnica (Frontend Only)

### 📂 Estructura de carpetas (Next.js App Router)

```
app/
 ├── dashboard/
 │    └── page.tsx
 ├── profile/
 │    └── [username]/
 │         └── page.tsx
components/
 ├── profile/
 │    ├── ProfileHeader.tsx
 │    ├── ProfileProjects.tsx
 │    ├── ProfileIdeas.tsx
 │    ├── ProfileStats.tsx
 │    └── ProfileActivity.tsx
lib/
 └── mock-users.ts
```

---

## 🖥 Página de Perfil – Layout

### 1. Header del perfil (estilo GitHub + LinkedIn)

Debe incluir:

- Avatar grande redondo
- Nombre completo
- Username (@handle)
- Tagline profesional
- Botón "Editar perfil" (solo visible si es el usuario actual)
- Botón "Seguir" (UI solamente por ahora)
- Ubicación
- Enlace web o portafolio

**Diseño:**

- Minimalista
- Profesional
- Responsive
- Dark mode first

---

### 2. Sección de estadísticas (horizontal)

Mostrar métricas tipo GitHub:

- Proyectos creados
- Ideas publicadas
- Entrevistas simuladas
- Nivel actual
- Streak de actividad

Usar cards pequeñas con diseño moderno.

---

### 3. Tabs estilo GitHub

Crear tabs:

- 🧠 Proyectos
- 💡 Ideas
- 📊 Actividad
- 🏆 Logros

Que cambien el contenido **sin recargar la página** (state local).

---

### 4. Sección de Proyectos

Cada proyecto debe mostrarse como card:

- Título
- Descripción corta
- Tags
- Fecha
- Nivel de progreso
- Botón "Ver más"

Diseño limpio estilo GitHub repositories.

---

### 5. Sección de Ideas

Similar a proyectos pero más simple:

- Título
- Categoría
- Likes (UI)
- Fecha

---

## 🔄 Navegación desde Dashboard

En el Dashboard:

- El nombre del usuario debe ser un `<Link>` hacia `/profile/[username]`
- El avatar también debe ser clickeable
- Usar `next/link`
- Sin refresh completo

---

## 🎨 Estilo Visual

- TailwindCSS
- Cards con `rounded-2xl`
- Bordes sutiles
- Fondo oscuro elegante
- Hover effects suaves
- Animaciones ligeras con `transition`
- Layout `max-w-6xl` centrado

---

## 🧪 Mock Data

Crear archivo `lib/mock-users.ts`:

```ts
interface MockProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  progressPercent: number;
}

interface MockIdea {
  id: string;
  title: string;
  category: string;
  likes: number;
  date: string;
}

interface MockUser {
  name: string;
  username: string;
  bio: string;
  location: string;
  website?: string;
  avatarUrl?: string;
  projects: MockProject[];
  ideas: MockIdea[];
  stats: { projectsCount: number; ideasCount: number; mockInterviews: number; level: string; streak: number };
}

export const mockUsers: Record<string, MockUser> = {
  "leonard-andrews": {
    name: "Leonard Andrews",
    username: "leonard-andrews",
    bio: "AI Builder | Fullstack Developer",
    location: "Perú",
    website: "https://leonard.dev",
    avatarUrl: "/avatars/leonard.jpg",
    projects: [
      {
        id: "1",
        title: "Marketplace de comercios locales",
        description: "Una plaza digital donde barrios compran y venden.",
        tags: ["Next.js", "AI"],
        date: "2025-02-15",
        progressPercent: 45,
      },
    ],
    ideas: [
      {
        id: "1",
        title: "App de rutas para delivery",
        category: "Logística",
        likes: 12,
        date: "2025-02-10",
      },
    ],
    stats: {
      projectsCount: 5,
      ideasCount: 12,
      mockInterviews: 3,
      level: "Builder",
      streak: 7,
    },
  },
};
```

La página debe renderizar datos dinámicos basados en `params.username`.

---

## ⚡ Requisitos Técnicos

- TypeScript estricto
- Componentes reutilizables
- Responsive
- Buen manejo de layout
- Código limpio y escalable
- Separación clara de componentes

---

## 🎯 Resultado Esperado

El perfil debe:

- Sentirse profesional
- Ser compartible públicamente
- Motivar al usuario a construir proyectos
- Verse tipo SaaS premium
- Ser escalable para luego conectar backend

---

## 📎 Referencias

- [BACKEND-API-PROMPT.md](./BACKEND-API-PROMPT.md) – API de proyectos y progreso (para futura integración)
- [architecture.md](./architecture.md) – Arquitectura general del proyecto
