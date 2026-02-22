"use client";

import type { MockAchievement } from "@/lib/mock-users";

type ProfileAchievementsProps = {
  achievements: MockAchievement[];
};

export function ProfileAchievements({ achievements }: ProfileAchievementsProps) {
  if (achievements.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-secondary">
        Aún no hay logros desbloqueados.
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {achievements.map((a) => (
        <li
          key={a.id}
          className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms] hover:border-primary/30"
        >
          <span className="text-2xl" aria-hidden>
            {a.icon}
          </span>
          <div>
            <p className="font-semibold text-text-primary">{a.title}</p>
            {a.description && (
              <p className="mt-0.5 text-sm text-text-secondary">
                {a.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
