/**
 * Port for feed API: list posts, create post, toggle reaction.
 * Implemented by FeedApiAdapter (backend); can be mocked for tests.
 */

export type CreatePostInput = {
  text: string;
  audience?: "public" | "builders" | "only_me";
  currentDay?: number;
  totalDays?: number;
  progressPercent?: number;
};

export type FeedPostFromApi = {
  id: string;
  authorName: string;
  authorUsername?: string | null;
  authorAvatar?: string | null;
  time: string;
  createdAt?: string;
  text: string;
  currentDay: number;
  totalDays: number;
  progressPercent: number;
  evidenceImageUrl?: string | null;
  evidenceLink?: string | null;
  reactionCount: number;
  hasReacted?: boolean;
};

export type FeedListResponse = {
  posts: FeedPostFromApi[];
  page: number;
  limit: number;
  total: number;
};

export type ReactionResponse = {
  reactionCount: number;
  hasReacted: boolean;
};

export type FeedApiPort = {
  listPosts(params: { page?: number; limit?: number }): Promise<FeedListResponse>;
  createPost(input: CreatePostInput): Promise<FeedPostFromApi>;
  toggleReaction(postId: string): Promise<ReactionResponse>;
};
