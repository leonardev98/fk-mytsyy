"use client";

import type { MockUserStats } from "@/lib/mock-users";

type ProfileStatsProps = {
  stats: MockUserStats;
};

export function ProfileStats({ stats }: ProfileStatsProps) {
  const items = [
    {
      label: "Proyectos creados",
      value: stats.projectsCount,
      icon: "📁",
    },
    {
      label: "Ideas publicadas",
      value: stats.ideasCount,
      icon: "💡",
    },
    {
      label: "Entrevistas simuladas",
      value: stats.mockInterviews,
      icon: "🎤",
    },
    {
      label: "Nivel actual",
      value: stats.level,
      icon: "⭐",
    },
    {
      label: "Racha de actividad",
      value: `${stats.streak} días`,
      icon: "🔥",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms] hover:border-primary/30"
        >
          <p className="text-2xl font-semibold text-text-primary">
            {typeof item.value === "number" ? item.value : item.value}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            <span className="mr-1" aria-hidden>
              {item.icon}
            </span>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
