"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthGate } from "@/modules/auth";
import { ProjectCard } from "./ProjectCard";
import type { ProjectsCatalogPort } from "../application/ports";
import type { Project } from "../domain";

type ProjectsViewProps = {
  catalog: ProjectsCatalogPort;
  /** When set, cards show "Abrir en dashboard" to set as active and go to dashboard. */
  onOpenInDashboard?: (projectId: string) => void;
};

export function ProjectsView({ catalog, onOpenInDashboard }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalog.listProjects().then(setProjects).finally(() => setLoading(false));
  }, [catalog]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="mb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Mis proyectos
            </h1>
            <p className="mt-2 text-text-secondary">
              Todos tus proyectos con plan de 30 días. Abre uno en el dashboard o entra al detalle para ver el roadmap y registrar avances.
            </p>
          </div>
          <Link
            href="/projects/create"
            className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
          >
            + Añadir proyecto
          </Link>
        </div>
      </section>

      <AuthGate message="Inicia sesión para ver tus proyectos y el plan para llevarlos a la realidad.">
        {loading ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center text-text-secondary">
            Cargando proyectos…
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <p className="mb-2 text-text-secondary">Aún no tienes proyectos.</p>
            <p className="mb-6 text-sm text-text-secondary">
              Cuéntale tu idea a la IA y genera un plan de 30 días en minutos.
            </p>
            <Link
              href="/projects/create"
              className="inline-block rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
            >
              Crear proyecto
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenInDashboard={onOpenInDashboard}
              />
            ))}
          </div>
        )}
      </AuthGate>
    </div>
  );
}
