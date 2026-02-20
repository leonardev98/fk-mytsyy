"use client";

export type ReputationBadgeKind =
  | "streak"
  | "projects_completed"
  | "first_client"
  | "consistency"
  | "level";

type ReputationBadgeProps = {
  kind: ReputationBadgeKind;
  value: string | number;
  label?: string;
};

const BADGE_CONFIG: Record<
  ReputationBadgeKind,
  { icon: string; ariaLabel: string }
> = {
  streak: { icon: "🔥", ariaLabel: "Racha" },
  projects_completed: { icon: "🏆", ariaLabel: "Proyectos completados" },
  first_client: { icon: "🎯", ariaLabel: "Primer cliente" },
  consistency: { icon: "📈", ariaLabel: "Consistencia" },
  level: { icon: "⭐", ariaLabel: "Nivel" },
};

export function ReputationBadge({
  kind,
  value,
  label,
}: ReputationBadgeProps) {
  const config = BADGE_CONFIG[kind];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-primary transition-colors duration-[250ms]"
      title={label ?? config.ariaLabel}
    >
      <span aria-hidden>{config.icon}</span>
      <span>{value}</span>
      {label != null && label !== "" && (
        <span className="text-text-secondary">{label}</span>
      )}
    </span>
  );
}
