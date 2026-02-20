"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import type { User, AuthResponse } from "../domain";
import type { AuthServicePort, AuthApiError } from "../application/ports";
import { AuthApiAdapter } from "../adapters";

const STORAGE_TOKEN = "mytsyy_token";
const STORAGE_USER = "mytsyy_user";

type AuthSession = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name?: string }) => Promise<void>;
  logout: () => void;
};

const AuthSessionContext = createContext<AuthSession | null>(null);

function loadStored(): { token: string | null; user: User | null } {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const token = localStorage.getItem(STORAGE_TOKEN);
    const userStr = localStorage.getItem(STORAGE_USER);
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

function saveStored(token: string, user: User) {
  localStorage.setItem(STORAGE_TOKEN, token);
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

function clearStored() {
  localStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_USER);
}

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const api = useMemo(() => new AuthApiAdapter(), []);

  useEffect(() => {
    const { token: t, user: u } = loadStored();
    if (t && u) {
      setToken(t);
      setUser(u);
      api
        .getMe(t)
        .then((me) => {
          setUser(me);
          localStorage.setItem(STORAGE_USER, JSON.stringify(me));
        })
        .catch(() => {
          clearStored();
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [api]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login(email, password);
      setToken(res.access_token);
      setUser(res.user);
      saveStored(res.access_token, res.user);
    },
    [api]
  );

  const register = useCallback(
    async (data: { email: string; password: string; name?: string }) => {
      const res = await api.register(data);
      setToken(res.access_token);
      setUser(res.user);
      saveStored(res.access_token, res.user);
    },
    [api]
  );

  const logout = useCallback(() => {
    clearStored();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthSession>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout]
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSession {
  const ctx = useContext(AuthSessionContext);
  if (!ctx) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return ctx;
}

/** Helper to check if an error is AuthApiError (for statusCode/message). */
export function isAuthApiError(e: unknown): e is AuthApiError {
  return (
    typeof e === "object" &&
    e !== null &&
    "statusCode" in e &&
    "message" in (e as AuthApiError)
  );
}
