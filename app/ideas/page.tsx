import { AppNavbar } from "../components/AppNavbar";
import { IdeasScene } from "../components/IdeasScene";

export default function IdeasPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <IdeasScene />
      </main>
    </div>
  );
}
