/**
 * BIDHUB - Utilidades y respuestas HTTP compartidas
 * Funciones de ayuda para estandarizar las respuestas JSON de los Route Handlers.
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors";
import type { ApiResponseMeta } from "@/types";

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: ApiResponseMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
} as const;

export const apiResponse = {
  /**
   * Genera una respuesta exitosa estandarizada.
   */
  success<T>(data: T, status: number = HttpStatus.OK, meta?: ApiResponseMeta): NextResponse<ApiResponse<T>> {
    const payload: ApiResponse<T> = {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    };
    return NextResponse.json(payload, { status });
  },

  /**
   * Genera una respuesta de error estandarizada.
   */
  error(
    message: string,
    status: number = HttpStatus.BAD_REQUEST,
    code = "BAD_REQUEST",
    details?: unknown
  ): NextResponse<ApiErrorResponse> {
    const payload: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    };
    return NextResponse.json(payload, { status });
  },

  /**
   * Genera una respuesta 501 Not Implemented estandarizada.
   */
  notImplemented(resourceName = "Endpoint"): NextResponse<ApiErrorResponse> {
    return this.error(
      `${resourceName} no está implementado todavía. Previsto para siguientes fases.`,
      HttpStatus.NOT_IMPLEMENTED,
      "NOT_IMPLEMENTED"
    );
  },
};

/**
 * Capturador global de errores para Route Handlers.
 * Mapea errores de dominio (AppError), errores de Zod y excepciones inesperadas a respuestas HTTP uniformes.
 */
export function handleHttpError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof AppError) {
    return apiResponse.error(error.message, error.statusCode, error.code, error.details);
  }

  if (error instanceof ZodError) {
    return apiResponse.error(
      "Datos de entrada inválidos",
      HttpStatus.BAD_REQUEST,
      "VALIDATION_ERROR",
      error.issues
    );
  }

  const message = error instanceof Error ? error.message : "Error inesperado en el servidor";
  return apiResponse.error(
    process.env.NODE_ENV === "production" ? "Error interno del servidor" : message,
    HttpStatus.INTERNAL_SERVER_ERROR,
    "INTERNAL_SERVER_ERROR"
  );
}
