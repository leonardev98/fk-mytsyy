import { AppNavbar } from "../components/AppNavbar";
import { ProjectsScene } from "../components/ProjectsScene";

export default function ProyectosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <ProjectsScene />
      </main>
    </div>
  );
}
