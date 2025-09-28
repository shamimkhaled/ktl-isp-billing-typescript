
import type { User } from './user.types';

// Login Credential Interface
export interface LoginCredentials {
  login_id: string;
  password: string;
  remember_me?: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  token_type: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
  remember_me: boolean;
  expires_at: string;
}

export interface RefreshTokenResponse {
  message: string;
  tokens: AuthTokens;
  expires_at: string;
}

export interface VerifyTokenResponse {
  message: string;
  user: User;
  expires_at: string;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  expiresAt: string | null;
  rememberMe: boolean;
}


