/**
 * POST /api/auth/logout
 *
 * Módulo: features/auth
 * Acceso: Requiere access_token (cookie HttpOnly)
 *
 * Respuesta 200: { success: true, data: null }
 * Efecto: Revoca refresh tokens en BD + elimina ambas cookies.
 *
 * ESTADO: Adaptador listo. Implementación pendiente (Fase 3).
 */

import { type NextRequest, NextResponse } from "next/server";
import { apiResponse, handleHttpError } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      // Sin sesión activa: limpiar cookies y responder OK (idempotente)
      const response = NextResponse.json({ success: true, data: null }, { status: 200 });
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    // TODO (Fase 3): const payload = await security.verifyToken(accessToken, env.JWT_SECRET);
    // TODO: await authService.logout(payload.sub);
    // TODO: Eliminar ambas cookies de la respuesta.
    void accessToken;

    return apiResponse.notImplemented("POST /api/auth/logout");
  } catch (error) {
    return handleHttpError(error);
  }
}
