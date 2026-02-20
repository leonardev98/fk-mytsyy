"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthSession } from "@/modules/auth";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useProjectsCatalog } from "../hooks/useProjectsCatalog";
import {
  DashboardLayout,
  MomentumCard,
  FeedColumn,
  ReputationColumn,
  type FeedPost,
  type RankedBuilder,
  type TopStreak,
  type TrendingProject,
} from "../dashboard/components";

const MOCK_STREAK_DAYS = 5;
const MOCK_MONTHLY_GOAL = "Validar con 3 clientes potenciales";
const MOCK_AVERAGE_PROGRESS = 42;

const MOCK_FEED_POSTS: FeedPost[] = [
  {
    id: "1",
    authorName: "María García",
    authorUsername: "mariag",
    time: "Hace 2 h",
    text: "Día 12/30 – Hoy lancé la landing. Primeros visitantes.",
    currentDay: 12,
    totalDays: 30,
    progressPercent: 40,
    reactionCount: 8,
  },
  {
    id: "2",
    authorName: "Carlos Ruiz",
    authorUsername: "carlosr",
    time: "Hace 5 h",
    text: "Conseguí mi primer cliente. La validación funciona.",
    currentDay: 18,
    totalDays: 30,
    progressPercent: 60,
    evidenceLink: "https://example.com/demo",
    reactionCount: 24,
  },
  {
    id: "3",
    authorName: "Ana López",
    authorUsername: "analopez",
    time: "Ayer",
    text: "Semana 3 del plan. MVP casi listo para probar.",
    currentDay: 21,
    totalDays: 30,
    progressPercent: 70,
    reactionCount: 5,
  },
];

const MOCK_WEEKLY_RANKING: RankedBuilder[] = [
  { rank: 1, username: "mariag", displayName: "María García", streakDays: 12, completedProjects: 2 },
  { rank: 2, username: "carlosr", displayName: "Carlos Ruiz", streakDays: 18, completedProjects: 1 },
  { rank: 3, username: "analopez", displayName: "Ana López", streakDays: 21, completedProjects: 3 },
  { rank: 4, username: "pablom", displayName: "Pablo Martín", streakDays: 8, completedProjects: 0 },
  { rank: 5, username: "laurav", displayName: "Laura Vega", streakDays: 5, completedProjects: 1 },
];

const MOCK_TOP_STREAKS: TopStreak[] = [
  { username: "analopez", displayName: "Ana López", streakDays: 21 },
  { username: "carlosr", displayName: "Carlos Ruiz", streakDays: 18 },
  { username: "mariag", displayName: "María García", streakDays: 12 },
];

const MOCK_TRENDING_PROJECTS: TrendingProject[] = [
  { id: "1", title: "App de reservas para peluquerías" },
  { id: "2", title: "CRM para pymes" },
  { id: "3", title: "Marketplace de cursos locales" },
];

const MOCK_IDEA_OF_THE_DAY =
  "Un marketplace que conecte artesanos locales con tiendas de barrio, con pedidos mínimos y reparto semanal.";

export function DashboardScene() {
  const { isAuthenticated, isLoading: authLoading } = useAuthSession();
  const { activeProjectId } = useActiveProject();
  const catalog = useProjectsCatalog();
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      setActiveProjectsCount(0);
      return;
    }
    catalog
      .listProjects()
      .then((list) => setActiveProjectsCount(list.length))
      .catch(() => setActiveProjectsCount(0));
  }, [isAuthenticated, catalog]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-text-secondary">Cargando…</span>
      </div>
    );
  }

  const continueProjectHref =
    activeProjectId && isAuthenticated
      ? `/proyectos/${activeProjectId}`
      : null;

  return (
    <>
      <DashboardLayout
        left={
          <MomentumCard
            streakDays={MOCK_STREAK_DAYS}
            activeProjectsCount={activeProjectsCount}
            monthlyGoal={MOCK_MONTHLY_GOAL}
            averageProgressPercent={MOCK_AVERAGE_PROGRESS}
            continueProjectHref={continueProjectHref}
            isAuthenticated={!!isAuthenticated}
          />
        }
        center={
          <FeedColumn
            posts={MOCK_FEED_POSTS}
            isAuthenticated={!!isAuthenticated}
          />
        }
        right={
          <ReputationColumn
            weeklyRanking={MOCK_WEEKLY_RANKING}
            topStreaks={MOCK_TOP_STREAKS}
            trendingProjects={MOCK_TRENDING_PROJECTS}
            ideaOfTheDay={MOCK_IDEA_OF_THE_DAY}
          />
        }
      />

      {!isAuthenticated && (
        <div className="dashboard-in mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 [animation-delay:150ms]">
          <div className="rounded-2xl border border-border bg-surface/80 px-4 py-4 text-center text-sm text-text-secondary">
            <Link
              href="/login?returnTo=/dashboard"
              className="font-medium text-accent hover:underline"
            >
              Inicia sesión
            </Link>
            {" o "}
            <Link
              href="/signup?returnTo=/dashboard"
              className="font-medium text-accent hover:underline"
            >
              regístrate
            </Link>
            {" para crear tu proyecto y acumular reputación verificable."}
          </div>
        </div>
      )}
    </>
  );
}
