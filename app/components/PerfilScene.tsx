"use client";

import Link from "next/link";
import { useAuthSession } from "@/modules/auth";

export function PerfilScene() {
  const { user, isAuthenticated, logout, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">Cargando…</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-text-secondary">Inicia sesión para ver tu perfil.</p>
        <Link
          href="/login?returnTo=/perfil"
          className="mt-4 inline-block text-accent hover:underline"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
        Perfil
      </h1>
      <p className="mt-1 text-sm text-text-secondary">Tu cuenta</p>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Nombre
            </dt>
            <dd className="mt-1 text-text-primary">{user.name || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Correo
            </dt>
            <dd className="mt-1 text-text-primary">{user.email}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8">
        <p className="text-sm text-text-secondary">
          Marketplace y más opciones próximamente.
        </p>
      </div>

      <button
        type="button"
        onClick={() => logout()}
        className="mt-8 rounded-xl border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-text-primary"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
