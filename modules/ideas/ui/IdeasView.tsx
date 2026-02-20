"use client";

import { useMemo } from "react";
import { AuthGate } from "@/modules/auth";
import { IdeaCard } from "./IdeaCard";
import type { IdeasCatalogPort } from "../application/ports";

export function IdeasView({ catalog }: { catalog: IdeasCatalogPort }) {
  const ideas = useMemo(() => catalog.listIdeas(), [catalog]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          Mis ideas
        </h1>
        <p className="mt-2 text-text-secondary">
          Ideas personalizadas según tu perfil. Elige una y conviértela en proyecto con un plan de 30 días.
        </p>
      </section>

      <AuthGate message="Inicia sesión para ver tus ideas generadas y convertirlas en proyectos.">
        <div className="grid gap-6 sm:grid-cols-2">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </AuthGate>
    </div>
  );
}
