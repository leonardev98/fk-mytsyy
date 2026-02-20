/**
 * Auth module — public API (UI only for now).
 */
export { AuthLayout } from "./ui/AuthLayout";
export {
  LoginForm,
  RegisterForm,
  LoginGateBanner,
  AuthGate,
  MarketplaceAuthBanner,
  AuthSessionProvider,
  useAuthSession,
  isAuthApiError,
} from "./ui";
export type { AuthServicePort, AuthApiError } from "./application";
export type { User, AuthResponse } from "./domain";
export { AuthApiAdapter } from "./adapters";
