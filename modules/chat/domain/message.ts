/**
 * Chat domain: message entity.
 * No external dependencies. Pure domain types.
 */

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export function createMessage(
  id: string,
  role: MessageRole,
  content: string,
  createdAt: Date = new Date()
): Message {
  return { id, role, content, createdAt };
}
