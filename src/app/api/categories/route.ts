/**
 * GET  /api/categories  — Listado público de categorías
 * POST /api/categories  — Crear categoría (solo ADMIN)
 *
 * Módulo: features/categories
 *
 * ESTADO: Adaptadores listos. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { CreateCategorySchema } from "@/features/categories/types";
import { apiResponse, handleHttpError } from "@/lib/http";

// ── GET /api/categories ───────────────────────────────────────────────────

export async function GET() {
  try {
    // TODO (Fase 3): const categories = await categoryService.listCategories();
    // TODO: return apiResponse.success(categories);
    return apiResponse.notImplemented("GET /api/categories");
  } catch (error) {
    return handleHttpError(error);
  }
}

// ── POST /api/categories ──────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return apiResponse.error("No autenticado", 401, "UNAUTHORIZED");
    }

    const body: unknown = await request.json();
    const data = CreateCategorySchema.parse(body);

    // TODO (Fase 3): Verificar token → role === 'ADMIN'
    // TODO: const category = await categoryService.createCategory(data);
    void data;

    return apiResponse.notImplemented("POST /api/categories");
  } catch (error) {
    return handleHttpError(error);
  }
}
