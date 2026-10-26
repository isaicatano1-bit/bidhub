/**
 * GET   /api/auctions/[id]   — Detalle de subasta
 * PATCH /api/auctions/[id]   — Editar subasta propia activa sin ofertas
 *
 * Módulo: features/auctions
 * Acceso: GET Público | PATCH Autenticado (propietario)
 *
 * ESTADO: Adaptadores listos. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { UpdateAuctionSchema } from "@/features/auctions/schemas";
import { apiResponse, handleHttpError } from "@/lib/http";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ── GET /api/auctions/[id] ────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // TODO (Fase 3): const auction = await auctionService.getAuctionById(id);
    // TODO: return apiResponse.success(auction);
    void id;

    return apiResponse.notImplemented(`GET /api/auctions/${id}`);
  } catch (error) {
    return handleHttpError(error);
  }
}

// ── PATCH /api/auctions/[id] ──────────────────────────────────────────────

export async function PATCH(
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
    const data = UpdateAuctionSchema.parse(body);

    // TODO (Fase 3): Verificar token → requesterId
    // TODO: const auction = await auctionService.updateAuction(id, data, requesterId);
    void id;
    void data;

    return apiResponse.notImplemented(`PATCH /api/auctions/${id}`);
  } catch (error) {
    return handleHttpError(error);
  }
}
