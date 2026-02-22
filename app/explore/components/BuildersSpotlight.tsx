"use client";

import Link from "next/link";

export type BuilderSpotlight = {
  username: string;
  displayName: string;
  bio?: string;
  streakDays: number;
  level: number | string;
  completedProjects?: number;
};

type BuildersSpotlightProps = {
  builders: BuilderSpotlight[];
};

export function BuildersSpotlight({ builders }: BuildersSpotlightProps) {
  return (
    <section>
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
        Builders destacados
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {builders.map((b) => {
          const initials = b.displayName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <Link
              key={b.username}
              href={`/profile/${b.username}`}
              className="group flex flex-col items-center rounded-2xl border border-border bg-surface p-6 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-primary/30"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary/20 to-accent/20 text-2xl font-bold text-primary transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg">
                {initials}
              </div>
              <p className="mt-3 font-semibold text-text-primary truncate max-w-full">
                {b.displayName}
              </p>
              {b.bio && (
                <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">{b.bio}</p>
              )}
              <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-text-secondary">
                <span>Nivel {b.level}</span>
                <span>🔥 {b.streakDays} días</span>
              </div>
              <span className="mt-4 inline-block rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary">
                Ver perfil
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
