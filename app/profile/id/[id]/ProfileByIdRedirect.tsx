"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const getBaseUrl = () =>
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "http://localhost:8080";

type UserProfileResponse = { username?: string; name?: string };

/**
 * Intenta resolver el usuario por id (GET /users/:id) y redirige a /profile/:username.
 * Si el backend no expone el endpoint o falla, muestra un mensaje.
 */
export function ProfileByIdRedirect({ id }: { id: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "found" | "not-found">("loading");

  useEffect(() => {
    if (!id) {
      setStatus("not-found");
      return;
    }
    const token =
      typeof window !== "undefined" && typeof localStorage !== "undefined"
        ? localStorage.getItem("mytsyy_token") ?? null
        : null;
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${getBaseUrl()}/users/${encodeURIComponent(id)}`, { headers })
      .then((res) => {
        if (!res.ok) {
          setStatus("not-found");
          return;
        }
        return res.json() as Promise<UserProfileResponse>;
      })
      .then((data) => {
        if (data?.username && typeof data.username === "string") {
          setStatus("found");
          router.replace(`/profile/${encodeURIComponent(data.username)}`);
        } else {
          setStatus("not-found");
        }
      })
      .catch(() => setStatus("not-found"));
  }, [id, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-text-secondary">Cargando perfil…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-text-secondary">No se pudo cargar este perfil.</p>
      <Link
        href="/dashboard"
        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
