import { AppNavbar } from "@/app/components/AppNavbar";
import { ExploreScene } from "@/app/components/ExploreScene";

export default function ExplorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <ExploreScene />
      </main>
    </div>
  );
}
