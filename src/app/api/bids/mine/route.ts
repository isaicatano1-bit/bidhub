/**
 * GET /api/bids/mine
 *
 * Módulo: features/bids
 * Acceso: Autenticado (historial de ofertas del postor autenticado)
 *
 * ESTADO: Adaptador listo. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { ListBidsQuerySchema } from "@/features/bids/schemas";
import { apiResponse, handleHttpError } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return apiResponse.error("No autenticado", 401, "UNAUTHORIZED");
    }

    const rawQuery = Object.fromEntries(request.nextUrl.searchParams.entries());
    const query = ListBidsQuerySchema.parse(rawQuery);

    // TODO (Fase 3): Verificar token → bidderId
    // TODO: const result = await bidService.getMyBids(bidderId, query);
    void query;

    return apiResponse.notImplemented("GET /api/bids/mine");
  } catch (error) {
    return handleHttpError(error);
  }
}
