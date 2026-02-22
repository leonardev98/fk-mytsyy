import type { Message } from "../domain";
import type { AssistantPayload } from "../domain/assistant-payload";

/**
 * Port: abstraction for chat I/O.
 * Implemented by adapters (mock, API). UI and use cases depend only on this.
 * SOLID: Dependency Inversion — depend on abstraction, not concrete adapter.
 */

export interface ChatHistoryEntry {
  role: "user" | "assistant";
  content: string;
}

export interface SelectedProposal {
  title?: string;
  pitch?: string;
  whyItWins?: string;
}

export interface SendMessageOptions {
  /** Identificador de sesión para contexto de conversación en el backend. */
  sessionId?: string;
  /** Cuando el usuario elige una card en proposal: objeto completo de la propuesta elegida. */
  selectedProposal?: SelectedProposal;
  /** Historial de la conversación para que la IA sepa qué se preguntó ya (exploration: siguiente pregunta correcta). */
  history?: ChatHistoryEntry[];
  /** Texto extraído de un documento adjunto (PDF/TXT/Word). Máx. 50.000 caracteres. Flujo "proyecto en documento": sin exploración ni 3 propuestas, directo a roadmap 30 días. */
  attachedContent?: string;
}

export interface SendMessageResult {
  message: Message;
  hasProjectIdea?: boolean;
  /** Mode from backend: exploration | proposal | execution. */
  payload?: AssistantPayload;
}

export interface ChatServicePort {
  getInitialMessages(): Message[] | Promise<Message[]>;

  /**
   * Sends user content (and optional selectedProposalTitle) and returns the assistant reply.
   * payload.mode tells the UI how to render: exploration (questions), proposal (cards), execution (roadmap).
   */
  sendMessage(
    userContent: string,
    options?: SendMessageOptions
  ): Promise<SendMessageResult>;
}
