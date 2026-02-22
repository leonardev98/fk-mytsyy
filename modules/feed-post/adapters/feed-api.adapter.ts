/**
 * Feed API adapter: calls backend /feed/posts with JWT.
 * Base URL: NEXT_PUBLIC_API_URL (same as projects).
 */

import type { FeedApiPort, CreatePostInput, FeedListResponse, FeedPostFromApi, ReactionResponse } from "../application/ports";

const getBaseUrl = () =>
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8080";

export class FeedApiAdapter implements FeedApiPort {
  constructor(private getToken: () => string | null) {}

  private async request<T>(
    path: string,
    options: RequestInit & { method?: string } = {}
  ): Promise<T> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No hay sesión. Inicia sesión para publicar en el feed.");
    }
    const base = getBaseUrl().replace(/\/$/, "");
    const url = path.startsWith("http") ? path : `${base}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const body = data as { message?: string; error?: string };
      const msg =
        body?.message ||
        body?.error ||
        (res.status === 401 ? "Sesión expirada. Vuelve a iniciar sesión." : null) ||
        (res.status >= 500 ? "Error del servidor. Intenta de nuevo en un momento." : null) ||
        res.statusText ||
        "Error de conexión";
      throw new Error(msg);
    }
    return data as T;
  }

  async listPosts(params: { page?: number; limit?: number }): Promise<FeedListResponse> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    return this.request<FeedListResponse>(`/feed/posts?${query}`, { method: "GET" });
  }

  async createPost(input: CreatePostInput): Promise<FeedPostFromApi> {
    const body = {
      text: input.text.slice(0, 2000),
      audience: input.audience ?? "public",
      currentDay: input.currentDay ?? 0,
      totalDays: input.totalDays ?? 30,
      progressPercent: input.progressPercent ?? 0,
    };
    return this.request<FeedPostFromApi>("/feed/posts", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async toggleReaction(postId: string): Promise<ReactionResponse> {
    return this.request<ReactionResponse>(`/feed/posts/${postId}/reactions`, {
      method: "POST",
    });
  }
}
