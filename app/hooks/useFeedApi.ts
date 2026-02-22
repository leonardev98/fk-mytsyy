"use client";

import { useMemo, useCallback } from "react";
import { useAuthSession } from "@/modules/auth";
import { FeedApiAdapter } from "@/modules/feed-post";
import type { FeedApiPort } from "@/modules/feed-post";

/**
 * Returns the feed API when authenticated (JWT).
 * Throws if used while not authenticated (call only after auth check in dashboard).
 */
export function useFeedApi(): FeedApiPort | null {
  const { token, isAuthenticated } = useAuthSession();
  const getToken = useCallback(() => token, [token]);
  return useMemo(
    () =>
      isAuthenticated && token ? new FeedApiAdapter(getToken) : null,
    [isAuthenticated, token, getToken]
  );
}
