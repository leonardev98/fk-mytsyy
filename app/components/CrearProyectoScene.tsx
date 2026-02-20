"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthSession } from "@/modules/auth";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useProjectsCatalog } from "../hooks/useProjectsCatalog";
import { DashboardChatScene } from "./DashboardChatScene";
import type { ExecutionData } from "@/modules/chat/domain/assistant-payload";

export function CrearProyectoScene() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthSession();
  const { setActiveProject } = useActiveProject();
  const catalog = useProjectsCatalog();

  async function handleCreateProject(executionData?: ExecutionData) {
    if (!isAuthenticated) {
      router.push("/login?returnTo=/crear");
      return;
    }
    if (
      executionData?.selectedProject != null &&
      executionData?.roadmap?.weeks != null
    ) {
      const created = await catalog.createProject({
        title: executionData.selectedProject.title ?? "Mi proyecto",
        description: executionData.selectedProject.description,
        source: "chat",
        introMessage: executionData.introMessage,
        roadmap: executionData.roadmap.weeks,
      });
      setActiveProject(created.id);
      router.push("/proyectos");
      return;
    }
    setActiveProject("1");
    router.push("/proyectos");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-text-secondary">Cargando…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DashboardChatScene onCreateProject={handleCreateProject} />
      {!isAuthenticated && (
        <div className="border-t border-border bg-background/80 px-4 py-3 text-center text-sm text-text-secondary">
          Inicia sesión o{" "}
          <Link href="/signup?returnTo=/crear" className="font-medium text-accent hover:underline">
            regístrate
          </Link>
          {" "}para guardar tu proyecto y el plan de 30 días.
        </div>
      )}
    </div>
  );
}
