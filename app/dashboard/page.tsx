import { AppNavbar } from "../components/AppNavbar";
import { DashboardScene } from "../components/DashboardScene";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <DashboardScene />
      </main>
    </div>
  );
}
