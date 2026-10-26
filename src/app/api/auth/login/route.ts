/**
 * POST /api/auth/login
 *
 * Módulo: features/auth
 * Acceso: Público
 *
 * Body: { email, password }
 * Respuesta 200: { success: true, data: { user: AuthenticatedUser } }
 * Cookies: access_token (HttpOnly), refresh_token (HttpOnly)
 *
 * ESTADO: Adaptador listo. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { LoginSchema } from "@/features/auth/schemas";
import { apiResponse, handleHttpError } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const data = LoginSchema.parse(body);

    // TODO (Fase 3): const result = await authService.login(data);
    // TODO: Setear cookies HttpOnly: access_token, refresh_token.
    //       Usar response.cookies.set() con Secure: true en producción.
    void data;

    return apiResponse.notImplemented("POST /api/auth/login");
  } catch (error) {
    return handleHttpError(error);
  }
}
