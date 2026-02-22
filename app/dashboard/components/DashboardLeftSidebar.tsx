"use client";

import Link from "next/link";
import { useAuthSession } from "@/modules/auth";
import { StreakIndicator } from "@/app/components/StreakIndicator";

type DashboardLeftSidebarProps = {
  streakDays: number;
  activeProjectsCount: number;
  monthlyGoal: string;
  averageProgressPercent: number;
  continueProjectHref: string | null;
  isAuthenticated: boolean;
};

function slugifyProfile(user: { name?: string; email?: string; id: string }): string {
  const raw = (user.name || user.email || user.id).toLowerCase();
  return raw.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "me";
}

const SHORTCUTS = [
  { href: "/explore", label: "Explorar", icon: "🔍" },
  { href: "/crear", label: "Crear con IA", icon: "✨" },
  { href: "/proyectos", label: "Mis proyectos", icon: "📁" },
  { href: "/ideas", label: "Ideas", icon: "💡" },
];

const ENTREPRENEUR_CTAS = [
  { href: "/crear", label: "Construye tu logo", tagline: "Genera identidad visual con IA" },
  { href: "/crear", label: "Descubre nombre de proyecto", tagline: "Encuentra el nombre perfecto" },
  { href: "/explore", label: "Inspírate", tagline: "Proyectos de la comunidad" },
];

export function DashboardLeftSidebar({
  streakDays,
  activeProjectsCount,
  monthlyGoal,
  averageProgressPercent,
  continueProjectHref,
  isAuthenticated,
}: DashboardLeftSidebarProps) {
  const { user } = useAuthSession();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  const profileSlug = user ? slugifyProfile(user) : "me";

  return (
    <div className="space-y-4">
      {/* User card - diseño tipo LinkedIn/Facebook mejorado */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
        {/* Cover con gradiente más rico */}
        <div
          className="h-16 bg-gradient-to-br from-primary via-primary/80 to-accent/60"
          aria-hidden
        />

        <div className="px-4 pb-4 -mt-10">
          {isAuthenticated && user ? (
            <Link
              href={`/profile/${profileSlug}`}
              className="flex gap-4 items-start group"
            >
              {/* Avatar más grande con anillo sutil */}
              <div className="relative shrink-0">
                <div
                  className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-[3px] border-surface bg-gradient-to-br from-primary/20 to-accent/20 text-xl font-bold text-primary shadow-md ring-2 ring-primary/10 transition-all duration-300 group-hover:ring-primary/30 group-hover:scale-[1.02]"
                  aria-hidden
                >
                  {initials}
                </div>
              </div>

              {/* Nombre y acción */}
              <div className="min-w-0 flex-1 pt-1">
                <p className="font-semibold text-text-primary text-base leading-tight truncate group-hover:text-primary transition-colors">
                  {user.name || user.email}
                </p>
                <span className="inline-flex items-center mt-0.5 gap-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-text-secondary bg-background/80 px-2 py-0.5 rounded-full border border-border/60">
                    Builder
                  </span>
                </span>
                <span className="block mt-2 text-xs font-medium text-accent opacity-80 group-hover:opacity-100 transition-opacity">
                  Ver perfil completo →
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex gap-4 items-start">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-surface bg-primary/10 text-3xl shadow-md"
                aria-hidden
              >
                👋
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <p className="font-medium text-text-secondary text-sm">
                  Únete a la red
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Conecta con emprendedores
                </p>
                <Link
                  href="/signup?returnTo=/dashboard"
                  className="inline-block mt-2 text-sm font-semibold text-accent hover:underline"
                >
                  Crear cuenta gratis →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Accesos rápidos - estilo sidebar */}
      <div className="rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms]">
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          Accesos rápidos
        </h3>
        <nav className="mt-3 space-y-0.5">
          {SHORTCUTS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-primary transition hover:bg-background"
            >
              <span aria-hidden>{s.icon}</span>
              <span>{s.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Momentum personal (stats) */}
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
            <p className="text-sm font-medium text-text-primary line-clamp-2">{monthlyGoal}</p>
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
                  className="block w-full rounded-xl border border-border py-2.5 text-center text-sm font-medium text-text-primary transition hover:bg-background"
                >
                  Ver proyectos
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Descubre - CTAs para emprendedores */}
      <div className="rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms]">
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          Descubre
        </h3>
        <div className="mt-3 space-y-2">
          {ENTREPRENEUR_CTAS.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="block rounded-xl border border-border/60 bg-background/50 p-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
            >
              <p className="text-sm font-medium text-text-primary">{c.label}</p>
              <p className="mt-0.5 text-xs text-text-secondary">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
