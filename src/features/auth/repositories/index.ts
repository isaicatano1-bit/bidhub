/**
 * BIDHUB — Feature: auth
 * Repositorio de autenticación — Encapsula todas las operaciones de persistencia
 * relacionadas con usuarios y refresh tokens.
 *
 * ESTADO: Contrato definido. Implementación pendiente (Fase 3 — Modelos Prisma).
 */

import type { RegisterDto } from "@/features/auth/schemas";
import type { AuthenticatedUser, UserRole } from "@/features/auth/types";

// Tipos de retorno del repositorio (sin exponer la capa Prisma a los servicios)
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenRecord {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

/**
 * Contrato del repositorio de autenticación.
 * La implementación concreta usará Prisma Client.
 */
export interface AuthRepository {
  /** Busca un usuario por su correo electrónico. */
  findUserByEmail(email: string): Promise<UserRecord | null>;

  /** Busca un usuario por su ID. */
  findUserById(id: string): Promise<UserRecord | null>;

  /**
   * Crea un nuevo usuario con la contraseña ya hasheada.
   * Lanza EmailAlreadyExistsError si el correo está duplicado.
   */
  createUser(data: RegisterDto & { passwordHash: string; role?: UserRole }): Promise<UserRecord>;

  /**
   * Almacena un refresh token hasheado en la base de datos.
   * Invalida (upsert) el token anterior del mismo usuario si se desea sesión única.
   */
  saveRefreshToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<RefreshTokenRecord>;

  /**
   * Busca un refresh token por su hash.
   * Verifica que no esté revocado y que no haya expirado.
   */
  findValidRefreshToken(tokenHash: string): Promise<RefreshTokenRecord | null>;

  /** Revoca todos los refresh tokens activos de un usuario (logout). */
  revokeAllRefreshTokens(userId: string): Promise<void>;

  /** Revoca un refresh token específico por su hash. */
  revokeRefreshToken(tokenHash: string): Promise<void>;
}

/**
 * Convierte un UserRecord en un AuthenticatedUser (DTO público sin campos sensibles).
 */
export function toAuthenticatedUser(user: UserRecord): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}
