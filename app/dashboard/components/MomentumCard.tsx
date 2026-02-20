"use client";

import Link from "next/link";
import { StreakIndicator } from "@/app/components/StreakIndicator";

export type MomentumCardProps = {
  streakDays: number;
  activeProjectsCount: number;
  monthlyGoal: string;
  averageProgressPercent: number;
  continueProjectHref: string | null;
  isAuthenticated: boolean;
};

export function MomentumCard({
  streakDays,
  activeProjectsCount,
  monthlyGoal,
  averageProgressPercent,
  continueProjectHref,
  isAuthenticated,
}: MomentumCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 transition-colors duration-[250ms]">
      <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        Momentum personal
      </h2>

      <div className="mt-4 space-y-4">
        <StreakIndicator days={streakDays} label="Racha actual" />

        <div className="border-t border-border pt-4">
          <p className="text-2xl font-semibold text-text-primary">
            {activeProjectsCount}
          </p>
          <p className="text-xs text-text-secondary">📊 Proyectos activos</p>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium text-text-primary">{monthlyGoal}</p>
          <p className="text-xs text-text-secondary">🎯 Meta mensual</p>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-2xl font-semibold text-text-primary">
            {averageProgressPercent}%
          </p>
          <p className="text-xs text-text-secondary">Progreso promedio</p>
        </div>

        {isAuthenticated && (
          <div className="border-t border-border pt-4">
            {continueProjectHref ? (
              <Link
                href={continueProjectHref}
                className="block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-medium text-on-primary transition hover:bg-primary-hover"
              >
                Continuar proyecto
              </Link>
            ) : (
              <Link
                href="/proyectos"
                className="block w-full rounded-xl border border-border bg-surface py-2.5 text-center text-sm font-medium text-text-primary transition hover:bg-primary/10"
              >
                Ver proyectos
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
