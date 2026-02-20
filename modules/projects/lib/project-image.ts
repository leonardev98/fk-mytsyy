const KEY_PREFIX = "mytsyy_project_image";
const MAX_DATA_URL_LENGTH = 4 * 1024 * 1024; // ~4MB para dejar margen (límite típico 5MB por origen)
const MAX_WIDTH = 800;
const JPEG_QUALITY = 0.78;

export function getProjectImageUrl(projectId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(`${KEY_PREFIX}:${projectId}`);
  } catch {
    return null;
  }
}

export type SetProjectImageResult =
  | { ok: true }
  | { ok: false; reason: "quota" | "error" };

/**
 * Guarda la URL de la imagen del proyecto en localStorage.
 * Devuelve el resultado para que la UI pueda mostrar mensaje si falla (p. ej. cuota llena).
 */
export function setProjectImageUrl(
  projectId: string,
  url: string
): SetProjectImageResult {
  try {
    if (url.length > MAX_DATA_URL_LENGTH) {
      return { ok: false, reason: "quota" };
    }
    localStorage.setItem(`${KEY_PREFIX}:${projectId}`, url);
    return { ok: true };
  } catch (e) {
    const isQuota =
      e instanceof DOMException &&
      (e.name === "QuotaExceededError" || e.code === 22);
    return { ok: false, reason: isQuota ? "quota" : "error" };
  }
}

/**
 * Comprime una imagen (data URL o blob) para reducir tamaño antes de guardar en localStorage.
 * Redimensiona a ancho máximo MAX_WIDTH y convierte a JPEG con calidad JPEG_QUALITY.
 */
export function compressImageForStorage(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = (height * MAX_WIDTH) / width;
        width = MAX_WIDTH;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const compressed = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        resolve(compressed);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    img.src = dataUrl;
  });
}
