"use client";

import { useCallback, useState } from "react";

const ACCEPT = { "application/pdf": [".pdf"], "text/plain": [".txt"] };
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

type UploadDropzoneProps = {
  onFileAccepted: (file: File) => void;
  loading?: boolean;
};

export function UploadDropzone({
  onFileAccepted,
  loading = false,
}: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((file: File): string | null => {
    if (file.size > MAX_SIZE) {
      return "El archivo no puede superar 10 MB.";
    }
    const validTypes = ["application/pdf", "text/plain"];
    if (!validTypes.includes(file.type)) {
      return "Solo se permiten archivos PDF o TXT.";
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File | null) => {
      setError(null);
      if (!file) return;
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      onFileAccepted(file);
    },
    [onFileAccepted, validate]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      handleFile(file ?? null);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      handleFile(file ?? null);
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative rounded-2xl border-2 border-dashed transition-colors duration-200 ${
        dragActive
          ? "border-accent bg-accent/5"
          : "border-border bg-surface/50 hover:border-primary/30"
      } ${loading ? "pointer-events-none opacity-70" : ""}`}
    >
      <input
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        onChange={handleChange}
        className="absolute inset-0 cursor-pointer opacity-0"
        disabled={loading}
      />
      <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
        {loading ? (
          <>
            <span className="mb-2 inline-block h-10 w-10 animate-pulse rounded-full bg-accent/20" />
            <p className="text-sm font-medium text-text-primary">
              Analizando documento…
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              La IA extraerá la información del proyecto.
            </p>
          </>
        ) : (
          <>
            <span className="mb-2 text-3xl" aria-hidden>
              📄
            </span>
            <p className="text-sm font-medium text-text-primary">
              Arrastra un PDF o TXT aquí
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              o haz clic para seleccionar (máx. 10 MB)
            </p>
          </>
        )}
      </div>
      {error != null && error !== "" && (
        <p className="px-6 pb-4 text-center text-xs text-accent" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
