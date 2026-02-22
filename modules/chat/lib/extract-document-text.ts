/**
 * Extrae texto de un archivo (PDF, TXT, DOC/DOCX) en el cliente.
 * Usado en el flujo "proyecto en documento" para enviar attachedContent al API.
 */

const MAX_CHARS = 50_000;

/** Tamaño máximo de archivo (15 MB) para evitar timeouts y uso excesivo de memoria. */
export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

export const ACCEPT_DOCUMENT =
  ".pdf,.txt,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function getAcceptedExtensions(): string[] {
  return ["pdf", "txt", "doc", "docx"];
}

export function isAcceptedFile(file: File): boolean {
  if (file.size > MAX_FILE_SIZE_BYTES) return false;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext) return false;
  const type = file.type?.toLowerCase() ?? "";
  return (
    getAcceptedExtensions().includes(ext) ||
    type === "application/pdf" ||
    type === "text/plain" ||
    type === "application/msword" ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}

/** Comprueba solo el tamaño (para mostrar mensaje de error específico). */
export function isWithinSizeLimit(file: File): boolean {
  return file.size <= MAX_FILE_SIZE_BYTES;
}

/**
 * Extrae texto del archivo. Máx. 50.000 caracteres.
 * @throws Error si el formato no es soportado o falla la extracción
 */
export async function extractDocumentText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  let text: string;

  if (ext === "txt" || file.type === "text/plain") {
    text = await readTextFile(file);
  } else if (ext === "pdf" || file.type === "application/pdf") {
    text = await extractPdfText(file);
  } else if (ext === "doc" || ext === "docx" || file.type?.includes("word")) {
    text = await extractWordText(file);
  } else {
    throw new Error("Formato no soportado. Usa PDF, TXT o Word (.doc/.docx).");
  }

  const trimmed = text.trim();
  if (!trimmed) throw new Error("No se pudo extraer texto del documento.");
  return trimmed.slice(0, MAX_CHARS);
}

function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Error al leer el archivo."));
    reader.readAsText(file, "UTF-8");
  });
}

async function extractPdfText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/extract-document", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Error al extraer texto del PDF.");
  }
  const { text } = (await res.json()) as { text: string };
  if (!text?.trim()) throw new Error("No se pudo extraer texto del documento.");
  return text.trim();
}

async function extractWordText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}
