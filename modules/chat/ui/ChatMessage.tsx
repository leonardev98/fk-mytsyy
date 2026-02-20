"use client";

import type { Message } from "../domain";
import type {
  AssistantPayload,
  ProposalItem,
  ExecutionData,
} from "../domain/assistant-payload";

const AssistantIcon = () => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  </div>
);

const UserAvatar = () => (
  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/80 text-on-primary">
    <span className="text-xs font-medium">Tú</span>
  </div>
);

type ChatMessageProps = {
  message: Message;
  /** When set (last assistant message with mode), render dynamic block instead of plain text. */
  payload?: AssistantPayload;
  onSelectProposal?: (proposal: ProposalItem) => void;
  /** Called when user clicks "Crear proyecto"; receives execution data when from execution block. */
  onCreateProject?: (executionData?: ExecutionData) => void | Promise<void>;
};

export function ChatMessage({
  message,
  payload,
  onSelectProposal,
  onCreateProject,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex gap-3 justify-end py-4">
        <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-surface text-text-primary transition-colors duration-[250ms]">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        </div>
        <UserAvatar />
      </div>
    );
  }

  // Assistant: render by mode when payload is present
  if (payload) {
    return (
      <div className="flex gap-3 py-4 justify-start">
        <AssistantIcon />
        <div className="max-w-[85%] min-w-0">
          {payload.mode === "exploration" && (
            <ExplorationBlock data={payload.data} fallbackText={message.content} />
          )}
          {payload.mode === "proposal" && (
            <ProposalBlock
              data={payload.data}
              onSelect={onSelectProposal}
              fallbackText={message.content}
            />
          )}
          {payload.mode === "execution" && (
            <ExecutionBlock
              data={payload.data}
              onCreateProject={
                onCreateProject
                  ? () => onCreateProject(payload.data)
                  : undefined
              }
              fallbackText={message.content}
            />
          )}
        </div>
      </div>
    );
  }

  // Default assistant bubble
  return (
    <div className="flex gap-3 py-4 justify-start">
      <AssistantIcon />
      <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-surface text-text-secondary transition-colors duration-[250ms]">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}

function ExplorationBlock({
  data,
  fallbackText,
}: {
  data: { reply?: string; questions?: string[] };
  fallbackText: string;
}) {
  // Una sola burbuja: reply (si existe) + questions[0] (si existe). Todo viene del API.
  const reply = data.reply?.trim() ?? "";
  const questions = data.questions ?? [];
  const firstQuestion = questions[0]?.trim() ?? "";
  const parts: string[] = [];
  if (reply) parts.push(reply);
  if (firstQuestion) parts.push(firstQuestion);
  const text = parts.length > 0 ? parts.join("\n\n") : fallbackText;
  return (
    <div className="rounded-2xl px-4 py-2.5 bg-surface text-text-secondary transition-colors duration-[250ms]">
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function ProposalBlock({
  data,
  onSelect,
  fallbackText,
}: {
  data: {
    proposals?: ProposalItem[];
    frontendHint?: { primaryCTA?: string };
  };
  onSelect?: (proposal: ProposalItem) => void;
  fallbackText: string;
}) {
  const proposals = data.proposals ?? [];
  const primaryCTA = data.frontendHint?.primaryCTA ?? "Seleccionar proyecto";
  if (proposals.length === 0) {
    return (
      <div className="rounded-2xl px-4 py-2.5 bg-surface text-text-secondary transition-colors duration-[250ms]">
        <p className="whitespace-pre-wrap text-sm">{fallbackText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {proposals.map((p, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-surface p-4 flex flex-col text-text-secondary transition-colors duration-[250ms]"
          >
            {p.title != null && p.title !== "" && (
              <h3 className="text-sm font-semibold text-text-primary mb-2">{p.title}</h3>
            )}
            {p.pitch != null && p.pitch !== "" && (
              <p className="text-sm text-text-secondary mb-2 flex-1">{p.pitch}</p>
            )}
            {p.whyItWins != null && p.whyItWins !== "" && (
              <p className="text-xs text-text-secondary mb-3">{p.whyItWins}</p>
            )}
            <button
              type="button"
              className="mt-auto rounded-xl bg-primary py-2 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
              onClick={() => onSelect?.(p)}
            >
              {primaryCTA}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExecutionBlock({
  data,
  onCreateProject,
  fallbackText,
}: {
  data: ExecutionData;
  onCreateProject?: () => void | Promise<void>;
  fallbackText: string;
}) {
  const intro = data.introMessage?.trim();
  const project = data.selectedProject;
  const title = typeof project === "object" && project != null ? project.title : undefined;
  const description = typeof project === "object" && project != null ? project.description : undefined;
  const weeks = data.roadmap?.weeks ?? [];

  return (
    <div className="rounded-2xl bg-surface text-text-secondary overflow-hidden transition-colors duration-[250ms]">
      <div className="px-4 py-3 space-y-4">
        {intro != null && intro !== "" && (
          <p className="text-sm leading-relaxed">{intro}</p>
        )}
        {title != null && title !== "" && (
          <h3 className="text-base font-semibold text-text-primary">Proyecto: {title}</h3>
        )}
        {description != null && description !== "" && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}
        {weeks.length > 0 && (
          <div className="space-y-3">
            {weeks.map((w, i) => (
              <div key={i} className="rounded-xl border border-border bg-background/40 p-3 transition-colors duration-[250ms]">
                <h4 className="text-sm font-medium text-accent mb-2">
                  Semana {w.week ?? i + 1}
                </h4>
                {w.goals?.length ? (
                  <ul className="list-disc list-inside text-xs text-text-secondary space-y-0.5 mb-2">
                    {w.goals.map((g, j) => (
                      <li key={j}>{g}</li>
                    ))}
                  </ul>
                ) : null}
                {w.actions?.length ? (
                  <ul className="list-disc list-inside text-xs text-text-secondary space-y-0.5">
                    {w.actions.map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        )}
        {weeks.length === 0 && !title && !description && !intro && (
          <p className="whitespace-pre-wrap text-sm">{fallbackText}</p>
        )}
        {onCreateProject && (
          <button
            type="button"
            onClick={onCreateProject}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
          >
            Crear proyecto
          </button>
        )}
      </div>
    </div>
  );
}
