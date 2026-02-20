import type { User, AuthResponse } from "../domain";

export interface AuthApiError {
  statusCode: number;
  message: string;
}

/**
 * Port for auth API. Adapter implements with fetch to backend.
 */
export interface AuthServicePort {
  login(email: string, password: string): Promise<AuthResponse>;
  register(data: { email: string; password: string; name?: string }): Promise<AuthResponse>;
  getMe(accessToken: string): Promise<User>;
}
