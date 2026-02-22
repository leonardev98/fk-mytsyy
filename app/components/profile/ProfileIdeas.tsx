"use client";

import type { MockIdea } from "@/lib/mock-users";

type ProfileIdeasProps = {
  ideas: MockIdea[];
};

export function ProfileIdeas({ ideas }: ProfileIdeasProps) {
  if (ideas.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-secondary">
        Aún no hay ideas publicadas.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {ideas.map((idea) => (
        <li
          key={idea.id}
          className="rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms] hover:border-primary/30"
        >
          <h3 className="font-semibold text-text-primary">{idea.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
              {idea.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
              <span aria-hidden>❤️</span>
              {idea.likes} likes
            </span>
            <span className="text-xs text-text-secondary">{idea.date}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
