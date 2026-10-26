/**
 * BIDHUB — Feature: auctions — Errores de dominio
 */

import { AppError } from "@/lib/errors";

export class AuctionNotFoundError extends AppError {
  constructor(id: string) {
    super(`Subasta '${id}' no encontrada`, 404, "AUCTION_NOT_FOUND");
  }
}

export class AuctionNotActiveError extends AppError {
  constructor(status: string) {
    super(
      `La operación no está permitida: la subasta está en estado '${status}'`,
      409,
      "AUCTION_NOT_ACTIVE"
    );
  }
}

export class AuctionHasBidsError extends AppError {
  constructor() {
    super(
      "No se puede modificar ni cancelar una subasta que ya tiene ofertas",
      409,
      "AUCTION_HAS_BIDS"
    );
  }
}

export class MaxActiveAuctionsError extends AppError {
  constructor() {
    super(
      "Has alcanzado el límite de 5 subastas activas simultáneas",
      409,
      "MAX_ACTIVE_AUCTIONS_REACHED"
    );
  }
}

export class CategoryNotFoundError extends AppError {
  constructor(id: string) {
    super(`Categoría '${id}' no encontrada`, 404, "CATEGORY_NOT_FOUND");
  }
}

export class AuctionOwnershipError extends AppError {
  constructor() {
    super(
      "No tienes permiso para modificar esta subasta",
      403,
      "AUCTION_OWNERSHIP_VIOLATION"
    );
  }
}
