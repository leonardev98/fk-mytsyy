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
  isAuthenticated: boolean;
  onRequireAuth: () => void;
};

/**
 * Full-screen AI chat as project creation engine.
 * Uses backend POST /ai/chat for real AI responses.
 */
export function DashboardChatScene({ onCreateProject, isAuthenticated, onRequireAuth }: DashboardChatSceneProps) {
  const chatPort = useMemo(() => new ChatApiAdapter(), []);

  return (
    <ChatServiceProvider port={chatPort}>
      <div className="h-[calc(100vh-3.5rem)]">
        <Chat
          onCreateProject={onCreateProject}
          showCreateProjectAfterUserMessages={1}
          isAuthenticated={isAuthenticated}
          onRequireAuth={onRequireAuth}
        />
      </div>
    </ChatServiceProvider>
  );
}
