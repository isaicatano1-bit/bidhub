/**
 * BIDHUB — Feature: auth
 * Errores de dominio específicos del módulo de autenticación.
 */

import { AppError } from "@/lib/errors";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(
      "Correo o contraseña incorrectos",
      401,
      "INVALID_CREDENTIALS"
    );
  }
}

export class EmailAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(
      `El correo '${email}' ya está registrado`,
      409,
      "EMAIL_ALREADY_EXISTS"
    );
  }
}

export class TokenExpiredError extends AppError {
  constructor() {
    super(
      "El token ha expirado. Inicia sesión nuevamente.",
      401,
      "TOKEN_EXPIRED"
    );
  }
}

export class InvalidTokenError extends AppError {
  constructor() {
    super("Token inválido o malformado", 401, "INVALID_TOKEN");
  }
}

export class RefreshTokenRevokedError extends AppError {
  constructor() {
    super(
      "La sesión ha sido revocada. Inicia sesión nuevamente.",
      401,
      "REFRESH_TOKEN_REVOKED"
    );
  }
}
