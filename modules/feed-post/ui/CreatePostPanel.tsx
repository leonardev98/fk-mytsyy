"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthSession } from "@/modules/auth";

export type CreatePostPayload = {
  text: string;
  audience: "public" | "builders" | "only_me";
  currentDay?: number;
  totalDays?: number;
  progressPercent?: number;
};

export type CreatePostPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePostPayload) => void;
  placeholder?: string;
};

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" x2="19" y1="8" y2="14" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const SmileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" x2="9.01" y1="9" y2="9" />
    <line x1="15" x2="15.01" y1="9" y2="9" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function CreatePostPanel({
  isOpen,
  onClose,
  onSubmit,
  placeholder,
}: CreatePostPanelProps) {
  const { user } = useAuthSession();
  const [text, setText] = useState("");
  const [audience, setAudience] = useState<"Público" | "Builders" | "Solo yo">("Público");
  const [showAudienceDropdown, setShowAudienceDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const audienceToApi = (a: typeof audience): CreatePostPayload["audience"] =>
    a === "Público" ? "public" : a === "Builders" ? "builders" : "only_me";

  const displayName = user?.name || user?.email || "Usuario";
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  const resolvedPlaceholder = placeholder ?? `¿Qué estás pensando, ${displayName}?`;

  useEffect(() => {
    if (isOpen) {
      setText("");
      setShowAudienceDropdown(false);
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit({
      text: trimmed,
      audience: audienceToApi(audience),
      currentDay: 0,
      totalDays: 30,
      progressPercent: 0,
    });
    setText("");
    onClose();
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Crear publicación"
    >
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden
      />

      {/* Diálogo centrado tipo Facebook */}
      <div className="relative w-full max-w-[500px] rounded-2xl border border-border bg-surface shadow-xl">
        {/* Cabecera: título + cerrar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-lg font-semibold text-text-primary">Crear publicación</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-secondary transition hover:bg-background hover:text-text-primary"
            aria-label="Cerrar"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Usuario + audiencia */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-text-primary truncate">{displayName}</p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAudienceDropdown((v) => !v)}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-xs font-medium text-text-secondary transition hover:bg-background/80"
              >
                {audience}
                <ChevronDownIcon />
              </button>
              {showAudienceDropdown && (
                <>
                  <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-xl border border-border bg-surface py-1 shadow-lg">
                    {["Público", "Builders", "Solo yo"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setAudience(opt);
                          setShowAudienceDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-background"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div
                    className="fixed inset-0 z-0"
                    aria-hidden
                    onClick={() => setShowAudienceDropdown(false)}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="create-post-text" className="sr-only">
            Texto de la publicación
          </label>
          <textarea
            ref={textareaRef}
            id="create-post-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={resolvedPlaceholder}
            rows={5}
            className="w-full resize-none border-0 bg-transparent px-4 py-4 text-base text-text-primary placeholder:text-text-secondary focus:outline-none"
          />

          {/* Agregar a tu publicación */}
          <div className="border-t border-border px-4 py-2">
            <p className="mb-2 text-xs font-medium text-text-secondary">Agregar a tu publicación</p>
            <div className="flex items-center gap-1">
              <button type="button" className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-accent" title="Foto o video" aria-label="Foto o video">
                <PhotoIcon />
              </button>
              <button type="button" className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-accent" title="Etiquetar personas" aria-label="Etiquetar personas">
                <UserPlusIcon />
              </button>
              <button type="button" className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-accent" title="Sentimiento" aria-label="Sentimiento">
                <SmileIcon />
              </button>
              <button type="button" className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-accent" title="Ubicación" aria-label="Ubicación">
                <MapPinIcon />
              </button>
              <button type="button" className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-accent" title="Más" aria-label="Más opciones">
                <MoreIcon />
              </button>
            </div>
          </div>

          {/* Botón Publicar */}
          <div className="border-t border-border px-4 py-3">
            <button
              type="submit"
              disabled={!text.trim()}
              className="w-full rounded-xl bg-primary py-3 text-center font-semibold text-on-primary transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
