"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/modules/auth";
import { useActiveProject } from "../context/ActiveProjectContext";
import { useProjectsCatalog } from "../hooks/useProjectsCatalog";
import { useFeedApi } from "../hooks/useFeedApi";
import {
  DashboardLayout,
  DashboardLeftSidebar,
  FeedColumn,
  ReputationColumn,
  type FeedPost,
  type RankedBuilder,
  type TopStreak,
  type TrendingProject,
} from "../dashboard/components";
import type { FeedComment } from "../dashboard/components";
import type { CreatePostPayload } from "@/modules/feed-post";

const MOCK_STREAK_DAYS = 5;
const MOCK_MONTHLY_GOAL = "Validar con 3 clientes potenciales";
const MOCK_AVERAGE_PROGRESS = 42;

const PAGE_SIZE = 20;

const MOCK_WEEKLY_RANKING: RankedBuilder[] = [
  { rank: 1, username: "mariag", displayName: "María García", streakDays: 12, completedProjects: 2 },
  { rank: 2, username: "carlosr", displayName: "Carlos Ruiz", streakDays: 18, completedProjects: 1 },
  { rank: 3, username: "analopez", displayName: "Ana López", streakDays: 21, completedProjects: 3 },
  { rank: 4, username: "pablom", displayName: "Pablo Martín", streakDays: 8, completedProjects: 0 },
  { rank: 5, username: "laurav", displayName: "Laura Vega", streakDays: 5, completedProjects: 1 },
];

const MOCK_TOP_STREAKS: TopStreak[] = [
  { username: "analopez", displayName: "Ana López", streakDays: 21 },
  { username: "carlosr", displayName: "Carlos Ruiz", streakDays: 18 },
  { username: "mariag", displayName: "María García", streakDays: 12 },
];

const MOCK_TRENDING_PROJECTS: TrendingProject[] = [
  { id: "1", title: "App de reservas para peluquerías" },
  { id: "2", title: "CRM para pymes" },
  { id: "3", title: "Marketplace de cursos locales" },
];

const MOCK_IDEA_OF_THE_DAY =
  "Un marketplace que conecte artesanos locales con tiendas de barrio, con pedidos mínimos y reparto semanal.";

