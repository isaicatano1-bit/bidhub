/**
 * BIDHUB - Feature: Auth - Tipos de dominio
 */

export type UserRole = "USER" | "ADMIN";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: string;
}

export interface AuthSession {
  user: AuthenticatedUser;
  tokens: AuthTokens;
}
