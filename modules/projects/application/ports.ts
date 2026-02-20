import type {
  Project,
  ProgressEntry,
  CreateProjectInput,
} from "../domain";

export interface ProgressEntryInput {
  date: string;
  notes?: string;
  percent?: number;
}

export interface ProjectsCatalogPort {
  listProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  createProject(input: CreateProjectInput): Promise<Project>;
  addProgressEntry(
    projectId: string,
    entry: ProgressEntryInput
  ): Promise<ProgressEntry>;
  getProgressHistory(projectId: string): Promise<ProgressEntry[]>;
}
