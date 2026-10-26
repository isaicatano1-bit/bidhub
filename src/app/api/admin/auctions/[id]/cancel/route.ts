/**
 * POST /api/admin/auctions/[id]/cancel
 *
 * Módulo: features/admin → features/auctions
 * Acceso: Solo ADMIN
 *
 * Body: { reason: string } — Motivo obligatorio (mín. 10 chars)
 * Respuesta 200: { success: true, data: null }
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

    const body: unknown = await request.json();
    const data = AdminCancelAuctionSchema.parse(body);

    // TODO (Fase 3): Verificar token → role === 'ADMIN', obtener requesterId
    // TODO: await auctionService.cancelAuction(id, requesterId, 'ADMIN', data);
    // TODO: return apiResponse.success(null);
    void id;
    void data;

    return apiResponse.notImplemented(`POST /api/admin/auctions/${id}/cancel`);
  } catch (error) {
    return handleHttpError(error);
  }
}
