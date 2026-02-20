import { Suspense } from "react";
import { AppNavbar } from "../components/AppNavbar";
import { AuthLayout, RegisterForm, LoginGateBanner } from "@/modules/auth";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNavbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Suspense fallback={null}>
            <LoginGateBanner />
          </Suspense>
          <AuthLayout
            title="Crear cuenta"
            subtitle="Regístrate para acceder al marketplace y más."
            footerLink="/login"
            footerLabel="¿Ya tienes cuenta? Inicia sesión"
          >
            <RegisterForm />
          </AuthLayout>
        </div>
      </main>
    </div>
  );
}
