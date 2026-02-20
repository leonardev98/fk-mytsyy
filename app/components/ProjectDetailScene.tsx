"use client";

import { useState, useEffect } from "react";
import { useAuthSession } from "@/modules/auth";
import { ProjectDetailView } from "@/modules/projects";
import type { Project } from "@/modules/projects";
import { useProjectsCatalog } from "../hooks/useProjectsCatalog";
import Link from "next/link";

export function ProjectDetailScene({ id }: { id: string }) {
  const { isAuthenticated, isLoading } = useAuthSession();
  const catalog = useProjectsCatalog();
  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);

  useEffect(() => {
    catalog
      .getProjectById(id)
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setProjectLoading(false));
  }, [catalog, id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">Cargando…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-text-secondary">
          Inicia sesión para ver el plan de tu proyecto.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href={`/login?returnTo=${encodeURIComponent(`/proyectos/${id}`)}`}
            className="rounded-xl bg-primary px-4 py-2 text-sm text-on-primary hover:bg-primary-hover"
          >
            Iniciar sesión
          </Link>
          <Link
            href={`/signup?returnTo=${encodeURIComponent(`/proyectos/${id}`)}`}
            className="rounded-xl border border-border px-4 py-2 text-sm text-text-primary hover:bg-surface"
          >
            Registrarse
          </Link>
        </div>
      </div>
    );
  }

  if (projectLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">Cargando proyecto…</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-text-secondary">Proyecto no encontrado.</p>
        <Link
          href="/proyectos"
          className="mt-4 inline-block text-accent hover:underline"
        >
          Volver a Mis proyectos
        </Link>
      </div>
    );
  }

  return <ProjectDetailView project={project} />;
}
