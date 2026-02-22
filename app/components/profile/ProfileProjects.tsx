"use client";

import Link from "next/link";

/** Compatible con mock data y con Project del API */
export type ProfileProjectItem = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  date: string;
  progressPercent: number;
};

type ProfileProjectsProps = {
  projects: ProfileProjectItem[];
};

export function ProfileProjects({ projects }: ProfileProjectsProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-secondary">
        Aún no hay proyectos públicos.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {projects.map((p) => (
          <li key={p.id}>
            <Link
              href={`/projects/${p.id}`}
              className="block rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms] hover:border-primary/30"
            >
              <h3 className="font-semibold text-text-primary line-clamp-2">
                {p.title}
              </h3>
              {p.description && (
                <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                  {p.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {(p.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-xs text-text-secondary">{p.date}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-background">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-200"
                    style={{ width: `${Math.min(100, p.progressPercent)}%` }}
                  />
                </div>
                <span className="text-xs text-text-secondary">
                  {p.progressPercent}%
                </span>
              </div>
              <span className="mt-3 inline-block text-sm font-medium text-accent transition hover:underline">
                Ver más →
              </span>
            </Link>
          </li>
        ))}
    </ul>
  );
}
