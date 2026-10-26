/**
 * BIDHUB — Feature: bids — Errores de dominio
 */

import { AppError } from "@/lib/errors";

export class BidOnOwnAuctionError extends AppError {
  constructor() {
    super(
      "No puedes ofertar en tu propia subasta",
      403,
      "BID_ON_OWN_AUCTION"
    );
  }
}

export class BidTooLowError extends AppError {
  constructor(required: number) {
    super(
      `Tu oferta debe ser de al menos $${required.toFixed(2)}`,
      422,
      "BID_TOO_LOW"
    );
  }
}

export class BidByLeaderError extends AppError {
  constructor() {
    super(
      "Ya eres el líder de esta subasta. No puedes volver a ofertar.",
      409,
      "BID_BY_CURRENT_LEADER"
    );
  }
}

export class AuctionClosedForBidsError extends AppError {
  constructor(status: string) {
    super(
      `No se aceptan ofertas: la subasta está en estado '${status}'`,
      409,
      "AUCTION_CLOSED_FOR_BIDS"
    );
  }
}
