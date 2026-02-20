"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthSession } from "@/modules/auth";
import { useProjectsCatalog } from "../hooks/useProjectsCatalog";
import type { Project } from "@/modules/projects";
import {
  ChatServiceProvider,
  Chat,
  ChatApiAdapter,
} from "@/modules/chat";
import { useMemo } from "react";

type ProjectPublicSceneProps = {
  projectId: string;
};

// Mock daily updates and comments (backend-ready)
type DailyUpdate = {
  id: string;
  day: number;
  date: string;
  text: string;
  evidenceImageUrl?: string | null;
  evidenceLink?: string | null;
};

type Comment = {
  id: string;
  authorName: string;
  authorUsername: string;
  time: string;
  text: string;
};

const MOCK_DAILY_UPDATES: DailyUpdate[] = [
  { id: "u1", day: 8, date: "2025-02-18", text: "Landing lista. Primeros 50 visitantes.", evidenceLink: "https://example.com" },
  { id: "u2", day: 7, date: "2025-02-17", text: "Diseño de onboarding terminado." },
  { id: "u3", day: 6, date: "2025-02-16", text: "Integré el pago. Pruebas en staging." },
];

const MOCK_COMMENTS: Comment[] = [
  { id: "c1", authorName: "Ana López", authorUsername: "analopez", time: "Hace 1 h", text: "¡Muy buen avance! La landing se ve profesional." },
  { id: "c2", authorName: "Carlos R.", authorUsername: "carlosr", time: "Hace 3 h", text: "¿Qué stack usaste para el onboarding?" },
];

export function ProjectPublicScene({ projectId }: ProjectPublicSceneProps) {
  const { isAuthenticated } = useAuthSession();
  const catalog = useProjectsCatalog();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    catalog
      .getProjectById(projectId)
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [catalog, projectId]);

  const totalDays = 30;
  const currentDay = project?.lastProgress?.progressPercent != null
    ? Math.round((project.lastProgress.progressPercent / 100) * totalDays)
    : 8;
  const progressPercent = project?.lastProgress?.progressPercent ?? (currentDay / totalDays) * 100;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">Cargando proyecto…</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-text-secondary">Proyecto no encontrado.</p>
        <Link href="/explore" className="mt-4 inline-block text-accent hover:underline">
          Explorar proyectos
        </Link>
      </div>
    );
  }

  const isOwner = false; // TODO: compare with current user when backend provides owner

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="dashboard-in">
        <Link
          href="/explore"
          className="mb-6 inline-block text-sm text-text-secondary transition hover:text-text-primary"
        >
          ← Explorar
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                {project.title}
              </h1>
              <p className="mt-1 rounded bg-accent/20 px-2 py-0.5 text-sm font-medium text-accent inline-block">
                Día {currentDay}/{totalDays}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFollowing((f) => !f)}
                className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-primary/10"
              >
                {following ? "Siguiendo ✓" : "Seguir proyecto"}
              </button>
              {isAuthenticated && isOwner && (
                <Link
                  href={`/proyectos/${projectId}`}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-on-primary transition hover:bg-primary-hover"
                >
                  Gestionar
                </Link>
              )}
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-accent transition-all duration-200"
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>

          {project.description != null && project.description !== "" && (
            <p className="mt-4 text-text-secondary">{project.description}</p>
          )}
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
            Objetivo final
          </h2>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-text-primary">
              Validar el producto con al menos 3 clientes de pago en 30 días.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
            Actualizaciones diarias
          </h2>
          <ul className="space-y-3">
            {MOCK_DAILY_UPDATES.map((u) => (
              <li
                key={u.id}
                className="rounded-2xl border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="font-medium text-accent">Día {u.day}</span>
                  <span>{new Date(u.date).toLocaleDateString("es", { dateStyle: "medium" })}</span>
                </div>
                <p className="mt-2 text-sm text-text-primary">{u.text}</p>
                {u.evidenceImageUrl && (
                  <img
                    src={u.evidenceImageUrl}
                    alt=""
                    className="mt-2 max-h-48 w-full rounded-xl object-cover"
                  />
                )}
                {u.evidenceLink && (
                  <a
                    href={u.evidenceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-accent hover:underline"
                  >
                    Ver evidencia →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-secondary">
            Comentarios de la comunidad
          </h2>
          <ul className="space-y-3">
            {MOCK_COMMENTS.map((c) => (
              <li
                key={c.id}
                className="rounded-2xl border border-border bg-surface p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <Link
                    href={`/profile/${c.authorUsername}`}
                    className="font-medium text-text-primary hover:text-accent"
                  >
                    {c.authorName}
                  </Link>
                  <span className="text-xs text-text-secondary">{c.time}</span>
                </div>
                <p className="mt-1 text-sm text-text-secondary">{c.text}</p>
              </li>
            ))}
          </ul>
          {isAuthenticated && (
            <p className="mt-2 text-xs text-text-secondary">
              Añadir comentario (próximamente).
            </p>
          )}
        </section>

        {isAuthenticated && (
          <section className="mb-8">
            <button
              type="button"
              onClick={() => setChatOpen((o) => !o)}
              className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-background"
            >
              {chatOpen ? "Ocultar herramienta IA" : "Abrir herramienta IA (chat)"}
            </button>
            {chatOpen && (
              <div className="mt-4 rounded-2xl border border-border bg-surface overflow-hidden">
                <ProjectChat projectId={projectId} />
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function ProjectChat({ projectId }: { projectId: string }) {
  const chatPort = useMemo(() => new ChatApiAdapter(), []);
  return (
    <ChatServiceProvider port={chatPort}>
      <div className="h-[400px]">
        <Chat />
      </div>
    </ChatServiceProvider>
  );
}
