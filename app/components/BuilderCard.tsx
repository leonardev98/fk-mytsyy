"use client";

import Link from "next/link";

export type BuilderCardProps = {
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  streakDays: number;
  completedProjects: number;
  level?: number;
};

export function BuilderCard({
  username,
  displayName,
  avatarUrl,
  bio,
  streakDays,
  completedProjects,
  level = 1,
}: BuilderCardProps) {
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/profile/${username}`}
      className="block rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms] hover:border-primary/30"
    >
      <div className="flex gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary"
          aria-hidden
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text-primary truncate">
            {displayName}
          </p>
          <p className="text-xs text-text-secondary">@{username}</p>
          {bio != null && bio !== "" && (
            <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
              {bio}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-xs text-text-secondary">
              🔥 {streakDays}
            </span>
            <span className="text-xs text-text-secondary">
              🏆 {completedProjects}
            </span>
            {level > 0 && (
              <span className="text-xs text-text-secondary">
                Nivel {level}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
