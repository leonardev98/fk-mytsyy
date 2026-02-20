import { AppNavbar } from "../../components/AppNavbar";
import { ProjectDetailScene } from "../../components/ProjectDetailScene";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <ProjectDetailScene id={id} />
      </main>
    </div>
  );
}
