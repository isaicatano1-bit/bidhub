/**
 * BIDHUB — Feature: bids — Servicio
 *
 * ESTADO: Contrato definido. Implementación pendiente (Fase 3).
 */

import type { BidPublicView, BidPrivateView, PlaceBidResult } from "@/features/bids/types";
import type { PlaceBidDto, ListBidsQuery } from "@/features/bids/schemas";
import type { PaginatedResult } from "@/types";

export interface BidService {
  /**
   * Caso de uso: Realizar una oferta.
   *
   * Reglas de negocio:
   * - La subasta debe estar en estado ACTIVE y no haber expirado.
   * - El postor no puede ser el vendedor de la subasta.
   * - El postor no puede ser el líder actual.
   * - Primera oferta ≥ startingPrice.
   * - Siguientes ofertas ≥ currentPrice + minimumIncrement.
   * - Si quedan ≤5 minutos para el cierre, extender endsAt +5 minutos.
   * - La extensión puede repetirse indefinidamente.
   * - Operación transaccional con bloqueo para evitar race conditions.
   *
   * @throws BidOnOwnAuctionError
   * @throws AuctionClosedForBidsError
   * @throws BidByLeaderError
   * @throws BidTooLowError
   */
  placeBid(
    auctionId: string,
    bidderId: string,
    data: PlaceBidDto
  ): Promise<PlaceBidResult>;

  /**
   * Caso de uso: Historial público de ofertas de una subasta.
   * Devuelve alias parcial; nunca nombre completo ni correo.
   */
  getPublicBidHistory(
    auctionId: string,
    query: ListBidsQuery
  ): Promise<PaginatedResult<BidPublicView>>;

  /**
   * Caso de uso: Historial de ofertas del usuario autenticado.
   */
  getMyBids(
    bidderId: string,
    query: ListBidsQuery
  ): Promise<PaginatedResult<BidPrivateView>>;
}

/** TODO (Fase 3): Exportar instancia concreta bidService */
export declare const bidService: BidService;
