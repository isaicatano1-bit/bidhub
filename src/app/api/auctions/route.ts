/**
 * GET  /api/auctions  — Listar subastas públicas
 * POST /api/auctions  — Crear una subasta (autenticado)
 *
 * Módulo: features/auctions
 *
 * ESTADO: Adaptadores listos. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { ListAuctionsQuerySchema, CreateAuctionSchema } from "@/features/auctions/schemas";
import { apiResponse, handleHttpError } from "@/lib/http";

// ── GET /api/auctions ─────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const rawQuery = Object.fromEntries(request.nextUrl.searchParams.entries());
    const query = ListAuctionsQuerySchema.parse(rawQuery);

    // TODO (Fase 3): const result = await auctionService.listAuctions(query);
    // TODO: return apiResponse.success(result.items, 200, { page, limit, total, totalPages });
    void query;

    return apiResponse.notImplemented("GET /api/auctions");
  } catch (error) {
    return handleHttpError(error);
  }
}

// ── POST /api/auctions ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // TODO (Fase 3): Extraer y verificar access_token → obtener sellerId y role.
    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return apiResponse.error("No autenticado", 401, "UNAUTHORIZED");
    }

    const body: unknown = await request.json();
    const data = CreateAuctionSchema.parse(body);

    // TODO (Fase 3): const auction = await auctionService.createAuction(data, sellerId);
    // TODO: return apiResponse.success(auction, 201);
    void data;

    return apiResponse.notImplemented("POST /api/auctions");
  } catch (error) {
    return handleHttpError(error);
  }
}
