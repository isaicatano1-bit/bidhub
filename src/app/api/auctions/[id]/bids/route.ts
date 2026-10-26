/**
 * GET  /api/auctions/[id]/bids  — Historial público de ofertas
 * POST /api/auctions/[id]/bids  — Realizar una oferta (autenticado)
 *
 * Módulo: features/bids
 * Acceso: GET Público | POST Autenticado
 *
 * ESTADO: Adaptadores listos. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { PlaceBidSchema, ListBidsQuerySchema } from "@/features/bids/schemas";
import { apiResponse, handleHttpError } from "@/lib/http";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ── GET /api/auctions/[id]/bids ───────────────────────────────────────────

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: auctionId } = await context.params;
    const rawQuery = Object.fromEntries(request.nextUrl.searchParams.entries());
    const query = ListBidsQuerySchema.parse(rawQuery);

    // TODO (Fase 3): const result = await bidService.getPublicBidHistory(auctionId, query);
    void auctionId;
    void query;

    return apiResponse.notImplemented(`GET /api/auctions/${auctionId}/bids`);
  } catch (error) {
    return handleHttpError(error);
  }
}

// ── POST /api/auctions/[id]/bids ──────────────────────────────────────────

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: auctionId } = await context.params;

    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return apiResponse.error("No autenticado", 401, "UNAUTHORIZED");
    }

    const body: unknown = await request.json();
    const data = PlaceBidSchema.parse(body);

    // TODO (Fase 3): Verificar token → bidderId
    // TODO: const result = await bidService.placeBid(auctionId, bidderId, data);
    void auctionId;
    void data;

    return apiResponse.notImplemented(`POST /api/auctions/${auctionId}/bids`);
  } catch (error) {
    return handleHttpError(error);
  }
}
