"use client";

import { CreatePostButton } from "@/modules/feed-post";
import type { CreatePostPayload } from "@/modules/feed-post";
import type { FeedPost } from "./FeedCard";
import type { FeedComment } from "./FeedComments";
import { FeedCard } from "./FeedCard";

type FeedColumnProps = {
  posts: FeedPost[];
  isAuthenticated: boolean;
  onPostCreated?: (payload: CreatePostPayload) => void;
  onReact?: (postId: string) => Promise<{ reactionCount: number; hasReacted: boolean }>;
  commentsByPostId?: Record<string, FeedComment[]>;
  onAddComment?: (postId: string, text: string, parentId?: string) => void;
  onOpenComments?: (postId: string) => void;
  loadingCommentsForPostId?: string | null;
  currentUser?: { name?: string; email?: string; id: string } | null;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
};

export function FeedColumn({
  posts,
  isAuthenticated,
  onPostCreated,
  onReact,
  commentsByPostId = {},
  onAddComment,
  onOpenComments,
  loadingCommentsForPostId = null,
  currentUser = null,
  isLoading,
  hasMore,
  onLoadMore,
}: FeedColumnProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
          Feed de ejecución pública
        </h2>
        {isAuthenticated && onPostCreated && (
          <CreatePostButton onPublish={onPostCreated} />
        )}
      </div>

      <div className="space-y-3">
        {isLoading && posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-secondary">
            Cargando feed…
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-secondary">
            Aún no hay publicaciones. ¡Sé el primero en compartir tu avance!
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                onReact={onReact}
                comments={commentsByPostId[post.id] ?? []}
                onAddComment={onAddComment}
                onOpenComments={onOpenComments}
                loadingComments={loadingCommentsForPostId === post.id}
                currentUser={currentUser}
                isAuthenticated={isAuthenticated}
              />
            ))}
            {hasMore && onLoadMore && (
              <div className="flex justify-center py-2">
                <button
                  type="button"
                  onClick={onLoadMore}
                  disabled={isLoading}
                  className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-primary/10 disabled:opacity-50"
                >
                  {isLoading ? "Cargando…" : "Cargar más"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
