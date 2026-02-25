"use client";

import Link from "next/link";
import { useState } from "react";
import { getProfileUrl } from "@/lib/profile-url";
import { formatFeedTime } from "@/modules/feed-post/lib/format-feed-time";
import { FeedComments, type FeedComment } from "./FeedComments";

const LikeIcon = ({ filled }: { filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 22V11M2 13v9h4a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H2zM14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
  </svg>
);

const CommentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" x2="12" y1="2" y2="15" />
  </svg>
);

export type FeedPost = {
  id: string;
  authorName: string;
  authorId?: string | null;
  authorUsername?: string | null;
  authorAvatar?: string | null;
  time: string;
  createdAt?: string;
  text: string;
  currentDay: number;
  totalDays?: number;
  progressPercent?: number;
  evidenceImageUrl?: string | null;
  evidenceLink?: string | null;
  reactionCount: number;
  hasReacted?: boolean;
};

type FeedCardProps = {
  post: FeedPost;
  onReact?: (postId: string) => Promise<{ reactionCount: number; hasReacted: boolean }>;
  comments?: FeedComment[];
  onAddComment?: (postId: string, text: string, parentId?: string) => void;
  onOpenComments?: (postId: string) => void;
  loadingComments?: boolean;
  currentUser?: { name?: string; email?: string; id: string } | null;
  isAuthenticated?: boolean;
};

export function FeedCard({
  post,
  onReact,
  comments = [],
  onAddComment,
  onOpenComments,
  loadingComments = false,
  currentUser = null,
  isAuthenticated = false,
}: FeedCardProps) {
  const [reactionCount, setReactionCount] = useState(post.reactionCount);
  const [reacted, setReacted] = useState(!!post.hasReacted);
  const [reacting, setReacting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  function openComments() {
    onOpenComments?.(post.id);
    setShowComments(true);
  }

  async function handleReact() {
    if (!onReact) {
      setReacted((prev) => !prev);
      setReactionCount((c) => (reacted ? c - 1 : c + 1));
      return;
    }
    if (reacting) return;
    setReacting(true);
    try {
      const res = await onReact(post.id);
      setReactionCount(res.reactionCount);
      setReacted(res.hasReacted);
    } catch {
      // Error ya manejado por el adaptador; no actualizamos estado (se queda como estaba)
    } finally {
      setReacting(false);
    }
  }

  const displayTime =
    post.time && /^\d{4}-\d{2}-\d{2}/.test(post.time)
      ? formatFeedTime(post.time)
      : post.time || (post.createdAt ? formatFeedTime(post.createdAt) : "");

  const initials = post.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const totalDays = post.totalDays ?? 30;
  const progress = Math.min(
    100,
    Math.max(0, post.progressPercent ?? (post.currentDay / totalDays) * 100)
  );

  const authorProfileUrl = getProfileUrl({
    authorId: post.authorId,
    authorUsername: post.authorUsername,
  });

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms]">
      <div className="flex gap-3">
        {authorProfileUrl ? (
          <Link
            href={authorProfileUrl}
            className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/15 text-sm font-medium text-primary ring-0 transition hover:opacity-90"
            aria-label={`Ver perfil de ${post.authorName}`}
          >
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                {initials}
              </span>
            )}
          </Link>
        ) : (
          <div
            className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/15 text-sm font-medium text-primary"
            aria-hidden
          >
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center">{initials}</span>
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            {authorProfileUrl ? (
              <Link
                href={authorProfileUrl}
                className="font-semibold text-text-primary underline-offset-2 transition hover:text-accent hover:underline"
                title="Ver perfil"
              >
                {post.authorName}
              </Link>
            ) : (
              <span className="font-semibold text-text-primary">
                {post.authorName}
              </span>
            )}
            <span className="text-xs text-text-secondary">{displayTime}</span>
          </div>
          <span className="mt-0.5 inline-block rounded bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
            Día {post.currentDay}/{totalDays}
          </span>
          <p className="mt-2 text-sm text-text-secondary">{post.text}</p>

          {(post.progressPercent != null || post.currentDay > 0) && (
            <div className="mt-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {(post.evidenceImageUrl ?? post.evidenceLink) && (
            <div className="mt-3">
              {post.evidenceImageUrl && (
                <img
                  src={post.evidenceImageUrl}
                  alt=""
                  className="max-h-40 w-full rounded-xl object-cover"
                />
              )}
              {post.evidenceLink && (
                <a
                  href={post.evidenceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  Ver evidencia →
                </a>
              )}
            </div>
          )}

          {/* Barra de acciones estilo red social: Me gusta, Comentar, Compartir */}
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
            <div className="flex items-center gap-1 text-text-secondary">
              <button
                type="button"
                onClick={handleReact}
                disabled={reacting}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-background hover:text-accent disabled:opacity-70"
                aria-pressed={reacted}
                title={reacted ? "Quitar me gusta" : "Me gusta"}
              >
                <span className={reacted ? "text-accent" : "text-text-secondary"}>
                  <LikeIcon filled={reacted} />
                </span>
                <span>{reactionCount}</span>
                <span className="hidden sm:inline">Me gusta</span>
              </button>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={openComments}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-background hover:text-accent"
                title="Comentar"
              >
                <CommentIcon />
                <span>Comentar</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-background hover:text-accent"
                title="Compartir"
              >
                <ShareIcon />
                <span>Compartir</span>
              </button>
            </div>
          </div>

          {onAddComment && showComments && (
            <>
              {loadingComments ? (
                <div className="mt-4 border-t border-border pt-4 text-center text-sm text-text-secondary">
                  Cargando comentarios…
                </div>
              ) : (
                <FeedComments
                  postId={post.id}
                  comments={comments}
                  onAddComment={onAddComment}
                  currentUser={currentUser}
                  isAuthenticated={isAuthenticated}
                />
              )}
            </>
          )}
          {onAddComment && !showComments && comments.length > 0 && (
            <button
              type="button"
              onClick={openComments}
              className="mt-3 w-full rounded-xl border border-border bg-background/50 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-background hover:text-accent"
            >
              Ver {comments.length} {comments.length === 1 ? "comentario" : "comentarios"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
