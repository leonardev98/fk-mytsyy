/**
 * API route: extrae texto de un PDF en el servidor.
 * Usa pdf-parse (Node) para evitar bundlear pdfjs-dist en el cliente.
 */

import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse/node";

const MAX_CHARS = 50_000;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf") {
      return NextResponse.json({ error: "Solo se aceptan PDFs" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Archivo demasiado grande. Máximo 15 MB." },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    const text = (result.text ?? "").trim().slice(0, MAX_CHARS);
    if (!text) {
      return NextResponse.json(
        { error: "No se pudo extraer texto del documento." },
        { status: 400 }
      );
    }
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[extract-document]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al procesar el PDF." },
      { status: 500 }
    );
  }
}
