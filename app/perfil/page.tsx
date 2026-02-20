import { AppNavbar } from "../components/AppNavbar";
import { PerfilScene } from "../components/PerfilScene";

export default function PerfilPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <PerfilScene />
      </main>
    </div>
  );
}
