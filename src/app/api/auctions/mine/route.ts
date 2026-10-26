/**
 * GET /api/auctions/mine
 *
 * Módulo: features/auctions
 * Acceso: Autenticado (devuelve las subastas del vendedor autenticado)
 *
 * Query params: page, limit, status
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
    const query = ListAuctionsQuerySchema.pick({
      page: true,
      limit: true,
      status: true,
    }).parse(rawQuery);

    // TODO (Fase 3): Verificar token → sellerId
    // TODO: const result = await auctionService.getMyAuctions(sellerId, query);
    void query;

    return apiResponse.notImplemented("GET /api/auctions/mine");
  } catch (error) {
    return handleHttpError(error);
  }
}
