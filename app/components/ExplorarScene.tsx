"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/modules/auth";
import { useActiveProject } from "../context/ActiveProjectContext";
import { IdeasMockAdapter } from "@/modules/ideas";

/** Map ideaId → projectId (mock projects 1 and 2 exist) */
const IDEA_TO_PROJECT: Record<string, string> = {
  "1": "1",
  "2": "2",
  "3": "1",
  "4": "2",
};

function ExplorarContent() {
  const router = useRouter();
  const { setActiveProject } = useActiveProject();
  const catalog = useMemo(() => new IdeasMockAdapter(), []);
  const ideas = useMemo(() => catalog.listIdeas(), [catalog]);

  function handleSelectIdea(ideaId: string) {
    const projectId = IDEA_TO_PROJECT[ideaId] ?? "1";
    setActiveProject(projectId);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          Explorar
        </h1>
        <p className="mt-2 text-text-secondary">
          Elige una idea. Se creará tu proyecto y empezarás tu plan de 30 días en el dashboard.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        {ideas.map((idea) => (
          <ExplorarIdeaCard
            key={idea.id}
            idea={idea}
            onSelect={() => handleSelectIdea(idea.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ExplorarIdeaCard({
  idea,
  onSelect,
}: {
  idea: { id: string; title: string; description: string; whyFitsYou: string; difficulty: string; estimatedCapital: string; timeToValidation: string };
  onSelect: () => void;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/30 hover:bg-surface/80 transition-colors duration-[250ms]">
      <span className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">
        {idea.timeToValidation} a validación
      </span>
      <h3 className="mb-2 font-semibold text-text-primary">{idea.title}</h3>
      <p className="mb-3 flex-1 text-sm text-text-secondary line-clamp-2">
        {idea.description}
      </p>
      <p className="mb-4 text-xs text-text-secondary">
        Capital: {idea.estimatedCapital}
      </p>
      <button
        type="button"
        onClick={onSelect}
        className="rounded-xl bg-primary px-4 py-2 text-center text-sm font-medium text-on-primary transition hover:bg-primary-hover"
      >
        Elegir y crear proyecto
      </button>
    </article>
  );
}

export function ExplorarScene() {
  return (
    <AuthGate message="Inicia sesión para explorar ideas y crear tu proyecto.">
      <ExplorarContent />
    </AuthGate>
  );
}
