"use client";

import Link from "next/link";
import { useAuthSession } from "@/modules/auth";
import { StreakIndicator } from "./StreakIndicator";
import { ReputationBadge } from "./ReputationBadge";
import { ProjectCardPublic } from "./ProjectCardPublic";

type ProfilePublicSceneProps = {
  username: string;
};

// Mock: backend will provide builder by username
const MOCK_BUILDERS: Record<
  string,
  {
    displayName: string;
    bio: string;
    avatarUrl?: string | null;
    streakDays: number;
    completedProjects: number;
    projectsStarted: number;
    projectsFinished: number;
    completionRatePercent: number;
    level: number;
    consistencyActiveDaysLast7: number;
    timeline: { id: string; title: string; currentDay: number; totalDays: number; progressPercent: number }[];
    badges: { kind: "projects_completed" | "streak" | "first_client"; value: string }[];
  }
> = {
  mariag: {
    displayName: "María García",
    bio: "Builder enfocada en SaaS B2B. 30 días para validar.",
    streakDays: 12,
    completedProjects: 2,
    projectsStarted: 4,
    projectsFinished: 2,
    completionRatePercent: 50,
    level: 3,
    consistencyActiveDaysLast7: 5,
    timeline: [
      { id: "1", title: "App de reservas", currentDay: 30, totalDays: 30, progressPercent: 100 },
      { id: "2", title: "CRM pymes", currentDay: 12, totalDays: 30, progressPercent: 40 },
    ],
    badges: [
      { kind: "projects_completed", value: "2 proyectos" },
      { kind: "streak", value: "12 días" },
    ],
  },
  default: {
    displayName: "Builder",
    bio: "Construyendo en público.",
    streakDays: 0,
    completedProjects: 0,
    projectsStarted: 0,
    projectsFinished: 0,
    completionRatePercent: 0,
    level: 1,
    consistencyActiveDaysLast7: 0,
    timeline: [],
    badges: [],
  },
};

export function ProfilePublicScene({ username }: ProfilePublicSceneProps) {
  const { user, isAuthenticated } = useAuthSession();
  const builder = MOCK_BUILDERS[username] ?? MOCK_BUILDERS.default;
  const isOwnProfile =
    isAuthenticated &&
    user &&
    (user.name?.toLowerCase().replace(/\s+/g, "") === username ||
     (user as { username?: string }).username === username);

  const initials = builder.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="dashboard-in">
        <header className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-[250ms]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-2xl font-semibold text-primary"
              aria-hidden
            >
              {builder.avatarUrl ? (
                <img
                  src={builder.avatarUrl}
                  alt=""
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
                {builder.displayName}
              </h1>
              <p className="text-sm text-text-secondary">@{username}</p>
              {builder.bio != null && builder.bio !== "" && (
                <p className="mt-2 text-sm text-text-secondary">{builder.bio}</p>
              )}
              {isOwnProfile && (
                <Link
                  href="/perfil"
                  className="mt-3 inline-block rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background"
                >
                  Editar perfil
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
            <div>
              <StreakIndicator days={builder.streakDays} label="Racha actual" size="sm" />
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">
                {builder.completedProjects}
              </p>
              <p className="text-xs text-text-secondary">🏆 Proyectos completados</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">
                {builder.projectsStarted}
              </p>
              <p className="text-xs text-text-secondary">Proyectos iniciados</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">
                {builder.completionRatePercent}%
              </p>
              <p className="text-xs text-text-secondary">Tasa de finalización</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <ReputationBadge kind="level" value={`Nivel ${builder.level}`} />
            <ReputationBadge
              kind="consistency"
              value={`${builder.consistencyActiveDaysLast7}/7 días`}
              label="esta semana"
            />
            {builder.badges.map((b) => (
              <ReputationBadge key={b.kind} kind={b.kind} value={b.value} />
            ))}
          </div>
        </header>

        <section className="mt-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
            Timeline de proyectos
          </h2>
          {builder.timeline.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-secondary">
              Aún no hay proyectos públicos.
            </div>
          ) : (
            <ul className="space-y-3">
              {builder.timeline.map((p) => (
                <li key={p.id}>
                  <ProjectCardPublic
                    id={p.id}
                    title={p.title}
                    currentDay={p.currentDay}
                    totalDays={p.totalDays}
                    progressPercent={p.progressPercent}
                    authorUsername={username}
                    authorName={builder.displayName}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
