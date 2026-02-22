"use client";

import type { MockActivityItem } from "@/lib/mock-users";

type ProfileActivityProps = {
  activity: MockActivityItem[];
};

const TYPE_LABELS: Record<MockActivityItem["type"], string> = {
  project: "Proyecto",
  idea: "Idea",
  interview: "Entrevista",
  milestone: "Logro",
};

export function ProfileActivity({ activity }: ProfileActivityProps) {
  if (activity.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-secondary">
        Aún no hay actividad registrada.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {activity.map((item) => (
        <li
          key={item.id}
          className="rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms] hover:border-primary/30"
        >
          <div className="flex items-start gap-3">
            <span className="rounded-lg bg-primary/15 px-2 py-1 text-xs font-medium text-primary">
              {TYPE_LABELS[item.type]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-text-primary">{item.title}</p>
              {item.description && (
                <p className="mt-1 text-sm text-text-secondary">
                  {item.description}
                </p>
              )}
              <p className="mt-1 text-xs text-text-secondary">{item.date}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
