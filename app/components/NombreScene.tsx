"use client";

import { useState } from "react";
import { AuthGate } from "@/modules/auth";

const MOCK_NAMES = [
  "VendeSimple",
  "PrimeraVenta30",
  "ValidaYa",
  "EmprendeClaro",
  "TuPrimerCliente",
  "IdeaEnMovimiento",
  "PasoA Paso",
  "Mentoría 30",
];

export function NombreScene() {
  const [idea, setIdea] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setSuggestions(MOCK_NAMES);
      setIsLoading(false);
    }, 600);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          Busca el mejor nombre para tu negocio
        </h1>
        <p className="mt-2 text-text-secondary">
          Describe tu idea o nicho y te sugerimos nombres que transmitan acción y resultado.
        </p>
      </section>

      <AuthGate message="Inicia sesión para generar y guardar nombres para tu negocio.">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Ej: consultoría de redes para pymes"
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-primary px-5 py-3 font-medium text-on-primary transition hover:bg-primary-hover disabled:opacity-50"
            >
              {isLoading ? "Buscando…" : "Generar nombres"}
            </button>
          </div>
        </form>

        {suggestions.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">
              Sugerencias
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {suggestions.map((name) => (
                <li
                  key={name}
                  className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary"
                >
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-text-secondary">
              Próximamente podrás guardar tus favoritos y ver disponibilidad de dominio.
            </p>
          </div>
        )}
      </AuthGate>
    </div>
  );
}
