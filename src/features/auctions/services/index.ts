/**
 * BIDHUB — Feature: auctions — Servicio
 * Contratos de los casos de uso de subastas.
 *
 * ESTADO: Contratos definidos. Implementación pendiente (Fase 3).
 */

import type { AuctionSummary, AuctionDetail } from "@/features/auctions/types";
import type {
  CreateAuctionDto,
  UpdateAuctionDto,
  ListAuctionsQuery,
  AdminCancelAuctionDto,
} from "@/features/auctions/schemas";
import type { PaginatedResult } from "@/types";

export interface AuctionService {
  /**
   * Lista subastas públicas (solo las ACTIVE por defecto).
   */
  listAuctions(query: ListAuctionsQuery): Promise<PaginatedResult<AuctionSummary>>;

  /**
   * Obtiene el detalle de una subasta. Visible públicamente si está ACTIVE.
   * Para subastas CLOSED, UNSOLD o CANCELLED requiere autenticación.
   *
   * Reglas:
   * - Computa el estado real al momento de la consulta (sin depender solo del valor en BD).
   * @throws AuctionNotFoundError
   */
  getAuctionById(id: string): Promise<AuctionDetail>;

  /**
   * Crea una nueva subasta.
   *
   * Reglas de negocio:
   * - El vendedor no puede tener más de 5 subastas ACTIVE simultáneas.
   * - El precio inicial debe ser > 0.
   * - El incremento mínimo debe ser > 0.
   * - La fecha de cierre: mínimo 1h, máximo 7 días desde ahora.
   * - La categoría debe existir.
   *
   * @throws MaxActiveAuctionsError
   * @throws CategoryNotFoundError
   */
  createAuction(
    data: CreateAuctionDto,
    sellerId: string
  ): Promise<AuctionDetail>;

  /**
   * Actualiza una subasta propia activa sin ofertas.
   *
   * Reglas:
   * - Solo el propietario puede editar.
   * - La subasta debe estar en estado ACTIVE.
   * - No puede haber ofertas registradas.
   * - Si se cambia la fecha de cierre, se validan de nuevo las restricciones de duración.
   *
   * @throws AuctionNotFoundError
   * @throws AuctionOwnershipError
   * @throws AuctionNotActiveError
   * @throws AuctionHasBidsError
   */
  updateAuction(
    id: string,
    data: UpdateAuctionDto,
    requesterId: string
  ): Promise<AuctionDetail>;

  /**
   * Cancela una subasta propia (usuario) o cualquier subasta (administrador).
   *
   * Reglas:
   * - USER: solo puede cancelar la propia si no tiene ofertas.
   * - ADMIN: puede cancelar cualquier subasta ACTIVE; el motivo es obligatorio.
   * - No se pueden cancelar subastas ya CLOSED, UNSOLD o CANCELLED.
   *
   * @throws AuctionNotFoundError
   * @throws AuctionOwnershipError (si USER intenta cancelar la de otro)
   * @throws AuctionHasBidsError (si USER intenta cancelar con ofertas)
   * @throws AuctionNotActiveError
   */
  cancelAuction(
    id: string,
    requesterId: string,
    requesterRole: "USER" | "ADMIN",
    adminData?: AdminCancelAuctionDto
  ): Promise<void>;

  /**
   * Lista las subastas del usuario autenticado (vendedor).
   */
  getMyAuctions(
    sellerId: string,
    query: Pick<ListAuctionsQuery, "page" | "limit" | "status">
  ): Promise<PaginatedResult<AuctionSummary>>;

  /**
   * Lista todas las subastas para el panel de administración.
   * Incluye todos los estados.
   */
  listAuctionsForAdmin(
    query: ListAuctionsQuery
  ): Promise<PaginatedResult<AuctionSummary>>;
}

/** TODO (Fase 3): Exportar instancia concreta auctionService */
export declare const auctionService: AuctionService;
