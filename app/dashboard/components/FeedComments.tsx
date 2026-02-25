"use client";

import Link from "next/link";
import { useState } from "react";
import { getProfileUrl } from "@/lib/profile-url";
import { formatFeedTime } from "@/modules/feed-post/lib/format-feed-time";

export type FeedComment = {
  id: string;
  postId: string;
  parentId?: string | null;
  authorName: string;
  authorId?: string | null;
  authorUsername?: string | null;
  authorAvatar?: string | null;
  text: string;
  createdAt: string;
};

type FeedCommentsProps = {
  postId: string;
  comments: FeedComment[];
  onAddComment: (postId: string, text: string, parentId?: string) => void;
  currentUser: { name?: string; email?: string; id: string } | null;
  isAuthenticated: boolean;
};

function CommentLine({
  postId,
  comment,
  onSubmitReply,
  currentUser,
  isAuthenticated,
  depth = 0,
}: {
  postId: string;
  comment: FeedComment;
  onSubmitReply: (parentId: string, text: string) => void;
  currentUser: { name?: string; email?: string; id: string } | null;
  isAuthenticated: boolean;
  depth?: number;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const displayTime =
    /^\d{4}-\d{2}/.test(comment.createdAt)
      ? formatFeedTime(comment.createdAt)
      : comment.createdAt;
  const initials = comment.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault();
    const t = replyText.trim();
    if (!t) return;
    onSubmitReply(comment.id, t);
    setReplyText("");
    setShowReplyInput(false);
  }

  const authorProfileUrl = getProfileUrl({
    authorId: comment.authorId,
    authorUsername: comment.authorUsername,
  });

  return (
    <div className={depth > 0 ? "ml-6 mt-2 border-l-2 border-border pl-3" : "mt-3"}>
      <div className="flex gap-2">
        {authorProfileUrl ? (
          <Link
            href={authorProfileUrl}
            className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-primary/15 text-xs font-medium text-primary"
            aria-label={comment.authorName}
          >
            {comment.authorAvatar ? (
              <img
                src={comment.authorAvatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                {initials}
              </span>
            )}
          </Link>
        ) : (
          <div
            className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-primary/15 text-xs font-medium text-primary"
            aria-hidden
          >
            {comment.authorAvatar ? (
              <img
                src={comment.authorAvatar}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                {initials}
              </span>
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-1.5">
            {authorProfileUrl ? (
              <Link
                href={authorProfileUrl}
                className="font-semibold text-sm text-text-primary hover:text-accent hover:underline"
                title="Ver perfil"
              >
                {comment.authorName}
              </Link>
            ) : (
              <span className="font-semibold text-sm text-text-primary">
                {comment.authorName}
              </span>
            )}
            <span className="text-xs text-text-secondary">{displayTime}</span>
          </div>
          <p className="mt-0.5 text-sm text-text-secondary">{comment.text}</p>
          {isAuthenticated && currentUser && (
            <button
              type="button"
              onClick={() => setShowReplyInput((v) => !v)}
              className="mt-1 text-sm font-medium text-accent hover:underline"
            >
              Responder
            </button>
          )}
          {showReplyInput && (
            <form onSubmit={handleSubmitReply} className="mt-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe una respuesta..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
              <div className="mt-1.5 flex gap-2">
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-on-primary hover:bg-primary-hover disabled:opacity-50"
                >
                  Responder
                </button>
                <button
                  type="button"
                  onClick={() => setShowReplyInput(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-background"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function FeedComments({
  postId,
  comments,
  onAddComment,
  currentUser,
  isAuthenticated,
}: FeedCommentsProps) {
  const [commentText, setCommentText] = useState("");

  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parentId === parentId);

  function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    const t = commentText.trim();
    if (!t) return;
    onAddComment(postId, t);
    setCommentText("");
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Comentarios ({comments.length})
      </h3>

      <div className="mt-3 space-y-0">
        {rootComments.map((comment) => (
          <div key={comment.id}>
            <CommentLine
              postId={postId}
              comment={comment}
              onSubmitReply={(parentId, text) => onAddComment(postId, text, parentId)}
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
            />
            {getReplies(comment.id).map((reply) => (
              <CommentLine
                key={reply.id}
                postId={postId}
                comment={reply}
                onSubmitReply={(parentId, text) => onAddComment(postId, text, parentId)}
                currentUser={currentUser}
                isAuthenticated={isAuthenticated}
                depth={1}
              />
            ))}
          </div>
        ))}
      </div>

      {isAuthenticated && currentUser && (
        <form onSubmit={handleSubmitComment} className="mt-4">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escribe un comentario..."
            className="w-full overflow-hidden rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="mt-2 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comentar
          </button>
        </form>
      )}
    </div>
  );
}
