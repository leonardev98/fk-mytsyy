import { AppNavbar } from "../../components/AppNavbar";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <Link
            href="/login"
            className="mb-6 inline-block font-semibold text-text-primary transition hover:opacity-90"
          >
            ← Volver a iniciar sesión
          </Link>
          <h1 className="text-2xl font-semibold text-text-primary">
            Recuperar contraseña
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Pantalla placeholder. Solo frontend.
          </p>
        </div>
      </main>
    </div>
  );
}
