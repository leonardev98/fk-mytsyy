import type { ProjectCreateForm } from "./schema";
import type { ParseDocumentResponse } from "./schema";

const API_BASE = "/api";

/**
 * Mock: parse document (PDF/TXT) to extract project fields.
 * Frontend-only; replace with real POST when backend exists.
 */
export async function parseDocument(file: File): Promise<ParseDocumentResponse> {
  await new Promise((r) => setTimeout(r, 1500));

  const name = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") || "Mi proyecto";
  const description =
    "Proyecto generado desde documento. Revisa y completa los campos que prefieras.";

  return {
    name,
    description,
    problem: "Problema detectado en el documento (editable).",
    valueProposition: "Propuesta de valor extraída (editable).",
    targetAudience: "Público objetivo descrito en el documento.",
    businessModel: "Modelo de negocio (editable).",
    goal30Days: "Objetivo en 30 días (editable).",
  };
}

/**
 * Mock: create project.
 * Frontend-only; replace with real POST when backend exists.
 */
export async function createProject(payload: ProjectCreateForm): Promise<{ id: string }> {
  await new Promise((r) => setTimeout(r, 800));
  return { id: "mock-" + Date.now() };
}
