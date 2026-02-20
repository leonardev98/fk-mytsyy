/**
 * Payload returned by the backend with the assistant message.
 * Frontend renders dynamically according to mode.
 */

export type ChatMode = "exploration" | "proposal" | "execution";

export interface ExplorationData {
  /** Mensaje conversacional (saludo, reacción, small talk). */
  reply?: string;
  /** Como mucho una pregunta guía por turno. Puede venir vacío si el turno es solo conversación. */
  questions?: string[];
}

export interface ProposalItem {
  title?: string;
  pitch?: string;
  whyItWins?: string;
}

export interface ProposalData {
  proposals?: ProposalItem[];
  /** Texto del botón en cada card (ej. "Seleccionar proyecto"). */
  frontendHint?: { primaryCTA?: string };
}

export interface RoadmapWeek {
  week?: number;
  goals?: string[];
  actions?: string[];
}

export interface SelectedProject {
  title?: string;
  description?: string;
}

export interface ExecutionData {
  /** Mensaje corto del asistente antes del proyecto/roadmap (ej. "He leído tu proyecto. Aquí tienes tu plan para los primeros 30 días."). */
  introMessage?: string;
  /** Proyecto elegido (objeto con title, description). */
  selectedProject?: SelectedProject;
  roadmap?: {
    weeks?: RoadmapWeek[];
  };
}

export type AssistantPayload =
  | { mode: "exploration"; data: ExplorationData }
  | { mode: "proposal"; data: ProposalData }
  | { mode: "execution"; data: ExecutionData };
