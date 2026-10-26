/**
 * BIDHUB — Feature: auctions — Schemas Zod
 * Validación de entrada para subastas. Los tipos DTO se infieren directamente.
 */

import { z } from "zod";

const MIN_DURATION_HOURS = 1;
const MAX_DURATION_DAYS = 7;

// ── Crear subasta ─────────────────────────────────────────────────────────────

export const CreateAuctionSchema = z.object({
  title: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(200, "El título no puede superar 200 caracteres")
    .trim(),
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(5000, "La descripción no puede superar 5000 caracteres")
    .trim(),
  imageUrl: z.string().url("La URL de la imagen no es válida").optional(),
  startingPrice: z
    .number()
    .positive("El precio inicial debe ser mayor que cero"),
  minimumIncrement: z
    .number()
    .positive("El incremento mínimo debe ser mayor que cero"),
  endsAt: z
    .string()
    .datetime({ message: "La fecha de cierre debe ser una fecha ISO 8601 válida" })
    .transform((val) => new Date(val))
    .refine(
      (date) =>
        date > new Date(Date.now() + MIN_DURATION_HOURS * 60 * 60 * 1000),
      "La subasta debe cerrarse al menos 1 hora después de publicarse"
    )
    .refine(
      (date) =>
        date < new Date(Date.now() + MAX_DURATION_DAYS * 24 * 60 * 60 * 1000),
      "La subasta no puede durar más de 7 días"
    ),
  categoryId: z.string().uuid("El ID de categoría debe ser un UUID válido"),
});

export type CreateAuctionDto = z.infer<typeof CreateAuctionSchema>;

// ── Actualizar subasta ────────────────────────────────────────────────────────

export const UpdateAuctionSchema = CreateAuctionSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Se debe incluir al menos un campo para actualizar"
);

export type UpdateAuctionDto = z.infer<typeof UpdateAuctionSchema>;

// ── Query params de listado ───────────────────────────────────────────────────

export const ListAuctionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  categoryId: z.string().uuid().optional(),
  status: z.enum(["ACTIVE", "CLOSED", "UNSOLD", "CANCELLED"]).optional(),
  sort: z.enum(["endsAt", "currentPrice", "createdAt"]).default("endsAt"),
  order: z.enum(["asc", "desc"]).default("asc"),
  search: z.string().max(200).optional(),
});

export type ListAuctionsQuery = z.infer<typeof ListAuctionsQuerySchema>;

// ── Cancelación de subasta (solo ADMIN) ──────────────────────────────────────

export const AdminCancelAuctionSchema = z.object({
  reason: z
    .string()
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(500, "El motivo no puede superar 500 caracteres")
    .trim(),
});

export type AdminCancelAuctionDto = z.infer<typeof AdminCancelAuctionSchema>;
