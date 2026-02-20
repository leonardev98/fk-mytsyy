"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthSession, isAuthApiError } from "./AuthSessionContext";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/";
  const { register } = useAuthSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acceptTerms) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ email, password, name: name.trim() || undefined });
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
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
          Nombre
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="mt-1 w-full rounded-xl border border-border bg-surface px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors duration-[250ms]"
          placeholder="Tu nombre (opcional)"
        />
      </div>
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
          autoComplete="new-password"
          minLength={6}
          className="mt-1 w-full rounded-xl border border-border bg-surface px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors duration-[250ms]"
          placeholder="Mínimo 6 caracteres"
        />
      </div>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-1 rounded border-border bg-surface text-accent focus:ring-accent/50"
        />
        <span className="text-sm text-text-secondary">
          Acepto los{" "}
          <a href="/terms" className="text-accent hover:underline">
            Términos de uso
          </a>{" "}
          y la{" "}
          <a href="/privacy" className="text-accent hover:underline">
            Política de privacidad
          </a>
          .
        </span>
      </label>
      <button
        type="submit"
        disabled={isSubmitting || !acceptTerms}
        className="w-full rounded-xl bg-primary py-3 font-medium text-on-primary transition hover:bg-primary-hover disabled:opacity-50 duration-[250ms]"
      >
        {isSubmitting ? "Creando cuenta…" : "Registrarme"}
      </button>
    </form>
  );
}
