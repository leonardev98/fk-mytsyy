"use client";

import { useState, useRef, FormEvent } from "react";
import type { SendMessageOptions } from "../application/ports";
import {
  extractDocumentText,
  isAcceptedFile,
  isWithinSizeLimit,
  ACCEPT_DOCUMENT,
} from "../lib/extract-document-text";

export function ChatInput({
  onSend,
  disabled,
  variant = "default",
}: {
  onSend: (content: string, options?: SendMessageOptions) => void;
  disabled?: boolean;
  variant?: "default" | "center";
}) {
  const [input, setInput] = useState("");
  const [attachedText, setAttachedText] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasAttachment = Boolean(attachedText?.trim());

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if ((!text && !hasAttachment) || disabled || extracting) return;

    const baseMessage = text || "Te adjunto mi proyecto";
    const message = hasAttachment && attachedFileName
      ? `${baseMessage} (${attachedFileName})`
      : baseMessage;
    if (hasAttachment) {
      onSend(message, { attachedContent: attachedText! });
      setAttachedText(null);
      setAttachedFileName(null);
      setExtractError(null);
    } else {
      onSend(message);
    }
    setInput("");
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!isWithinSizeLimit(file)) {
      setExtractError("Archivo demasiado grande. Máximo 15 MB.");
      return;
    }
    if (!isAcceptedFile(file)) {
      setExtractError("Formato no soportado. Usa PDF, TXT o Word (.doc/.docx).");
      return;
    }
    setExtractError(null);
    setExtracting(true);
    try {
      const text = await extractDocumentText(file);
      setAttachedText(text);
      setAttachedFileName(file.name);
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : "Error al leer el documento.");
      setAttachedText(null);
      setAttachedFileName(null);
    } finally {
      setExtracting(false);
    }
  }

  function clearAttachment() {
    setAttachedText(null);
    setAttachedFileName(null);
    setExtractError(null);
  }

  const formClass =
    variant === "center"
      ? "flex flex-col gap-2 rounded-2xl border border-border bg-surface px-3 py-2.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30 transition-colors duration-[250ms]"
      : "flex flex-col gap-2 rounded-2xl border border-border bg-surface px-3 py-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30 transition-colors duration-[250ms]";

  const canSend = (input.trim() || hasAttachment) && !disabled && !extracting;

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_DOCUMENT}
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />
      {attachedFileName && (
        <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm">
          <span className="min-w-0 truncate text-text-secondary" title={attachedFileName}>
            📎 {attachedFileName}
          </span>
          <button
            type="button"
            onClick={clearAttachment}
            className="shrink-0 text-text-secondary hover:text-text-primary"
            aria-label="Quitar adjunto"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {extractError && (
        <p className="text-xs text-amber-400/90">{extractError}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || extracting}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-secondary transition hover:bg-surface hover:text-text-primary disabled:opacity-40"
          title="Subir mi proyecto (PDF, TXT, Word)"
          aria-label="Subir documento"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={hasAttachment ? "Añade un mensaje (opcional)" : "Quiero empezar un negocio de..."}
          className="min-w-0 flex-1 bg-transparent py-2.5 pl-1 text-sm text-text-primary placeholder-text-secondary outline-none"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!canSend}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary transition hover:bg-primary-hover disabled:opacity-40 disabled:hover:bg-primary"
          aria-label="Enviar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </form>
  );
}
