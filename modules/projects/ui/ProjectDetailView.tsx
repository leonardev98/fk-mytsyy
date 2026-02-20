"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { Project, RoadmapStep, RoadmapWeek } from "../domain";
import {
  getProjectImageUrl,
  setProjectImageUrl,
  compressImageForStorage,
} from "../lib/project-image";

function isRoadmapStep(
  step: RoadmapStep | RoadmapWeek
): step is RoadmapStep {
  return "title" in step && "tasks" in step;
}

type ProjectDetailViewProps = {
  project: Project;
};

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const { buyerPersona, roadmap, roadmapSteps, title, description, progress } =
    project;
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(() =>
    getProjectImageUrl(project.id)
  );
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const steps = roadmapSteps ?? roadmap ?? [];
  const coverUrl = localImageUrl ?? project.imageUrl ?? null;

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoError(null);
    setPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const compressed = await compressImageForStorage(dataUrl);
        setLocalImageUrl(compressed);
        const result = setProjectImageUrl(project.id, compressed);
        if (!result.ok) {
          setPhotoError(
            result.reason === "quota"
              ? "No se pudo guardar: espacio insuficiente. Prueba con una foto más pequeña o elimina la imagen de otro proyecto."
              : "No se pudo guardar la imagen. Inténtalo de nuevo."
          );
        }
      } catch {
        setPhotoError("No se pudo procesar la imagen. Inténtalo de nuevo.");
      } finally {
        setPhotoLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/proyectos"
        className="mb-6 inline-block text-sm text-text-secondary hover:text-text-primary transition"
      >
        ← Volver a Mis proyectos
      </Link>

      <header className="mb-10">
        <div className="relative rounded-2xl overflow-hidden bg-surface border border-border mb-6 aspect-[2/1] max-h-56">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary">
              <span className="text-sm">Sin imagen</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={photoLoading}
            className="absolute bottom-3 right-3 rounded-xl bg-primary/90 backdrop-blur px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90 transition disabled:opacity-70"
          >
            {photoLoading ? "Guardando…" : coverUrl ? "Cambiar foto" : "Añadir foto"}
          </button>
        </div>
        {photoError && (
          <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {photoError}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          {title}
        </h1>
        {(description ?? "").length > 0 && (
          <p className="mt-2 text-text-secondary">{description}</p>
        )}
      </header>

      {buyerPersona && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium text-text-primary">
            Buyer persona
          </h2>
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

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-medium text-text-primary">
          Plan 30 días — Lo que tienes que hacer
        </h2>
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

      {progress && progress.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium text-text-primary">
            Avance
          </h2>
          <div className="space-y-3">
            {progress
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-border bg-surface px-4 py-3 text-sm"
                >
                  <p className="text-text-secondary">
                    {new Date(entry.date).toLocaleDateString("es", {
                      dateStyle: "medium",
                    })}
                    {entry.percent != null ? ` — ${entry.percent}%` : ""}
                  </p>
                  {entry.notes && (
                    <p className="mt-1 text-text-secondary">{entry.notes}</p>
                  )}
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
