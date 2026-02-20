"use client";

import { BuilderCard } from "./BuilderCard";
import { ProjectCardPublic } from "./ProjectCardPublic";

// Mock data (backend-ready)
const MOCK_BUILDERS = [
  {
    username: "mariag",
    displayName: "María García",
    bio: "Builder enfocada en SaaS B2B.",
    streakDays: 12,
    completedProjects: 2,
    level: 3,
  },
  {
    username: "carlosr",
    displayName: "Carlos Ruiz",
    bio: "Validando ideas en 30 días.",
    streakDays: 18,
    completedProjects: 1,
    level: 2,
  },
  {
    username: "analopez",
    displayName: "Ana López",
    bio: "MVP en 30 días. Construyendo en público.",
    streakDays: 21,
    completedProjects: 3,
    level: 4,
  },
];

const MOCK_PROJECTS = [
  {
    id: "1",
    title: "App de reservas para peluquerías",
    description: "SaaS para gestionar citas y pagos.",
    currentDay: 12,
    totalDays: 30,
    progressPercent: 40,
    authorUsername: "mariag",
    authorName: "María García",
  },
  {
    id: "2",
    title: "CRM para pymes",
    description: "CRM simple y asequible.",
    currentDay: 18,
    totalDays: 30,
    progressPercent: 60,
    authorUsername: "carlosr",
    authorName: "Carlos Ruiz",
  },
  {
    id: "3",
    title: "Marketplace de cursos locales",
    description: "Conectar profesores y alumnos locales.",
    currentDay: 8,
    totalDays: 30,
    progressPercent: 27,
    authorUsername: "analopez",
    authorName: "Ana López",
  },
];

export function ExploreScene() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="dashboard-in">
        <section className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Explorar
          </h1>
          <p className="mt-2 text-text-secondary">
            Descubre builders que construyen en 30 días y proyectos en ejecución.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
            Builders
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_BUILDERS.map((b) => (
              <BuilderCard
                key={b.username}
                username={b.username}
                displayName={b.displayName}
                bio={b.bio}
                streakDays={b.streakDays}
                completedProjects={b.completedProjects}
                level={b.level}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
            Proyectos en ejecución
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {MOCK_PROJECTS.map((p) => (
              <ProjectCardPublic
                key={p.id}
                id={p.id}
                title={p.title}
                description={p.description}
                currentDay={p.currentDay}
                totalDays={p.totalDays}
                progressPercent={p.progressPercent}
                authorUsername={p.authorUsername}
                authorName={p.authorName}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
