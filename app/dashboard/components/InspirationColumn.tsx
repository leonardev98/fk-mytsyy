"use client";

import Link from "next/link";
import { InspirationCard } from "./InspirationCard";

export type TrendingProject = {
  id: string;
  title: string;
};

export type RecommendedCommunity = {
  id: string;
  name: string;
  memberCount: number;
};

type InspirationColumnProps = {
  ideaOfTheDay: string;
  founderQuote: string;
  trendingProjects: TrendingProject[];
  recommendedCommunities: RecommendedCommunity[];
};

export function InspirationColumn({
  ideaOfTheDay,
  founderQuote,
  trendingProjects,
  recommendedCommunities,
}: InspirationColumnProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        Inspiración
      </h2>

      <InspirationCard title="Idea millonaria del día">
        <p className="leading-relaxed">{ideaOfTheDay}</p>
      </InspirationCard>

      <InspirationCard title="Frase del fundador">
        <p className="italic leading-relaxed">&ldquo;{founderQuote}&rdquo;</p>
      </InspirationCard>

      <InspirationCard title="Proyectos trending">
        <ul className="space-y-2">
          {trendingProjects.length === 0 ? (
            <li className="text-text-secondary">Próximamente</li>
          ) : (
            trendingProjects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/proyectos/${p.id}`}
                  className="text-accent hover:underline"
                >
                  {p.title}
                </Link>
              </li>
            ))
          )}
        </ul>
      </InspirationCard>

      <InspirationCard title="Comunidad recomendada">
        <ul className="space-y-2">
          {recommendedCommunities.length === 0 ? (
            <li className="text-text-secondary">Próximamente</li>
          ) : (
            recommendedCommunities.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/explorar?community=${c.id}`}
                  className="font-medium text-text-primary hover:text-accent"
                >
                  {c.name}
                </Link>
                <span className="ml-1 text-xs text-text-secondary">
                  · {c.memberCount} miembros
                </span>
              </li>
            ))
          )}
        </ul>
      </InspirationCard>
    </div>
  );
}
