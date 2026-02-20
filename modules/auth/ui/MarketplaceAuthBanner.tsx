"use client";

import Link from "next/link";
import { useAuthSession } from "./AuthSessionContext";

/**
 * Banner para marketplace: invita a login/registro para comprar e interactuar.
 * Solo se muestra si el usuario NO está logueado.
 */
export function MarketplaceAuthBanner() {
  const { isAuthenticated, isLoading } = useAuthSession();
  const returnTo = "/marketplace";

  if (isLoading || isAuthenticated) return null;

  return (
    <div className="mb-8 rounded-2xl border border-accent/30 bg-accent/10 px-5 py-4 transition-colors duration-[250ms]">
      <p className="text-sm text-text-secondary">
        Inicia sesión o regístrate para comprar e interactuar en el marketplace.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover"
        >
          Iniciar sesión
        </Link>
        <Link
          href={`/signup?returnTo=${encodeURIComponent(returnTo)}`}
          className="rounded-lg border border-border px-4 py-2 text-sm text-text-primary hover:bg-surface"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
