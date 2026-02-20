import { Suspense } from "react";
import { AppNavbar } from "../components/AppNavbar";
import { AuthLayout, LoginForm, LoginGateBanner } from "@/modules/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Suspense fallback={null}>
            <LoginGateBanner />
          </Suspense>
          <AuthLayout
            title="Iniciar sesión"
            subtitle="Entra a tu cuenta para continuar."
            footerLink="/signup"
            footerLabel="¿No tienes cuenta? Regístrate"
          >
            <LoginForm />
          </AuthLayout>
        </div>
      </main>
    </div>
  );
}
