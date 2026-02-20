"use client";

import Link from "next/link";
import type { Project } from "../domain";
import { getProjectImageUrl } from "../lib/project-image";

type ProjectCardProps = {
  project: Project;
  onOpenInDashboard?: (projectId: string) => void;
};

export function ProjectCard({ project, onOpenInDashboard }: ProjectCardProps) {
  const weekCount = (project.roadmap?.length ?? project.roadmapSteps?.length ?? 0) || 4;
  const lastProgress = project.lastProgress;
  const imageUrl = getProjectImageUrl(project.id) ?? project.imageUrl ?? null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl transition-all duration-300 hover:border-accent/30 hover:shadow-accent/5 hover:shadow-2xl duration-[250ms]">
      <Link href={`/proyectos/${project.id}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-background/50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-secondary">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-text-primary line-clamp-2">{project.title}</h3>
          {project.status && project.status !== "active" && (
            <span className="shrink-0 rounded-full bg-primary/80 px-2.5 py-0.5 text-xs font-medium text-on-primary">
              {project.status}
            </span>
          )}
        </div>
        {project.description && (
          <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
          <span>{weekCount} semanas</span>
          {lastProgress?.entryDate && (
            <span className="text-accent">
              {lastProgress.progressPercent != null
                ? `${lastProgress.progressPercent}%`
                : "Avance"}{" "}
              {new Date(lastProgress.entryDate).toLocaleDateString("es", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/proyectos/${project.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-text-primary transition hover:border-primary/30 hover:bg-surface"
          >
            Ver detalle
          </Link>
          {onOpenInDashboard && (
            <button
              type="button"
              onClick={() => onOpenInDashboard(project.id)}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-on-primary shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
            >
              Abrir en dashboard
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
