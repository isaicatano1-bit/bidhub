/**
 * BIDHUB — Feature: auctions — Tipos de dominio
 */

export type AuctionStatus = "ACTIVE" | "CLOSED" | "UNSOLD" | "CANCELLED";

export interface AuctionSummary {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startingPrice: number;
  currentPrice: number;
  minimumIncrement: number;
  status: AuctionStatus;
  endsAt: Date;
  categoryId: string;
  categoryName: string;
  sellerId: string;
  sellerAlias: string;
  totalBids: number;
  createdAt: Date;
}

export interface AuctionDetail extends AuctionSummary {
  leadingBidderId: string | null;
  extensionCount: number; // Número de veces que se extendió el tiempo
}

export interface CancelAuctionCommand {
  auctionId: string;
  requesterId: string;
  requesterRole: "USER" | "ADMIN";
  reason?: string; // Obligatorio para ADMIN, no disponible para USER
}
