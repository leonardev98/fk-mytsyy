"use client";

import { useRouter } from "next/navigation";
import { ProjectsView } from "@/modules/projects";
import { useProjectsCatalog } from "../hooks/useProjectsCatalog";
import { useActiveProject } from "../context/ActiveProjectContext";

export function ProjectsScene() {
  const catalog = useProjectsCatalog();
  const router = useRouter();
  const { setActiveProject } = useActiveProject();

  function handleOpenInDashboard(projectId: string) {
    setActiveProject(projectId);
    router.push("/dashboard");
  }

  return (
    <ProjectsView
      catalog={catalog}
      onOpenInDashboard={handleOpenInDashboard}
    />
  );
}
