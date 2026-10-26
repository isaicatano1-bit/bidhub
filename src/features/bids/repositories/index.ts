/**
 * BIDHUB — Feature: bids — Repositorio
 *
 * Estrategia de concurrencia:
 * Las operaciones de escritura de ofertas deben ejecutarse dentro de una transacción
 * serializable o con SELECT ... FOR UPDATE sobre el registro de subasta para garantizar
 * consistencia en currentPrice, leadingBidderId y la extensión del tiempo.
 *
 * NO se debe usar un findUnique() seguido de update() sin bloqueo.
 *
 * ESTADO: Contrato definido. Implementación pendiente (Fase 3).
 */

import type { BidPublicView, BidPrivateView } from "@/features/bids/types";
import type { PlaceBidDto, ListBidsQuery } from "@/features/bids/schemas";
import type { PaginatedResult } from "@/types";

export interface BidRepository {
  /**
   * Inserta una oferta dentro de una transacción que también actualiza
   * currentPrice, leadingBidderId y potencialmente endsAt en la subasta.
   *
   * Garantiza atomicidad con SELECT ... FOR UPDATE sobre Auction.
   * Extiende endsAt 5 minutos si quedan ≤5 minutos para el cierre.
   */
  placeBid(
    auctionId: string,
    bidderId: string,
    data: PlaceBidDto
  ): Promise<{
    bid: BidPrivateView;
    newCurrentPrice: number;
    newEndsAt: Date;
    wasExtended: boolean;
  }>;

  /**
   * Devuelve el historial público de ofertas de una subasta.
   * El campo bidderAlias es parcial: primeros 3 chars + "***".
   */
  findPublicByAuction(
    auctionId: string,
    query: ListBidsQuery
  ): Promise<PaginatedResult<BidPublicView>>;

  /**
   * Devuelve el historial completo de ofertas del usuario autenticado.
   */
  findByBidder(
    bidderId: string,
    query: ListBidsQuery
  ): Promise<PaginatedResult<BidPrivateView>>;
}
