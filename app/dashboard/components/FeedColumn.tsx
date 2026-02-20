"use client";

import Link from "next/link";
import type { FeedPost } from "./FeedCard";
import { FeedCard } from "./FeedCard";

type FeedColumnProps = {
  posts: FeedPost[];
  isAuthenticated: boolean;
};

export function FeedColumn({ posts, isAuthenticated }: FeedColumnProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          Feed de ejecución pública
        </h2>
        {isAuthenticated && (
          <Link
            href="/dashboard?share=1"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-primary/10"
          >
            Publicar avance
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-secondary">
            Aún no hay publicaciones. ¡Sé el primero en compartir tu avance!
          </div>
        ) : (
          posts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
