/**
 * GET /api/admin/auctions
 *
 * Módulo: features/admin → features/auctions
 * Acceso: Solo ADMIN
 *
 * Lista todas las subastas (todos los estados) con información de cancelación.
 *
 * ESTADO: Adaptador listo. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { ListAuctionsQuerySchema } from "@/features/auctions/schemas";
import { apiResponse, handleHttpError } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return apiResponse.error("No autenticado", 401, "UNAUTHORIZED");
    }

    const rawQuery = Object.fromEntries(request.nextUrl.searchParams.entries());
    const query = ListAuctionsQuerySchema.parse(rawQuery);

    // TODO (Fase 3): Verificar token → role === 'ADMIN'
    // TODO: const result = await auctionService.listAuctionsForAdmin(query);
    void query;

    return apiResponse.notImplemented("GET /api/admin/auctions");
  } catch (error) {
    return handleHttpError(error);
  }
}
