/**
 * Auth domain types (align with backend).
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
