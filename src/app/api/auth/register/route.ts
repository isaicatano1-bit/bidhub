/**
 * POST /api/auth/register
 *
 * Módulo: features/auth
 * Acceso: Público
 *
 * Body: { name, email, password }
 * Respuesta 201: { success: true, data: { user: AuthenticatedUser } }
 *
 * ESTADO: Estructura de adaptador lista. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { RegisterSchema } from "@/features/auth/schemas";
import { apiResponse, handleHttpError } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const data = RegisterSchema.parse(body);

    // TODO (Fase 3): const result = await authService.register(data);
    // TODO: Configurar cookie de sesión con el refresh token.
    void data;

    return apiResponse.notImplemented("POST /api/auth/register");
  } catch (error) {
    return handleHttpError(error);
  }
}
