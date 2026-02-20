import { createMessage } from "../domain";
import type { AssistantPayload } from "../domain/assistant-payload";
import type { ChatServicePort, SendMessageOptions, SendMessageResult } from "../application/ports";
import type { Message } from "../domain";

const getBaseUrl = () =>
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8080";

/** Response shape from POST /ai/chat — consume exactamente el JSON del backend */
interface AiChatProfile {
  skills?: string[];
  timeAvailable?: number;
  capitalAvailable?: number;
  location?: string;
  language?: "es" | "en";
}

interface AiChatProposal {
  title?: string;
  pitch?: string;
  whyItWins?: string;
  description?: string;
  businessModel?: string;
  whyThisIsScalable?: string;
  score?: number;
  risks?: string[];
  nextBestStep?: string;
}

interface AiChatData {
  mode?: "exploration" | "proposal" | "execution";
  /** Mensaje conversacional en exploration (saludo, reacción). */
  reply?: string;
  questions?: string[];
  proposals?: AiChatProposal[];
  frontendHint?: { primaryCTA?: string };
  /** En execution con documento adjunto: mensaje corto antes del proyecto/roadmap. */
  introMessage?: string;
  selectedProject?: { title?: string; description?: string };
  rawInput?: string;
  interpretedIntent?: string;
  hasProjectIdea?: boolean;
  conversationReply?: string;
  profile?: AiChatProfile;
  assumptions?: string[];
  recommendedProposalIndex?: number;
  recommendedReason?: string;
  roadmap?: {
    weeks?: Array<{
      week?: number;
      goals?: string[];
      actions?: string[];
    }>;
  };
}

interface AiChatResponse {
  success?: boolean;
  data?: AiChatData;
  message?: string;
}

function buildPayload(data: AiChatData): AssistantPayload | undefined {
  const mode = data.mode;
  if (!mode) return undefined;

  if (mode === "exploration") {
    return {
      mode: "exploration",
      data: {
        reply: data.reply,
        questions: data.questions ?? [],
      },
    };
  }

  if (mode === "proposal") {
    const proposals = (data.proposals ?? []).map((p) => ({
      title: p.title,
      pitch: p.pitch,
      whyItWins: p.whyItWins,
    }));
    return {
      mode: "proposal",
      data: {
        proposals,
        frontendHint: data.frontendHint ? { primaryCTA: data.frontendHint.primaryCTA } : undefined,
      },
    };
  }

  if (mode === "execution") {
    return {
      mode: "execution",
      data: {
        introMessage: data.introMessage,
        selectedProject: data.selectedProject,
        roadmap: data.roadmap,
      },
    };
  }

  return undefined;
}

function fallbackMessage(data: AiChatData): string {
  if (data.conversationReply?.trim()) return data.conversationReply.trim();
  if (data.mode === "exploration") {
    const reply = data.reply?.trim() ?? "";
    const question = data.questions?.[0]?.trim() ?? "";
    if (reply && question) return `${reply}\n\n${question}`;
    return reply || question;
  }
  if (data.mode === "proposal" && data.proposals?.length) {
    return "";
  }
  if (data.mode === "execution") {
    return "";
  }
  return "Cuéntame en una frase qué quieres crear.";
}

/**
 * Adapter: calls backend POST /ai/chat.
 * Returns message + payload (mode + data) for dynamic UI rendering.
 */
export class ChatApiAdapter implements ChatServicePort {
  getInitialMessages(): Message[] {
    return [
      createMessage(
        "0",
        "assistant",
        "Hola 👋 Cuando quieras, cuéntame en qué andas o qué te gustaría crear."
      ),
    ];
  }

  async sendMessage(
    userContent: string,
    options?: SendMessageOptions
  ): Promise<SendMessageResult> {
    const trimmed = userContent.trim();
    const selectedProposal = options?.selectedProposal;
    const attachedContent = options?.attachedContent?.slice(0, 50_000)?.trim();

    const hasAttachment = Boolean(attachedContent);
    if (!trimmed && !selectedProposal && !hasAttachment) {
      return {
        message: createMessage(
          crypto.randomUUID(),
          "assistant",
          "Escribe tu idea o objetivo en una frase para que pueda ayudarte."
        ),
        hasProjectIdea: false,
      };
    }

    if (trimmed.length > 4000) {
      return {
        message: createMessage(
          crypto.randomUUID(),
          "assistant",
          "El mensaje es demasiado largo. Resúmelo en menos de 4000 caracteres."
        ),
        hasProjectIdea: false,
      };
    }

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/ai/chat`;
    const body: {
      message?: string;
      selectedProposal?: { title?: string; pitch?: string; whyItWins?: string };
      history?: Array<{ role: "user" | "assistant"; content: string }>;
      attachedContent?: string;
    } = {};
    if (selectedProposal && !hasAttachment) body.selectedProposal = selectedProposal;
    if (trimmed) body.message = trimmed;
    if (hasAttachment) body.attachedContent = attachedContent;
    if (options?.history?.length) body.history = options.history;

    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
    } catch (e) {
      return {
        message: createMessage(
          crypto.randomUUID(),
          "assistant",
          `No pude conectar con el servidor (${url}). Comprueba que el backend esté en marcha y la URL en .env (NEXT_PUBLIC_API_URL) sea correcta.`
        ),
        hasProjectIdea: false,
      };
    }

    const json = (await res.json().catch(() => ({}))) as AiChatResponse;

    if (!res.ok) {
      const msg =
        res.status === 503
          ? "El asistente no está disponible ahora (configuración del servidor). Intenta más tarde."
          : (json.message || res.statusText) || "Error al procesar. Intenta de nuevo.";
      return {
        message: createMessage(crypto.randomUUID(), "assistant", msg),
        hasProjectIdea: false,
      };
    }

    if (json.success && json.data) {
      const data = json.data;
      const payload = buildPayload(data);
      const hasProjectIdea = data.mode === "execution";

      return {
        message: createMessage(
          crypto.randomUUID(),
          "assistant",
          fallbackMessage(data)
        ),
        hasProjectIdea,
        payload,
      };
    }

    return {
      message: createMessage(
        crypto.randomUUID(),
        "assistant",
        json.message || "No pude generar una respuesta. Intenta de nuevo."
      ),
      hasProjectIdea: false,
    };
  }
}
