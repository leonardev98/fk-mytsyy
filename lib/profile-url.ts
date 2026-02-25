/**
 * Servicio para obtener la URL del perfil de un autor a partir de su id o username.
 * Conecta autores de publicaciones/comentarios con la ruta de perfil.
 */

export type AuthorProfile = {
  authorId?: string | null;
  authorUsername?: string | null;
};

/**
 * Devuelve la URL del perfil del autor, o null si no hay ni id ni username.
 * Prioridad: authorUsername (ruta /profile/:username) > authorId (ruta /profile/id/:id).
 */
export function getProfileUrl(author: AuthorProfile): string | null {
  if (author.authorUsername && String(author.authorUsername).trim()) {
    return `/profile/${encodeURIComponent(String(author.authorUsername).trim())}`;
  }
  if (author.authorId && String(author.authorId).trim()) {
    return `/profile/id/${encodeURIComponent(String(author.authorId).trim())}`;
  }
  return null;
}

/**
 * Indica si el autor tiene al menos id o username para poder enlazar a su perfil.
 */
export function hasProfileLink(author: AuthorProfile): boolean {
  return getProfileUrl(author) !== null;
}
