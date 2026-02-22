"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "chat_session_id";

/**
 * Genera y persiste sessionId una vez por conversación.
 * Para "Nueva conversación": resetSession genera uno nuevo y lo guarda en localStorage.
 */
export function useChatSessionId() {
  const [sessionId, setSessionId] = useState<string>(() =>
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) ?? crypto.randomUUID() : ""
  );

  useEffect(() => {
    if (typeof window === "undefined" || !sessionId) return;
    localStorage.setItem(STORAGE_KEY, sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    const id = stored ?? crypto.randomUUID();
    if (!stored) localStorage.setItem(STORAGE_KEY, id);
    setSessionId(id);
  }, [sessionId]);

  const resetSession = useCallback(() => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
    return newId;
  }, []);

  return { sessionId, resetSession };
}
