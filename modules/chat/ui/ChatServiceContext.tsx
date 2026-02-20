"use client";

import { createContext, useContext } from "react";
import type { ChatServicePort } from "../application/ports";

const ChatServiceContext = createContext<ChatServicePort | null>(null);

/**
 * Composition root injects the adapter (mock or API). UI never imports adapters.
 */
export function ChatServiceProvider({
  children,
  port,
}: {
  children: React.ReactNode;
  port: ChatServicePort;
}) {
  return (
    <ChatServiceContext.Provider value={port}>
      {children}
    </ChatServiceContext.Provider>
  );
}

export function useChatService(): ChatServicePort {
  const port = useContext(ChatServiceContext);
  if (!port) {
    throw new Error("useChatService must be used within ChatServiceProvider");
  }
  return port;
}
