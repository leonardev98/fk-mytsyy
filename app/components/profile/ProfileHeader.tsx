"use client";

import Link from "next/link";
import type { MockUser } from "@/lib/mock-users";

type ProfileHeaderProps = {
  user: MockUser;
  isOwnProfile: boolean;
};

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-[250ms]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div
          className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-2xl font-semibold text-primary transition-colors duration-[250ms]"
          aria-hidden
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="h-28 w-28 rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            {user.name}
          </h1>
          <p className="text-sm text-text-secondary">@{user.username}</p>
          {user.bio != null && user.bio !== "" && (
            <p className="text-base text-text-secondary">{user.bio}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {isOwnProfile && (
              <Link
                href="/perfil"
                className="inline-flex items-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background"
              >
                Editar perfil
              </Link>
            )}
            {!isOwnProfile && (
              <button
                type="button"
                className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
              >
                Seguir
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 pt-2 text-sm text-text-secondary">
            {user.location && (
              <span className="inline-flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {user.location}
              </span>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent transition hover:underline"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                {user.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
