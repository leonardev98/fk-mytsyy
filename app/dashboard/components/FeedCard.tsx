"use client";

import Link from "next/link";
import { useState } from "react";
import { formatFeedTime } from "@/modules/feed-post/lib/format-feed-time";

export type FeedPost = {
  id: string;
  authorName: string;
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
};

export function FeedCard({ post, onReact }: FeedCardProps) {
  const [reactionCount, setReactionCount] = useState(post.reactionCount);
  const [reacted, setReacted] = useState(!!post.hasReacted);
  const [reacting, setReacting] = useState(false);

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

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 transition-colors duration-[250ms]">
      <div className="flex gap-3">
        <Link
          href={post.authorUsername ? `/profile/${post.authorUsername}` : "#"}
          className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/15 text-sm font-medium text-primary"
          aria-label={post.authorName}
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
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            {post.authorUsername ? (
              <Link
                href={`/profile/${post.authorUsername}`}
                className="font-medium text-text-primary transition hover:text-accent hover:underline"
              >
                {post.authorName}
              </Link>
            ) : (
              <span className="font-medium text-text-primary">
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

          <div className="mt-3">
            <button
              type="button"
              onClick={handleReact}
              disabled={reacting}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-text-secondary transition hover:bg-background hover:text-accent disabled:opacity-70"
              aria-pressed={reacted}
            >
              <span aria-hidden>{reacted ? "❤️" : "🤍"}</span>
              <span>
                {reactionCount} {reactionCount === 1 ? "reacción" : "reacciones"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
