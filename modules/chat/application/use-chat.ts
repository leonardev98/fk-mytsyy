"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Message } from "../domain";
import type { AssistantPayload } from "../domain/assistant-payload";
import type { ChatServicePort, SendMessageOptions } from "./ports";

type UseChatOptions = {
  /** Función que devuelve el sessionId actual (para incluir en cada request). */
  getSessionId?: () => string | undefined;
};

/**
 * Use case: orchestrate chat flow.
 * Depends only on ChatServicePort (abstraction). No adapter imports.
 * Tracks last assistant payload (mode + data) for dynamic UI rendering.
 * Uses mounted ref to avoid setState after unmount (no memory leaks).
 */
export function useChat(chatService: ChatServicePort, options?: UseChatOptions) {
  const getSessionId = options?.getSessionId;
  const mountedRef = useRef(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPayload, setLastPayload] = useState<AssistantPayload | undefined>(undefined);
  const [lastHasProjectIdea, setLastHasProjectIdea] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const init = chatService.getInitialMessages();
    if (init instanceof Promise) {
      init.then((msgs) => {
        if (mountedRef.current) {
          setMessages(msgs);
          setIsLoadingInit(false);
        }
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

      const history: Array<{ role: "user" | "assistant"; content: string }> = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: effectiveContent },
      ];

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const sessionId = getSessionId?.();
      chatService
        .sendMessage(effectiveContent, { ...options, history, sessionId })
        .then((result) => {
          if (mountedRef.current) {
            setMessages((prev) => [...prev, result.message]);
            setLastHasProjectIdea(result.hasProjectIdea === true);
            setLastPayload(result.payload);
          }
        })
        .finally(() => {
          if (mountedRef.current) setIsLoading(false);
        });
    },
    [chatService, isLoading, messages, getSessionId]
  );

  const resetConversation = useCallback(() => {
    const init = chatService.getInitialMessages();
    const setInit = (msgs: Message[]) => {
      if (mountedRef.current) {
        setMessages(msgs);
        setLastPayload(undefined);
        setLastHasProjectIdea(false);
      }
    };
    if (init instanceof Promise) {
      init.then(setInit);
    } else {
      setInit(init);
    }
  }, [chatService]);

  return { messages, sendMessage, isLoading, isLoadingInit, lastHasProjectIdea, lastPayload, resetConversation };
}
