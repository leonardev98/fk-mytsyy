import { AppNavbar } from "@/app/components/AppNavbar";
import { ProfileByIdRedirect } from "./ProfileByIdRedirect";

export default async function ProfileByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <ProfileByIdRedirect id={id} />
      </main>
    </div>
  );
}
