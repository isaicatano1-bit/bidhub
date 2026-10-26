/**
 * BIDHUB — Feature: bids — Schemas Zod
 */

import { z } from "zod";

export const PlaceBidSchema = z.object({
  amount: z
    .number()
    .positive("La oferta debe ser un valor positivo")
    .multipleOf(0.01, "La oferta puede tener como máximo 2 decimales"),
});

export type PlaceBidDto = z.infer<typeof PlaceBidSchema>;

export const ListBidsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type ListBidsQuery = z.infer<typeof ListBidsQuerySchema>;
