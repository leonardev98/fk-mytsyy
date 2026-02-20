"use client";

import Link from "next/link";
import type { Idea } from "../domain";

const DIFFICULTY_LABELS: Record<Idea["difficulty"], string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

export function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/30 hover:bg-surface/80 transition-colors duration-[250ms]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-accent">
          Dificultad {DIFFICULTY_LABELS[idea.difficulty]}
        </span>
        <span className="text-xs text-text-secondary">{idea.timeToValidation}</span>
      </div>
      <h3 className="mb-2 font-semibold text-text-primary">{idea.title}</h3>
      <p className="mb-3 flex-1 text-sm text-text-secondary line-clamp-2">
        {idea.description}
      </p>
      <p className="mb-3 text-xs text-text-secondary">
        Por qué encaja: {idea.whyFitsYou}
      </p>
      <p className="mb-4 text-xs text-text-secondary">
        Capital estimado: {idea.estimatedCapital}
      </p>
      <Link
        href={`/proyectos/nuevo?ideaId=${idea.id}`}
        className="rounded-xl bg-primary px-4 py-2 text-center text-sm font-medium text-on-primary transition hover:bg-primary-hover"
      >
        Convertir en proyecto
      </Link>
    </article>
  );
}
