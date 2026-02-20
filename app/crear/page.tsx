import { AppNavbar } from "../components/AppNavbar";
import { CrearProyectoScene } from "../components/CrearProyectoScene";

export default function CrearPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <CrearProyectoScene />
      </main>
    </div>
  );
}
