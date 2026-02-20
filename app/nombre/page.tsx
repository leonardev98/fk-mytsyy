import { AppNavbar } from "../components/AppNavbar";
import { NombreScene } from "../components/NombreScene";

export default function NombrePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <NombreScene />
      </main>
    </div>
  );
}
