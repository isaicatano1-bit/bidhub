/**
 * GET /api/auth/me
 *
 * Módulo: features/auth
 * Acceso: Autenticado (access_token cookie)
 *
 * Respuesta 200: { success: true, data: { user: AuthenticatedUser } }
 *
 * ESTADO: Adaptador listo. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { apiResponse, handleHttpError } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      return apiResponse.error("No autenticado", 401, "UNAUTHORIZED");
    }

    // TODO (Fase 3): const user = await authService.getCurrentUser(accessToken);
    // TODO: return apiResponse.success({ user });
    void accessToken;

    return apiResponse.notImplemented("GET /api/auth/me");
  } catch (error) {
    return handleHttpError(error);
  }
}
