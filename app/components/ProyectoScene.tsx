"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthSession } from "@/modules/auth";
import { useActiveProject } from "../context/ActiveProjectContext";
import type { Project } from "@/modules/projects";
import { useProjectsCatalog } from "../hooks/useProjectsCatalog";

function isRoadmapStep(
  step: { week?: number; title?: string; tasks?: string[]; goals?: string[]; actions?: string[] }
): step is { week: number; title: string; tasks: string[]; checkpoint?: string } {
  return "title" in step && "tasks" in step && Array.isArray(step.tasks);
}

function PlanTab({ project }: { project: Project }) {
  const { buyerPersona, roadmap, roadmapSteps } = project;
  const steps = roadmapSteps ?? roadmap ?? [];

  return (
    <>
      {buyerPersona && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium text-text-primary">Buyer persona</h2>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-secondary">Nombre / perfil</dt>
                <dd className="text-text-primary">{buyerPersona.name}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Edad</dt>
                <dd className="text-text-primary">{buyerPersona.ageRange}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Dolor o problema</dt>
                <dd className="text-text-primary">{buyerPersona.pain}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Objetivo</dt>
                <dd className="text-text-primary">{buyerPersona.goal}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Dónde está</dt>
                <dd className="text-text-primary">{buyerPersona.whereTheyAre}</dd>
              </div>
            </dl>
          </div>
        </section>
      )}
      <section>
        <h2 className="mb-4 text-lg font-medium text-text-primary">Plan 30 días</h2>
        <div className="space-y-6">
          {steps.map((step, idx) =>
            isRoadmapStep(step) ? (
              <div
                key={step.week ?? idx}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-lg bg-accent/20 px-2 py-1 text-xs font-medium text-accent">
                    Semana {step.week}
                  </span>
                  <h3 className="font-medium text-text-primary">{step.title}</h3>
                </div>
                <ul className="mb-3 list-inside list-disc space-y-1 text-sm text-text-secondary">
                  {step.tasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
                {step.checkpoint && (
                  <p className="border-t border-border pt-3 text-xs text-accent/90">
                    Checkpoint: {step.checkpoint}
                  </p>
                )}
              </div>
            ) : (
              <div
                key={(step.week ?? idx) + "-w"}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-lg bg-accent/20 px-2 py-1 text-xs font-medium text-accent">
                    Semana {step.week ?? idx + 1}
                  </span>
                </div>
                {(step.goals?.length ?? 0) > 0 && (
                  <ul className="mb-2 list-inside list-disc space-y-0.5 text-sm text-text-secondary">
                    {step.goals!.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                )}
                {(step.actions?.length ?? 0) > 0 && (
                  <ul className="list-inside list-disc space-y-0.5 text-sm text-text-secondary">
                    {step.actions!.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}

const TABS = [
  { id: "plan", label: "Plan" },
  { id: "tareas", label: "Tareas" },
  { id: "branding", label: "Branding" },
] as const;

const MOCK_TASKS = [
  { id: "1", title: "Escribir en una frase qué ofreces y a quién", done: false },
  { id: "2", title: "Listar 5 negocios locales que serían clientes ideales", done: false },
  { id: "3", title: "Definir un precio de entrada", done: true },
];

export function ProyectoScene() {
  const { isAuthenticated, isLoading: authLoading } = useAuthSession();
  const { activeProjectId } = useActiveProject();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("plan");
  const [nombreInput, setNombreInput] = useState("");
  const [nombreSuggestions, setNombreSuggestions] = useState<string[]>([]);

  const catalog = useProjectsCatalog();
  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);

  useEffect(() => {
    if (!activeProjectId) {
      setProject(null);
      setProjectLoading(false);
      return;
    }
    catalog
      .getProjectById(activeProjectId)
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setProjectLoading(false));
  }, [activeProjectId, catalog]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-text-secondary">Cargando…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-text-secondary">Inicia sesión para ver tu proyecto.</p>
        <Link
          href="/login?returnTo=/dashboard/proyecto"
          className="mt-4 inline-block text-accent hover:underline"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (projectLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-text-secondary">Cargando proyecto…</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-text-secondary">No tienes un proyecto activo.</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-accent hover:underline"
        >
          Ir al dashboard
        </Link>
      </div>
    );
  }

  function handleGenerarNombres(e: React.FormEvent) {
    e.preventDefault();
    setNombreSuggestions([
      "VendeSimple",
      "PrimeraVenta30",
      "ValidaYa",
      "EmprendeClaro",
    ]);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/dashboard"
        className="mb-6 inline-block text-sm text-text-secondary hover:text-text-primary"
      >
        ← Dashboard
      </Link>

      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          {project.title}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{project.description}</p>
      </header>

      <nav className="mb-8 flex gap-1 rounded-xl border border-border bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-primary/10 text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "plan" && <PlanTab project={project} />}

      {tab === "tareas" && (
        <section>
          <h2 className="mb-4 text-lg font-medium text-text-primary">Tareas</h2>
          <ul className="space-y-3">
            {MOCK_TASKS.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <input
                  type="checkbox"
                  defaultChecked={task.done}
                  className="rounded border-border bg-surface text-accent"
                />
                <span
                  className={
                    task.done ? "text-sm text-text-secondary line-through" : "text-sm text-text-primary"
                  }
                >
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "branding" && (
        <section>
          <h2 className="mb-4 text-lg font-medium text-text-primary">
            Mejor nombre para tu negocio
          </h2>
          <p className="mb-6 text-sm text-text-secondary">
            Busca un nombre que transmita acción y resultado.
          </p>
          <form onSubmit={handleGenerarNombres} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={nombreInput}
                onChange={(e) => setNombreInput(e.target.value)}
                placeholder="Ej: consultoría de redes para pymes"
                className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-text-primary placeholder-text-secondary outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-3 font-medium text-on-primary hover:bg-primary-hover"
              >
                Generar nombres
              </button>
            </div>
          </form>
          {nombreSuggestions.length > 0 && (
            <ul className="grid gap-2 sm:grid-cols-2">
              {nombreSuggestions.map((name) => (
                <li
                  key={name}
                  className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
