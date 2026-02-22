"use client";

import Link from "next/link";

export type TrendingProjectCardProps = {
  id: string;
  title: string;
  description: string;
  currentDay: number;
  totalDays: number;
  progressPercent: number;
  authorUsername: string;
  authorName: string;
  badges?: ("trending" | "ultimos")[];
  coverPlaceholder?: string;
  /** Altura relativa para masonry: "short" | "medium" | "tall" */
  height?: "short" | "medium" | "tall";
};

export function TrendingProjectCard({
  id,
  title,
  description,
  currentDay,
  totalDays,
  progressPercent,
  authorUsername,
  authorName,
  badges = [],
  height = "medium",
}: TrendingProjectCardProps) {
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const progress = Math.min(100, Math.max(0, progressPercent));

  const heightClass =
    height === "tall" ? "min-h-[320px]" : height === "short" ? "min-h-[220px]" : "min-h-[260px]";

  return (
    <Link
      href={`/projects/${id}`}
      className={`group block rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-primary/30 ${heightClass}`}
    >
      {/* Cover placeholder */}
      <div className="h-24 sm:h-28 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 transition-colors duration-300 group-hover:from-primary/25 group-hover:via-accent/20 group-hover:to-primary/15" />

      <div className="p-4">
        {/* Badges */}
        {badges.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {badges.includes("trending") && (
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent">
                🔥 Trending
              </span>
            )}
            {badges.includes("ultimos") && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                ⚡ Últimos días
              </span>
            )}
          </div>
        )}

        <h3 className="font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{description}</p>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-xs font-medium text-primary">
            {initials}
          </div>
          <span className="truncate text-xs text-text-secondary">{authorName}</span>
        </div>

        <div className="mt-3">
          <div className="mb-1.5 flex justify-between text-xs text-text-secondary">
            <span>Día {currentDay}/{totalDays}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
