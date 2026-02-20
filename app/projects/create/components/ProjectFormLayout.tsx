"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const STEPS = [
  { id: 1, label: "Información base" },
  { id: 2, label: "Visión estratégica" },
  { id: 3, label: "Configuración" },
];

type ProjectFormLayoutProps = {
  currentStep: number;
  children: ReactNode;
};

export function ProjectFormLayout({
  currentStep,
  children,
}: ProjectFormLayoutProps) {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/proyectos"
        className="mb-8 inline-block text-sm text-text-secondary transition hover:text-text-primary"
      >
        ← Volver a Mis proyectos
      </Link>

      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          Nuevo proyecto
        </h1>
        <p className="mt-2 text-text-secondary">
          Define tu proyecto en 3 pasos. Puedes crear manualmente o generar desde un documento.
        </p>
      </header>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-all duration-200"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between">
          {STEPS.map((step) => (
            <span
              key={step.id}
              className={`text-xs font-medium transition-colors duration-200 ${
                step.id <= currentStep
                  ? "text-text-primary"
                  : "text-text-secondary"
              }`}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <div className="dashboard-in">{children}</div>
    </div>
  );
}
