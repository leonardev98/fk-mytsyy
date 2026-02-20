import { AppNavbar } from "@/app/components/AppNavbar";
import { ProjectPublicScene } from "@/app/components/ProjectPublicScene";

export default async function ProjectPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <ProjectPublicScene projectId={id} />
      </main>
    </div>
  );
}
