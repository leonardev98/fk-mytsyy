"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

/**
 * Banner tipo Alibaba: "Inicia sesión o regístrate para comprar".
 * Se muestra cuando el usuario llegó desde un intento de compra (returnTo con buy).
 */
export function LoginGateBanner() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const fromBuy = returnTo?.includes("buy=");

  if (!fromBuy) return null;

  const loginHref = `/login?returnTo=${encodeURIComponent(returnTo ?? "/marketplace")}`;
  const signupHref = `/signup?returnTo=${encodeURIComponent(returnTo ?? "/marketplace")}`;

  return (
    <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 transition-colors duration-[250ms]">
      <p className="text-sm text-text-secondary">
        Inicia sesión o regístrate para completar tu compra.
      </p>
      <div className="mt-2 flex gap-2">
        <Link
          href={loginHref}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-on-primary hover:bg-primary-hover"
        >
          Iniciar sesión
        </Link>
        <Link
          href={signupHref}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-primary hover:bg-surface"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
