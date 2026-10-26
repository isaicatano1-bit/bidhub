/**
 * BIDHUB - Tipos globales y transversales
 * Tipos de infraestructura y transporte no exclusivos de una feature.
 */

export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}
