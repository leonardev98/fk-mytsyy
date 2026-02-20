import { AppNavbar } from "@/app/components/AppNavbar";
import { ProjectCreateWizard } from "./ProjectCreateWizard";

export default function ProjectCreatePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <ProjectCreateWizard />
      </main>
    </div>
  );
}
