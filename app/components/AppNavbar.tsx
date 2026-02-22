"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthSession } from "@/modules/auth";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import type { User } from "@/modules/auth";

function slugifyProfile(user: User): string {
  const raw = (user.name || user.email || user.id).toLowerCase();
  const slug = raw.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "me";
  return slug || "me";
}

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuthSession();

  const navLink = (href: string, label: string, matchFn?: (path: string) => boolean) => {
    const isActive = matchFn ? matchFn(pathname) : pathname === href || (href !== "/" && pathname.startsWith(href));
    const base = "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200";
    const active = "bg-primary/10 text-primary shadow-sm";
    const inactive = "text-text-secondary hover:bg-surface hover:text-text-primary";
    return (
      <Link
        href={href}
        className={`${base} ${isActive ? active : inactive}`}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    );
  };
  const { hasActiveProject, clearActiveProject } = useActiveProject();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function handleNuevoProyecto() {
    clearActiveProject();
    router.push("/dashboard");
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 shrink-0 border-b border-border bg-background/90 backdrop-blur-md transition-colors duration-[250ms]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold tracking-tight text-text-primary transition hover:opacity-90"
        >
          <span className="text-lg">Mytsyy</span>
        </Link>

        <nav className="hidden items-center gap-0.5 sm:flex">
          {isAuthenticated && navLink("/dashboard", "Dashboard", (p) => p === "/dashboard")}
          {navLink("/explore", "Explorar", (p) => p === "/explore")}
          {navLink("/crear", "Crear con IA", (p) => p.startsWith("/crear"))}
          {isAuthenticated && navLink("/proyectos", "Mis proyectos", (p) => p === "/proyectos" || p.startsWith("/projects"))}
          {hasActiveProject && (
            <button
              type="button"
              onClick={handleNuevoProyecto}
              className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface hover:text-text-primary"
            >
              Nuevo proyecto
            </button>
          )}
          {isAuthenticated && navLink(
            user ? `/profile/${slugifyProfile(user)}` : "/perfil",
            "Perfil",
            (p) => p === "/perfil" || p.startsWith("/profile/")
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-surface hover:text-text-primary"
            aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          >
            {theme === "dark" ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          {isLoading ? (
            <span className="text-sm text-text-secondary">…</span>
          ) : isAuthenticated && user ? (
            <div className="relative" ref={ref}>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition hover:bg-surface hover:text-text-primary"
              >
                <span className="max-w-[120px] truncate sm:max-w-[180px]">
                  {user.name || user.email}
                </span>
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {open && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-border bg-surface py-1 shadow-lg transition-colors duration-[250ms]">
                  <Link
                    href={user ? `/profile/${slugifyProfile(user)}` : "/perfil"}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border px-3 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary"
                  >
                    Mi perfil público
                  </Link>
                  <Link
                    href="/perfil"
                    onClick={() => setOpen(false)}
                    className="block border-b border-border px-3 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary"
                  >
                    Configuración
                  </Link>
                  <div className="border-b border-border px-3 py-2 text-xs text-text-secondary">
                    {user.email}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-background hover:text-text-primary"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface hover:text-text-primary"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
