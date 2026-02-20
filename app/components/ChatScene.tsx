"use client";

import { useMemo } from "react";
import {
  ChatServiceProvider,
  Chat,
  ChatApiAdapter,
} from "@/modules/chat";

/**
 * Standalone chat (uses API). Prefer DashboardChatScene for dashboard flow.
 */
export function ChatScene() {
  const chatPort = useMemo(() => new ChatApiAdapter(), []);

  return (
    <ChatServiceProvider port={chatPort}>
      <Chat />
    </ChatServiceProvider>
  );
}
