/**
 * BIDHUB — Feature: bids — Tipos de dominio
 */

/** Vista pública del historial de una oferta (alias parcial, sin datos personales). */
export interface BidPublicView {
  id: string;
  amount: number;
  bidderAlias: string; // Parcial: "Jua***" (primeras 3 letras + ***)
  createdAt: Date;
}

/** Vista privada: visible solo al propio postor o al admin. */
export interface BidPrivateView extends BidPublicView {
  bidderId: string;
  auctionId: string;
}

/** Resultado de una oferta exitosa. */
export interface PlaceBidResult {
  bid: BidPrivateView;
  newCurrentPrice: number;
  newEndsAt: Date; // Puede haberse extendido +5min
  wasExtended: boolean;
}