export function DashboardScene() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthSession();
  const { activeProjectId } = useActiveProject();
  const catalog = useProjectsCatalog();
  const feedApi = useFeedApi();
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedPage, setFeedPage] = useState(1);
  const [feedTotal, setFeedTotal] = useState(0);
  const [postError, setPostError] = useState<string | null>(null);
  const [commentsByPostId, setCommentsByPostId] = useState<Record<string, FeedComment[]>>({});
  const [loadingCommentsForPostId, setLoadingCommentsForPostId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/crear");
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      setActiveProjectsCount(0);
      return;
    }
    catalog
      .listProjects()
      .then((list) => setActiveProjectsCount(list.length))
      .catch(() => setActiveProjectsCount(0));
  }, [isAuthenticated, catalog]);

  const loadFeedPage = useCallback(
    (page: number, append: boolean) => {
      if (!feedApi) return;
      setFeedLoading(true);
      feedApi
        .listPosts({ page, limit: PAGE_SIZE })
        .then((res) => {
          const mapped: FeedPost[] = res.posts.map((p) => {
            const raw = p as {
              authorId?: string | null;
              author_id?: string | null;
              authorUsername?: string | null;
              author_username?: string | null;
            };
            const authorId = raw.authorId ?? raw.author_id ?? undefined;
            const authorUsername = raw.authorUsername ?? raw.author_username ?? undefined;
            return {
            id: p.id,
            authorName: p.authorName,
            authorId: authorId ?? undefined,
            authorUsername: authorUsername ?? undefined,
            authorAvatar: p.authorAvatar ?? null,
            time: p.time,
            createdAt: p.createdAt,
            text: p.text,
            currentDay: p.currentDay,
            totalDays: p.totalDays,
            progressPercent: p.progressPercent,
            evidenceImageUrl: p.evidenceImageUrl ?? null,
            evidenceLink: p.evidenceLink ?? null,
            reactionCount: p.reactionCount,
            hasReacted: p.hasReacted,
          };
          });
          setPosts((prev) => (append ? [...prev, ...mapped] : mapped));
          setFeedTotal(res.total);
        })
        .catch(() => {
          if (!append) setPosts([]);
        })
        .finally(() => setFeedLoading(false));
    },
    [feedApi]
  );

  useEffect(() => {
    if (!isAuthenticated || !feedApi) {
      setFeedLoading(false);
      return;
    }
    loadFeedPage(1, false);
    setFeedPage(1);
  }, [isAuthenticated, feedApi, loadFeedPage]);

  const handlePostCreated = useCallback(
    (payload: CreatePostPayload) => {
      if (!feedApi) return;
      setPostError(null);
      feedApi
        .createPost(payload)
        .then((p) => {
          const newPost: FeedPost = {
            id: p.id,
            authorName: p.authorName,
            authorId: (p as { authorId?: string | null }).authorId ?? undefined,
            authorUsername: p.authorUsername ?? undefined,
            authorAvatar: p.authorAvatar ?? null,
            time: p.time,
            createdAt: p.createdAt,
            text: p.text,
            currentDay: p.currentDay,
            totalDays: p.totalDays,
            progressPercent: p.progressPercent,
            evidenceImageUrl: p.evidenceImageUrl ?? null,
            evidenceLink: p.evidenceLink ?? null,
            reactionCount: p.reactionCount,
            hasReacted: false,
          };
          setPosts((prev) => [newPost, ...prev]);
          setFeedTotal((t) => t + 1);
        })
        .catch((e) => setPostError(e instanceof Error ? e.message : "Error al publicar"));
    },
    [feedApi]
  );

  const handleLoadMore = useCallback(() => {
    const next = feedPage + 1;
    setFeedPage(next);
    loadFeedPage(next, true);
  }, [feedPage, loadFeedPage]);

  const handleReact = useCallback(
    (postId: string) => {
      if (!feedApi) return Promise.reject(new Error("Sin sesión"));
      return feedApi.toggleReaction(postId).then((res) => {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, reactionCount: res.reactionCount, hasReacted: res.hasReacted }
              : p
          )
        );
        return res;
      });
    },
    [feedApi]
  );

  const mapApiCommentToComment = useCallback((c: {
    id: string;
    postId: string;
    parentId?: string | null;
    authorName: string;
    authorId?: string | null;
    authorUsername?: string | null;
    authorAvatar?: string | null;
    text: string;
    createdAt: string;
  }): FeedComment => ({
    id: c.id,
    postId: c.postId,
    parentId: c.parentId ?? null,
    authorName: c.authorName,
    authorId: c.authorId ?? null,
    authorUsername: c.authorUsername ?? null,
    authorAvatar: c.authorAvatar ?? null,
    text: c.text,
    createdAt: c.createdAt,
  }), []);

  const handleOpenComments = useCallback(
    (postId: string) => {
      if (!feedApi) return;
      setLoadingCommentsForPostId(postId);
      feedApi
        .listComments(postId, { page: 1, limit: 50 })
        .then((res) => {
          const mapped = res.comments.map(mapApiCommentToComment);
          setCommentsByPostId((prev) => ({ ...prev, [postId]: mapped }));
        })
        .catch(() => {
          setCommentsByPostId((prev) => ({ ...prev, [postId]: prev[postId] ?? [] }));
        })
        .finally(() => setLoadingCommentsForPostId(null));
    },
    [feedApi, mapApiCommentToComment]
  );

  const handleAddComment = useCallback(
    (postId: string, text: string, parentId?: string) => {
      if (!feedApi) return;
      feedApi
        .createComment(postId, text, parentId ?? null)
        .then((c) => {
          const newComment = mapApiCommentToComment(c);
          setCommentsByPostId((prev) => ({
            ...prev,
            [postId]: [...(prev[postId] ?? []), newComment],
          }));
        })
        .catch((e) => setPostError(e instanceof Error ? e.message : "Error al publicar el comentario"));
    },
    [feedApi, mapApiCommentToComment]
  );

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-text-secondary">Cargando…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-text-secondary">Redirigiendo…</span>
      </div>
    );
  }

  const continueProjectHref =
    activeProjectId && isAuthenticated
      ? `/proyectos/${activeProjectId}`
      : null;

  return (
    <>
      <DashboardLayout
        left={
          <DashboardLeftSidebar
            streakDays={MOCK_STREAK_DAYS}
            activeProjectsCount={activeProjectsCount}
            monthlyGoal={MOCK_MONTHLY_GOAL}
            averageProgressPercent={MOCK_AVERAGE_PROGRESS}
            continueProjectHref={continueProjectHref}
            isAuthenticated={!!isAuthenticated}
          />
        }
        center={
          <>
            {postError && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
                {postError}
              </div>
            )}
            <FeedColumn
              posts={posts}
              isAuthenticated={!!isAuthenticated}
              onPostCreated={feedApi ? handlePostCreated : undefined}
              onReact={feedApi ? handleReact : undefined}
              commentsByPostId={commentsByPostId}
              onAddComment={feedApi ? handleAddComment : undefined}
              onOpenComments={feedApi ? handleOpenComments : undefined}
              loadingCommentsForPostId={loadingCommentsForPostId}
              currentUser={user ?? null}
              isLoading={feedLoading && posts.length === 0}
              hasMore={posts.length < feedTotal}
              onLoadMore={posts.length < feedTotal ? handleLoadMore : undefined}
            />
          </>
        }
        right={
          <ReputationColumn
            weeklyRanking={MOCK_WEEKLY_RANKING}
            topStreaks={MOCK_TOP_STREAKS}
            trendingProjects={MOCK_TRENDING_PROJECTS}
            ideaOfTheDay={MOCK_IDEA_OF_THE_DAY}
          />
        }
      />
    </>
  );
}
