"use client";

import { useMemo, useCallback } from "react";
import { useAuthSession } from "@/modules/auth";
import {
  ProjectsMockAdapter,
  ProjectsApiAdapter,
} from "@/modules/projects";
import type { ProjectsCatalogPort } from "@/modules/projects";

/**
 * Returns a projects catalog: API adapter when authenticated (JWT),
 * mock adapter when not. Use in dashboard, list, detail and progress flows.
 */
export function useProjectsCatalog(): ProjectsCatalogPort {
  const { token, isAuthenticated } = useAuthSession();
  const getToken = useCallback(() => token, [token]);
  return useMemo(
    () =>
      isAuthenticated && token
        ? new ProjectsApiAdapter(getToken)
        : new ProjectsMockAdapter(),
    [isAuthenticated, token, getToken]
  );
}
