"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const STORAGE_KEY = "mytsyy_active_project_id";

type ActiveProjectContextValue = {
  activeProjectId: string | null;
  setActiveProject: (id: string) => void;
  clearActiveProject: () => void;
  hasActiveProject: boolean;
};

const ActiveProjectContext = createContext<ActiveProjectContextValue | null>(
  null
);

export function ActiveProjectProvider({ children }: { children: React.ReactNode }) {
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setActiveProjectIdState(stored || null);
    } catch {
      setActiveProjectIdState(null);
    }
    setHydrated(true);
  }, []);

  const setActiveProject = useCallback((id: string) => {
    setActiveProjectIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {}
  }, []);

  const clearActiveProject = useCallback(() => {
    setActiveProjectIdState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const value: ActiveProjectContextValue = {
    activeProjectId,
    setActiveProject,
    clearActiveProject,
    hasActiveProject: !!activeProjectId && hydrated,
  };

  return (
    <ActiveProjectContext.Provider value={value}>
      {children}
    </ActiveProjectContext.Provider>
  );
}

export function useActiveProject() {
  const ctx = useContext(ActiveProjectContext);
  if (!ctx) {
    throw new Error("useActiveProject must be used within ActiveProjectProvider");
  }
  return ctx;
}
