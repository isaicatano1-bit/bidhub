/**
 * POST /api/auth/refresh
 *
 * Módulo: features/auth
 * Acceso: Requiere cookie refresh_token (HttpOnly)
 *
 * Respuesta 200: { success: true, data: { user: AuthenticatedUser } }
 * Cookies renovadas: access_token, refresh_token (rotación)
 *
 * ESTADO: Adaptador listo. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { apiResponse, handleHttpError } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const rawRefreshToken = request.cookies.get("refresh_token")?.value;

    if (!rawRefreshToken) {
      return apiResponse.error(
        "No se encontró un refresh token activo",
        401,
        "UNAUTHORIZED"
      );
    }

    // TODO (Fase 3): const result = await authService.refresh(rawRefreshToken);
    // TODO: Rotar las cookies con los nuevos tokens.
    void rawRefreshToken;

    return apiResponse.notImplemented("POST /api/auth/refresh");
  } catch (error) {
    return handleHttpError(error);
  }
}
