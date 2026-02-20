import { createMessage } from "../domain";
import type {
  ChatServicePort,
  SendMessageOptions,
  SendMessageResult,
} from "../application/ports";
import type { Message } from "../domain";

/**
 * Adapter: mock implementation of ChatServicePort.
 * Replace with ChatApiAdapter when backend is ready. No change in domain or UI.
 * SOLID: Open/Closed — new adapters without modifying use case or UI.
 */
export class ChatMockAdapter implements ChatServicePort {
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
    _options?: SendMessageOptions
  ): Promise<SendMessageResult> {
    await new Promise((r) => setTimeout(r, 600));
    return {
      message: createMessage(
        crypto.randomUUID(),
        "assistant",
        `Entendido. Has dicho: "${userContent}". En el MVP completo aquí responderé con análisis y próximos pasos para tu idea. Por ahora puedes seguir escribiendo y afinando tu idea.`
      ),
      hasProjectIdea: false,
    };
  }
}
