"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthSession, isAuthApiError } from "./AuthSessionContext";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/";
  const { login } = useAuthSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push(returnTo);
    } catch (e) {
      if (isAuthApiError(e)) {
        setError(e.message);
      } else {
        setError("No se pudo conectar. Revisa tu conexión.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
          Correo
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="mt-1 w-full rounded-xl border border-border bg-surface px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors duration-[250ms]"
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-xl border border-border bg-surface px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors duration-[250ms]"
          placeholder="••••••••"
        />
      </div>
      <div className="flex items-center justify-end">
        <Link
          href="/login/forgot"
          className="text-sm text-text-secondary hover:text-accent"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-primary py-3 font-medium text-on-primary transition hover:bg-primary-hover disabled:opacity-50 duration-[250ms]"
      >
        {isSubmitting ? "Entrando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
