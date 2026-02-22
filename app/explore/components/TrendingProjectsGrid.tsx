"use client";

import { TrendingProjectCard } from "./TrendingProjectCard";
import type { TrendingProjectCardProps } from "./TrendingProjectCard";

type TrendingProjectsGridProps = {
  projects: TrendingProjectCardProps[];
};

export function TrendingProjectsGrid({ projects }: TrendingProjectsGridProps) {
  return (
    <div
      className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:balance]"
      style={{ columnFill: "balance" }}
    >
      {projects.map((p) => (
        <div key={p.id} className="mb-4 break-inside-avoid">
          <TrendingProjectCard {...p} />
        </div>
      ))}
    </div>
  );
}
