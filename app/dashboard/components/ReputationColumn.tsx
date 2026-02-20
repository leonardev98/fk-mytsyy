"use client";

import Link from "next/link";
import { InspirationCard } from "./InspirationCard";

export type RankedBuilder = {
  rank: number;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  streakDays: number;
  completedProjects: number;
};

export type TopStreak = {
  username: string;
  displayName: string;
  streakDays: number;
};

export type TrendingProject = {
  id: string;
  title: string;
};

type ReputationColumnProps = {
  weeklyRanking: RankedBuilder[];
  topStreaks: TopStreak[];
  trendingProjects: TrendingProject[];
  ideaOfTheDay: string;
};

export function ReputationColumn({
  weeklyRanking,
  topStreaks,
  trendingProjects,
  ideaOfTheDay,
}: ReputationColumnProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        Sistema de reputación
      </h2>

      <InspirationCard title="Ranking semanal de builders">
        {weeklyRanking.length === 0 ? (
          <p className="text-text-secondary">Próximamente</p>
        ) : (
          <ul className="space-y-2">
            {weeklyRanking.slice(0, 5).map((b) => (
              <li key={b.username}>
                <Link
                  href={`/profile/${b.username}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-background"
                >
                  <span className="w-5 text-center text-sm font-semibold text-text-secondary">
                    #{b.rank}
                  </span>
                  <span className="font-medium text-text-primary truncate">
                    {b.displayName}
                  </span>
                  <span className="ml-auto text-xs text-text-secondary">
                    🔥{b.streakDays}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </InspirationCard>

      <InspirationCard title="Top rachas activas">
        {topStreaks.length === 0 ? (
          <p className="text-text-secondary">Próximamente</p>
        ) : (
          <ul className="space-y-2">
            {topStreaks.map((s) => (
              <li key={s.username}>
                <Link
                  href={`/profile/${s.username}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 transition hover:bg-background"
                >
                  <span className="truncate text-sm text-text-primary">
                    {s.displayName}
                  </span>
                  <span className="text-xs text-text-secondary">
                    🔥 {s.streakDays} días
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </InspirationCard>

      <InspirationCard title="Proyectos trending">
        <ul className="space-y-2">
          {trendingProjects.length === 0 ? (
            <li className="text-text-secondary">Próximamente</li>
          ) : (
            trendingProjects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.id}`}
                  className="text-accent hover:underline"
                >
                  {p.title}
                </Link>
              </li>
            ))
          )}
        </ul>
      </InspirationCard>

      <InspirationCard title="Idea del día">
        <p className="leading-relaxed">{ideaOfTheDay}</p>
      </InspirationCard>
    </div>
  );
}
