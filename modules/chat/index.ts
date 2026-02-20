/**
 * Chat module — public API.
 * Barrel: app imports from @/modules/chat only.
 */

export { Chat, ChatServiceProvider, useChatService } from "./ui";
export type { ChatServicePort } from "./application";
export type { Message, MessageRole } from "./domain";
export { ChatMockAdapter, ChatApiAdapter } from "./adapters";
