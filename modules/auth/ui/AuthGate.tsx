"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthSession } from "./AuthSessionContext";

type AuthGateProps = {
  children: React.ReactNode;
  message: string;
  loginLabel?: string;
  signupLabel?: string;
  returnTo?: string;
};

/**
 * Muestra children solo si el usuario está logueado.
 * Si no, muestra message + enlaces a login y registro.
 */
export function AuthGate({
  children,
  message,
  loginLabel = "Iniciar sesión",
  signupLabel = "Registrarse",
  returnTo,
}: AuthGateProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthSession();
  const to = returnTo ?? pathname ?? "/";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-text-secondary">Cargando…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    const loginHref = `/login?returnTo=${encodeURIComponent(to)}`;
    const signupHref = `/signup?returnTo=${encodeURIComponent(to)}`;

    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center transition-colors duration-[250ms]">
        <p className="text-text-secondary">{message}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={loginHref}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
          >
            {loginLabel}
          </Link>
          <Link
            href={signupHref}
            className="rounded-xl border border-border px-5 py-2.5 text-sm text-text-primary transition hover:bg-surface"
          >
            {signupLabel}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
