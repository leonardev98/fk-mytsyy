"use client";

import { useState, useCallback, useEffect } from "react";
import type { Message } from "../domain";
import type { AssistantPayload } from "../domain/assistant-payload";
import type { ChatServicePort, SendMessageOptions } from "./ports";

/**
 * Use case: orchestrate chat flow.
 * Depends only on ChatServicePort (abstraction). No adapter imports.
 * Tracks last assistant payload (mode + data) for dynamic UI rendering.
 */
export function useChat(chatService: ChatServicePort) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPayload, setLastPayload] = useState<AssistantPayload | undefined>(undefined);
  const [lastHasProjectIdea, setLastHasProjectIdea] = useState(false);

  useEffect(() => {
    const init = chatService.getInitialMessages();
    if (init instanceof Promise) {
      init.then((msgs) => {
        setMessages(msgs);
        setIsLoadingInit(false);
      });
    } else {
      setMessages(init);
      setIsLoadingInit(false);
    }
  }, [chatService]);

  const sendMessage = useCallback(
    (userContent: string, options?: SendMessageOptions) => {
      const trimmed = userContent.trim();
      const hasSelection = options?.selectedProposal != null;
      const hasAttachment = Boolean(options?.attachedContent?.trim());
      const effectiveContent = trimmed || (hasAttachment ? "Te adjunto mi proyecto" : "");
      if ((!effectiveContent && !hasSelection) || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: effectiveContent,
        createdAt: new Date(),
      };

      // Historial: mensajes actuales + mensaje nuevo (para no depender del setState y evitar doble POST)
      const history: Array<{ role: "user" | "assistant"; content: string }> = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: effectiveContent },
      ];

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      chatService
        .sendMessage(effectiveContent, { ...options, history })
        .then((result) => {
          setMessages((prev) => [...prev, result.message]);
          setLastHasProjectIdea(result.hasProjectIdea === true);
          setLastPayload(result.payload);
        })
        .finally(() => setIsLoading(false));
    },
    [chatService, isLoading, messages]
  );

  return { messages, sendMessage, isLoading, isLoadingInit, lastHasProjectIdea, lastPayload };
}
