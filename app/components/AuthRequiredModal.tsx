"use client";

import Link from "next/link";

type AuthRequiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
  returnTo?: string;
};

export function AuthRequiredModal({ isOpen, onClose, returnTo = "/crear" }: AuthRequiredModalProps) {
  if (!isOpen) return null;

  const loginHref = `/login?returnTo=${encodeURIComponent(returnTo)}`;
  const signupHref = `/signup?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="auth-modal-title" className="text-lg font-semibold text-text-primary mb-2">
          Inicia sesión para continuar
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Para elegir una de las opciones y crear tu plan de 30 días, inicia sesión o regístrate.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href={loginHref}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-center text-sm font-medium text-text-primary transition hover:bg-surface"
          >
            Iniciar sesión
          </Link>
          <Link
            href={signupHref}
            className="rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-medium text-on-primary transition hover:bg-primary-hover"
          >
            Registrarse
          </Link>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-text-secondary transition hover:bg-background hover:text-text-primary"
          aria-label="Cerrar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
