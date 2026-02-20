/**
 * Proyectos domain: proyecto = idea seleccionada + roadmap (doc).
 * Aligned with product-vision 5.4: persistence, roadmap 4 weeks, progress entries.
 */

/** One week in the 4-week execution roadmap (from chat/document execution). */
export interface RoadmapWeek {
  week?: number;
  goals?: string[];
  actions?: string[];
}

/** Legacy step shape (title + tasks); still supported for backward compat. */
export interface RoadmapStep {
  week: number;
  title: string;
  tasks: string[];
  checkpoint?: string;
}

export interface BuyerPersona {
  name: string;
  ageRange: string;
  pain: string;
  goal: string;
  whereTheyAre: string;
}

export type ProjectSource = "chat" | "document";

export type ProjectStatus = "draft" | "active" | "paused" | "completed";

/** Last progress entry (from API list response). */
export interface LastProgress {
  entryDate: string;
  content?: string;
  progressPercent?: number;
  createdAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  /** Where the project came from: chat (3 proposals) or document upload. */
  source?: ProjectSource;
  /** From chat flow when user selected one of 3 proposals. */
  pitch?: string;
  whyItWins?: string;
  /** Short intro from assistant (e.g. "He leído tu proyecto..."). */
  introMessage?: string;
  status?: ProjectStatus;
  /** Cover/photo URL (can be set by user in edit; stored in backend or localStorage). */
  imageUrl?: string;
  /** Legacy format for existing mock data. */
  roadmapSteps?: RoadmapStep[];
  /** 4-week roadmap (goals + actions per week). Primary format from execution/API. */
  roadmap?: RoadmapWeek[];
  buyerPersona?: BuyerPersona;
  ideaId?: string;
  createdAt: string;
  updatedAt?: string;
  /** Last progress entry (from GET /projects list). */
  lastProgress?: LastProgress;
  /** Loaded when fetching project detail (progress history). */
  progress?: ProgressEntry[];
}

/** Daily or periodic progress entry (notes + optional %). */
export interface ProgressEntry {
  id: string;
  projectId: string;
  date: string;
  notes?: string;
  percent?: number;
  createdAt?: string;
}

/** Input to create a project (from execution response). */
export interface CreateProjectInput {
  title: string;
  description?: string;
  source: ProjectSource;
  pitch?: string;
  whyItWins?: string;
  /** Optional intro from assistant (e.g. "He leído tu proyecto..."). */
  introMessage?: string;
  roadmap: RoadmapWeek[];
}
