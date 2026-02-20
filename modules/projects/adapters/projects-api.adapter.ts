/**
 * Projects API adapter: calls backend /projects with JWT.
 * See docs/frontend-projects-api.md.
 */

import type {
  ProjectsCatalogPort,
  ProgressEntryInput,
} from "../application/ports";
import type {
  Project,
  ProgressEntry,
  CreateProjectInput,
  RoadmapWeek,
  LastProgress,
} from "../domain";

const getBaseUrl = () =>
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8080";

/** API response shapes (camelCase from backend) */
interface ApiRoadmapWeek {
  weekNumber?: number;
  week?: number;
  goals?: string[];
  actions?: string[];
}

interface ApiRoadmap {
  weeks?: ApiRoadmapWeek[];
}

interface ApiProgressEntry {
  id: string;
  projectId: string;
  entryDate: string;
  content?: string;
  progressPercent?: number;
  createdAt?: string;
}

interface ApiProject {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  source?: string;
  pitch?: string;
  whyItWins?: string;
  introMessage?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  roadmap?: ApiRoadmap;
  lastProgress?: {
    entryDate: string;
    content?: string;
    progressPercent?: number;
    createdAt?: string;
  };
}

function mapApiWeekToRoadmapWeek(w: ApiRoadmapWeek): RoadmapWeek {
  return {
    week: w.weekNumber ?? w.week,
    goals: w.goals,
    actions: w.actions,
  };
}

function mapApiProjectToProject(api: ApiProject, progress?: ApiProgressEntry[]): Project {
  const roadmap = api.roadmap?.weeks?.map(mapApiWeekToRoadmapWeek);
  const lastProgress: LastProgress | undefined = api.lastProgress
    ? {
        entryDate: api.lastProgress.entryDate,
        content: api.lastProgress.content,
        progressPercent: api.lastProgress.progressPercent,
        createdAt: api.lastProgress.createdAt,
      }
    : undefined;
  const progressMapped: ProgressEntry[] | undefined = progress?.map((p) => ({
    id: p.id,
    projectId: p.projectId,
    date: p.entryDate,
    notes: p.content,
    percent: p.progressPercent,
    createdAt: p.createdAt,
  }));

  return {
    id: api.id,
    title: api.title,
    description: api.description,
    source: api.source === "document" ? "document" : "chat",
    pitch: api.pitch,
    whyItWins: api.whyItWins,
    introMessage: api.introMessage,
    status:
      api.status === "draft" || api.status === "paused" || api.status === "completed"
        ? api.status
        : "active",
    roadmap,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    lastProgress,
    progress: progressMapped?.length ? progressMapped : undefined,
  };
}

export class ProjectsApiAdapter implements ProjectsCatalogPort {
  constructor(private getToken: () => string | null) {}

  private async request<T>(
    path: string,
    options: RequestInit & { method?: string } = {}
  ): Promise<T> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No hay sesión. Inicia sesión para usar tus proyectos.");
    }
    const base = getBaseUrl();
    const url = path.startsWith("http") ? path : `${base}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        (data as { message?: string }).message ||
        (res.status === 401 ? "Sesión expirada. Vuelve a iniciar sesión." : res.statusText);
      throw new Error(msg);
    }
    return data as T;
  }

  async listProjects(): Promise<Project[]> {
    try {
      const raw = await this.request<ApiProject[] | { projects?: ApiProject[] }>("/projects", {
        method: "GET",
      });
      const list = Array.isArray(raw) ? raw : raw?.projects ?? [];
      return list.map((api) => mapApiProjectToProject(api));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("401") || msg.includes("Sesión")) return [];
      throw e;
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      const apiProject = await this.request<ApiProject>(`/projects/${id}`);
      let progress: ApiProgressEntry[] = [];
      try {
        progress = await this.request<ApiProgressEntry[]>(`/projects/${id}/progress`);
      } catch {
        // progress endpoint optional
      }
      return mapApiProjectToProject(apiProject, progress.length ? progress : undefined);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("404") || msg.includes("not found") || msg.includes("403")) return null;
      throw e;
    }
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const body = {
      title: input.title,
      description: input.description ?? undefined,
      source: input.source,
      pitch: input.pitch ?? undefined,
      whyItWins: input.whyItWins ?? undefined,
      introMessage: input.introMessage ?? undefined,
      roadmapWeeks: input.roadmap.map((w) => ({
        week: w.week ?? 0,
        goals: w.goals ?? [],
        actions: w.actions ?? [],
      })),
    };
    const api = await this.request<ApiProject>("/projects", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return mapApiProjectToProject(api);
  }

  async addProgressEntry(
    projectId: string,
    entry: ProgressEntryInput
  ): Promise<ProgressEntry> {
    const body = {
      entryDate: entry.date,
      content: entry.notes ?? undefined,
      progressPercent: entry.percent ?? undefined,
    };
    const api = await this.request<ApiProgressEntry>(
      `/projects/${projectId}/progress`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
    return {
      id: api.id,
      projectId: api.projectId,
      date: api.entryDate,
      notes: api.content,
      percent: api.progressPercent,
      createdAt: api.createdAt,
    };
  }

  async getProgressHistory(projectId: string): Promise<ProgressEntry[]> {
    const list = await this.request<ApiProgressEntry[]>(
      `/projects/${projectId}/progress`
    );
    return list.map((p) => ({
      id: p.id,
      projectId: p.projectId,
      date: p.entryDate,
      notes: p.content,
      percent: p.progressPercent,
      createdAt: p.createdAt,
    }));
  }
}
