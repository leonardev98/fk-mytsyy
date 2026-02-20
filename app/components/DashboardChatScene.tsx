"use client";

import { useMemo } from "react";
import {
  ChatServiceProvider,
  Chat,
  ChatApiAdapter,
} from "@/modules/chat";
import type { ExecutionData } from "@/modules/chat/domain/assistant-payload";

type DashboardChatSceneProps = {
  onCreateProject: (executionData?: ExecutionData) => void | Promise<void>;
};

/**
 * Full-screen AI chat as project creation engine.
 * Uses backend POST /ai/chat for real AI responses.
 */
export function DashboardChatScene({ onCreateProject }: DashboardChatSceneProps) {
  const chatPort = useMemo(() => new ChatApiAdapter(), []);

  return (
    <ChatServiceProvider port={chatPort}>
      <div className="h-[calc(100vh-3.5rem)]">
        <Chat
          onCreateProject={onCreateProject}
          showCreateProjectAfterUserMessages={1}
        />
      </div>
    </ChatServiceProvider>
  );
}
