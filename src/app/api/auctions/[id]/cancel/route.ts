/**
 * POST /api/auctions/[id]/cancel
 *
 * Módulo: features/auctions
 * Acceso: Autenticado (USER propietario sin ofertas / ADMIN con motivo obligatorio)
 *
 * Body (USER): {} (vacío)
 * Body (ADMIN): { reason: string }
 *
 * ESTADO: Adaptador listo. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { AdminCancelAuctionSchema } from "@/features/auctions/schemas";
import { apiResponse, handleHttpError } from "@/lib/http";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return apiResponse.error("No autenticado", 401, "UNAUTHORIZED");
    }

    // TODO (Fase 3): Verificar token → requesterId, requesterRole
    // Si ADMIN → validar body con AdminCancelAuctionSchema
    // Si USER  → body ignorado (la validación de permisos la hace el servicio)

    const body: unknown = await request.json().catch(() => ({}));

    // El schema de cancelación admin se valida solo si el requester es ADMIN.
    // Aquí lo parseamos de forma opcional para documentar el flujo.
    // En la implementación real, esto se condicionará al rol.
    const adminData = AdminCancelAuctionSchema.safeParse(body);
    void adminData;
    void id;

    return apiResponse.notImplemented(`POST /api/auctions/${id}/cancel`);
  } catch (error) {
    return handleHttpError(error);
  }
}
