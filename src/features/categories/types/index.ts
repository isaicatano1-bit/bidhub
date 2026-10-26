/**
 * BIDHUB — Feature: categories — Tipos, Schemas, Repositorio y Servicio
 * Módulo simple: las categorías son gestionadas solo por ADMIN.
 */

import { z } from "zod";
import { AppError } from "@/lib/errors";
import type { PaginatedResult } from "@/types";

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { auctions: number };
  createdAt: Date;
  updatedAt: Date;
}

// ── Schemas Zod ───────────────────────────────────────────────────────────

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede superar 80 caracteres")
    .trim(),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones")
    .trim(),
  description: z.string().max(500).optional(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial().refine(
  (d) => Object.keys(d).length > 0,
  "Se debe incluir al menos un campo"
);

export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;

// ── Errores ───────────────────────────────────────────────────────────────

export class CategoryHasAuctionsError extends AppError {
  constructor(name: string) {
    super(
      `La categoría '${name}' no puede eliminarse porque tiene subastas asociadas`,
      409,
      "CATEGORY_HAS_AUCTIONS"
    );
  }
}

export class CategorySlugConflictError extends AppError {
  constructor(slug: string) {
    super(`El slug '${slug}' ya está en uso`, 409, "CATEGORY_SLUG_CONFLICT");
  }
}

// ── Repositorio (contrato) ────────────────────────────────────────────────

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  create(data: CreateCategoryDto): Promise<Category>;
  update(id: string, data: UpdateCategoryDto): Promise<Category>;
  /**
   * Elimina una categoría solo si no tiene subastas asociadas.
   * @throws CategoryHasAuctionsError
   */
  delete(id: string): Promise<void>;
  findManyForAdmin(query: { page: number; limit: number }): Promise<PaginatedResult<Category>>;
}

// ── Servicio (contrato) ───────────────────────────────────────────────────

export interface CategoryService {
  /** Listado público de todas las categorías (sin paginación para menú/filtros). */
  listCategories(): Promise<Category[]>;

  /** Solo ADMIN: crea una nueva categoría. */
  createCategory(data: CreateCategoryDto): Promise<Category>;

  /** Solo ADMIN: actualiza una categoría existente. */
  updateCategory(id: string, data: UpdateCategoryDto): Promise<Category>;

  /**
   * Solo ADMIN: elimina una categoría.
   * @throws CategoryHasAuctionsError si tiene subastas.
   */
  deleteCategory(id: string): Promise<void>;
}

/** TODO (Fase 3): Exportar instancias concretas categoryRepository, categoryService */
export declare const categoryService: CategoryService;
