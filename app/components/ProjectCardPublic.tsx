"use client";

import Link from "next/link";

export type ProjectCardPublicProps = {
  id: string;
  title: string;
  description?: string | null;
  currentDay: number;
  totalDays?: number;
  progressPercent?: number;
  authorUsername?: string;
  authorName?: string;
};

export function ProjectCardPublic({
  id,
  title,
  description,
  currentDay,
  totalDays = 30,
  progressPercent = 0,
  authorUsername,
  authorName,
}: ProjectCardPublicProps) {
  const progress = Math.min(100, Math.max(0, progressPercent));

  return (
    <Link
      href={`/projects/${id}`}
      className="block rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms] hover:border-primary/30"
    >
      <h3 className="font-semibold text-text-primary line-clamp-2">{title}</h3>
      {(authorName ?? authorUsername) && (
        <p className="mt-1 text-xs text-text-secondary">
          {authorName ?? `@${authorUsername}`}
        </p>
      )}
      {description != null && description !== "" && (
        <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
          {description}
        </p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
          Día {currentDay}/{totalDays}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
        <div
          className="h-full rounded-full bg-accent transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Link>
  );
}
