/**
 * BIDHUB — Feature: auctions — Repositorio
 * Contrato de acceso a datos para subastas.
 *
 * ESTADO: Contrato definido. Implementación pendiente (Fase 3).
 */

import type {
  AuctionSummary,
  AuctionDetail,
  AuctionStatus,
} from "@/features/auctions/types";
import type {
  CreateAuctionDto,
  UpdateAuctionDto,
  ListAuctionsQuery,
} from "@/features/auctions/schemas";
import type { PaginatedResult } from "@/types";

export interface AuctionRepository {
  /** Lista subastas con filtros, paginación y ordenación. */
  findMany(query: ListAuctionsQuery): Promise<PaginatedResult<AuctionSummary>>;

  /** Obtiene el detalle completo de una subasta por su ID. */
  findById(id: string): Promise<AuctionDetail | null>;

  /**
   * Crea una nueva subasta.
   * Verifica que la categoría exista antes de insertar.
   */
  create(
    data: CreateAuctionDto & { sellerId: string }
  ): Promise<AuctionDetail>;

  /**
   * Actualiza campos de una subasta activa sin ofertas.
   * La verificación de propiedad y estado la hace el servicio antes de llamar a este método.
   */
  update(id: string, data: UpdateAuctionDto): Promise<AuctionDetail>;

  /**
   * Cambia el estado de una subasta.
   * Usado para cancelación y cierre.
   */
  updateStatus(
    id: string,
    status: AuctionStatus,
    metadata?: { cancelReason?: string; winnerId?: string }
  ): Promise<void>;

  /** Cuenta las subastas activas de un vendedor. */
  countActiveBySeller(sellerId: string): Promise<number>;

  /** Lista las subastas del vendedor autenticado con paginación. */
  findBySeller(
    sellerId: string,
    query: Pick<ListAuctionsQuery, "page" | "limit" | "status">
  ): Promise<PaginatedResult<AuctionSummary>>;

  /**
   * Lista subastas para el panel de administración (sin filtro de estado por defecto).
   * Incluye información adicional como motivo de cancelación.
   */
  findForAdmin(
    query: ListAuctionsQuery
  ): Promise<PaginatedResult<AuctionSummary>>;
}
