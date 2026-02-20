"use client";

import { useRef, useEffect } from "react";
import { useChatService } from "./ChatServiceContext";
import { useChat } from "../application/use-chat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatLoading } from "./ChatLoading";
import type { ExecutionData } from "../domain/assistant-payload";

const MAX_WIDTH = "max-w-2xl";

type ChatProps = {
  /** When set, show "Crear proyecto". Pass execution data when available so the project is created with roadmap. */
  onCreateProject?: (executionData?: ExecutionData) => void | Promise<void>;
  showCreateProjectAfterUserMessages?: number;
};

/**
 * ChatGPT-style layout: chat centered initially, then extends as conversation grows.
 * Optional: when onCreateProject is set, shows confirmation to create project after conversation.
 */
export function Chat({
  onCreateProject,
  showCreateProjectAfterUserMessages = 1,
}: ChatProps = {}) {
  const port = useChatService();
  const { messages, sendMessage, isLoading, lastHasProjectIdea, lastPayload } = useChat(port);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isStartView = messages.length <= 1;
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const isExecutionMode = lastPayload?.mode === "execution";
  const isProposalMode = lastPayload?.mode === "proposal";
  const showCreateProjectInFooter =
    onCreateProject &&
    lastHasProjectIdea &&
    !isExecutionMode &&
    !isProposalMode &&
    userMessageCount >= showCreateProjectAfterUserMessages &&
    !isStartView;

  const lastMessage = messages[messages.length - 1];
  const lastAssistantPayload =
    lastMessage?.role === "assistant" ? lastPayload : undefined;

  return (
    <div className="flex h-full flex-col bg-background">
      <div
        className={`flex-1 overflow-y-auto ${isStartView ? "flex flex-col items-center justify-center" : ""}`}
      >
        {isStartView ? (
          /* Vista inicial: todo centrado en el medio como ChatGPT */
          <div className={`flex w-full flex-col items-center px-4 ${MAX_WIDTH} mx-auto`}>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                Construye algo real en 30 días.
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                Cuéntame qué quieres crear y te ayudo a convertirlo en tu primera venta.
              </p>
            </div>
            {messages[0] && (
              <div className="mb-6 w-full rounded-2xl bg-surface px-4 py-3 text-sm text-text-secondary">
                {messages[0].content}
              </div>
            )}
            <div className="w-full">
              <ChatInput onSend={sendMessage} disabled={isLoading} variant="center" />
            </div>
          </div>
        ) : (
          /* Vista conversación: hilo que se extiende, input abajo */
          <div className={`mx-auto w-full ${MAX_WIDTH} px-4 py-6`}>
            {messages.map((msg, i) => {
              const isLast = i === messages.length - 1;
              const payload = isLast && msg.role === "assistant" ? lastAssistantPayload : undefined;
              return (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  payload={payload}
                  onSelectProposal={(proposal) =>
                sendMessage("Esta", { selectedProposal: proposal })
              }
                  onCreateProject={onCreateProject}
                />
              );
            })}
            {isLoading && <ChatLoading />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input fijo abajo solo cuando ya hay conversación */}
      {!isStartView && (
        <div className="shrink-0 border-t border-border bg-background p-4">
          <div className={`mx-auto ${MAX_WIDTH}`}>
            <ChatInput onSend={sendMessage} disabled={isLoading} />
            {showCreateProjectInFooter && (
              <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-4">
                <p className="mb-3 text-sm text-text-secondary">
                  ¿Listo para llevar tu idea a ejecución? Crearemos tu proyecto con un plan de 30 días.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onCreateProject?.(
                      lastPayload?.mode === "execution" ? lastPayload.data : undefined
                    )
                  }
                  className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
                >
                  Crear proyecto
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
