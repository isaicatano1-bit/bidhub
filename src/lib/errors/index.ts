/**
 * BIDHUB - Jerarquía de errores compartidos
 * Errores base de dominio y aplicación para mapeo HTTP consistente.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Preservar stack trace en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message = "Error de validación en la solicitud", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Credenciales inválidas o no autenticado") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "No tienes permisos para realizar esta acción") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Recurso", identifier?: string | number) {
    const message = identifier
      ? `${resource} con identificador '${identifier}' no fue encontrado`
      : `${resource} no encontrado`;
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflicto con el estado actual del recurso") {
    super(message, 409, "CONFLICT");
  }
}

export class NotImplementedError extends AppError {
  constructor(operation = "Operación") {
    super(
      `${operation} no está implementada todavía. Prevista para siguientes fases.`,
      501,
      "NOT_IMPLEMENTED"
    );
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Error interno del servidor", details?: unknown) {
    super(message, 500, "INTERNAL_SERVER_ERROR", details);
  }
}
