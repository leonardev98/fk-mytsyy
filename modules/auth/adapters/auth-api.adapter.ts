import type { AuthServicePort, AuthApiError } from "../application/ports";
import type { User, AuthResponse } from "../domain";

const getBaseUrl = () =>
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8080";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof (data as { message?: string }).message === "string"
        ? (data as { message: string }).message
        : res.statusText || "Error";
    throw { statusCode: res.status, message } as AuthApiError;
  }
  return data as T;
}

export class AuthApiAdapter implements AuthServicePort {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${getBaseUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
  }

  async register(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<AuthResponse> {
    const res = await fetch(`${getBaseUrl()}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(res);
  }

  async getMe(accessToken: string): Promise<User> {
    const res = await fetch(`${getBaseUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return handleResponse<User>(res);
  }
}
