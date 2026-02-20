import { AppNavbar } from "../../components/AppNavbar";
import { ProyectoScene } from "../../components/ProyectoScene";

export default function ProyectoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex-1">
        <ProyectoScene />
      </main>
    </div>
  );
}
