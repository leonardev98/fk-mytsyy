import { AppNavbar } from "@/app/components/AppNavbar";
import { ProfilePublicScene } from "@/app/components/ProfilePublicScene";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <ProfilePublicScene username={username} />
      </main>
    </div>
  );
}
