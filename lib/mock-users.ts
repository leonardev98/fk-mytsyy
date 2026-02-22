export interface MockProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  progressPercent: number;
}

export interface MockIdea {
  id: string;
  title: string;
  category: string;
  likes: number;
  date: string;
}

export interface MockActivityItem {
  id: string;
  type: "project" | "idea" | "interview" | "milestone";
  title: string;
  date: string;
  description?: string;
}

export interface MockUserStats {
  projectsCount: number;
  ideasCount: number;
  mockInterviews: number;
  level: string;
  streak: number;
}

export interface MockAchievement {
  id: string;
  title: string;
  description?: string;
  icon: string;
}

export interface MockUser {
  name: string;
  username: string;
  bio: string;
  location: string;
  website?: string;
  avatarUrl?: string;
  projects: MockProject[];
  ideas: MockIdea[];
  activity: MockActivityItem[];
  achievements: MockAchievement[];
  stats: MockUserStats;
}

export const mockUsers: Record<string, MockUser> = {
  "leonard-andrews": {
    name: "Leonard Andrews",
    username: "leonard-andrews",
    bio: "AI Builder | Fullstack Developer",
    location: "Perú",
    website: "https://leonard.dev",
    avatarUrl: undefined,
    projects: [
      {
        id: "1",
        title: "Marketplace de comercios locales",
        description: "Una plaza digital donde barrios compran y venden con un clic.",
        tags: ["Next.js", "AI"],
        date: "2025-02-15",
        progressPercent: 45,
      },
      {
        id: "2",
        title: "CRM para pymes",
        description: "Gestión de clientes simple y efectiva para pequeñas empresas.",
        tags: ["React", "Node.js"],
        date: "2025-02-10",
        progressPercent: 72,
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
      {
        id: "2",
        title: "Marketplace de artesanos locales",
        category: "E-commerce",
        likes: 24,
        date: "2025-02-08",
      },
    ],
    achievements: [
      { id: "a1", title: "Primer proyecto", icon: "🚀", description: "Completaste tu primer proyecto" },
      { id: "a2", title: "Racha de 7 días", icon: "🔥", description: "7 días consecutivos activo" },
      { id: "a3", title: "5 ideas publicadas", icon: "💡", description: "Compartiste 5 ideas" },
    ],
    activity: [
      {
        id: "1",
        type: "project",
        title: "Actualizó progreso en Marketplace de comercios",
        date: "2025-02-20",
        description: "Avance al 45% — Landing publicada",
      },
      {
        id: "2",
        type: "idea",
        title: "Publicó idea: App de rutas para delivery",
        date: "2025-02-10",
      },
      {
        id: "3",
        type: "milestone",
        title: "Alcanzó racha de 7 días",
        date: "2025-02-18",
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
  mariag: {
    achievements: [
      { id: "a4", title: "2 proyectos completados", icon: "🏆" },
      { id: "a5", title: "Racha de 12 días", icon: "🔥" },
    ],
    name: "María García",
    username: "mariag",
    bio: "Builder enfocada en SaaS B2B. 30 días para validar.",
    location: "España",
    website: "https://mariagarcia.dev",
    avatarUrl: undefined,
    projects: [
      {
        id: "3",
        title: "App de reservas para peluquerías",
        description: "Sistema de citas online para salones de belleza.",
        tags: ["Vue", "Firebase"],
        date: "2025-02-12",
        progressPercent: 100,
      },
      {
        id: "4",
        title: "CRM pymes",
        description: "Herramienta de gestión de clientes para pequeñas empresas.",
        tags: ["Next.js", "PostgreSQL"],
        date: "2025-02-18",
        progressPercent: 40,
      },
    ],
    ideas: [
      {
        id: "3",
        title: "Plataforma de cursos para freelancers",
        category: "Educación",
        likes: 8,
        date: "2025-02-14",
      },
    ],
    activity: [
      {
        id: "4",
        type: "project",
        title: "Completó App de reservas",
        date: "2025-02-15",
      },
      {
        id: "5",
        type: "interview",
        title: "Entrevista simulada completada",
        date: "2025-02-14",
      },
    ],
    stats: {
      projectsCount: 4,
      ideasCount: 3,
      mockInterviews: 2,
      level: "Builder",
      streak: 12,
    },
  },
  carlosr: {
    name: "Carlos Ruiz",
    username: "carlosr",
    bio: "Emprendedor digital. Construyendo en público.",
    location: "México",
    avatarUrl: undefined,
    projects: [
      {
        id: "5",
        title: "Marketplace de cursos locales",
        description: "Conectando instructores con estudiantes en la misma ciudad.",
        tags: ["React", "Stripe"],
        date: "2025-02-16",
        progressPercent: 60,
      },
    ],
    ideas: [],
    achievements: [
      { id: "a6", title: "Primer cliente", icon: "🎉" },
    ],
    activity: [
      {
        id: "6",
        type: "milestone",
        title: "Primer cliente conseguido",
        date: "2025-02-19",
      },
    ],
    stats: {
      projectsCount: 2,
      ideasCount: 5,
      mockInterviews: 1,
      level: "Starter",
      streak: 18,
    },
  },
  analopez: {
    name: "Ana López",
    username: "analopez",
    bio: "Product builder. MVP en 30 días.",
    location: "Colombia",
    avatarUrl: undefined,
    projects: [
      {
        id: "6",
        title: "Dashboard de métricas para tiendas",
        description: "Visualización de ventas y stock en tiempo real.",
        tags: ["Next.js", "Chart.js"],
        date: "2025-02-17",
        progressPercent: 70,
      },
    ],
    ideas: [
      {
        id: "4",
        title: "App de inventario para ferreterías",
        category: "Retail",
        likes: 15,
        date: "2025-02-12",
      },
    ],
    achievements: [
      { id: "a7", title: "Racha de 21 días", icon: "🔥" },
    ],
    activity: [],
    stats: {
      projectsCount: 3,
      ideasCount: 7,
      mockInterviews: 4,
      level: "Builder",
      streak: 21,
    },
  },
};

const DEFAULT_USER: MockUser = {
  name: "Builder",
  username: "unknown",
  bio: "Construyendo en público.",
  location: "—",
  projects: [],
  ideas: [],
  activity: [],
  achievements: [],
  stats: {
    projectsCount: 0,
    ideasCount: 0,
    mockInterviews: 0,
    level: "Starter",
    streak: 0,
  },
};

export function getMockUser(username: string): MockUser {
  const user = mockUsers[username];
  if (user) return user;
  return { ...DEFAULT_USER, username };
}
