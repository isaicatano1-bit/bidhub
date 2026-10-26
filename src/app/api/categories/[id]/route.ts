/**
 * PATCH  /api/categories/[id]  — Editar categoría (solo ADMIN)
 * DELETE /api/categories/[id]  — Eliminar categoría (solo ADMIN)
 *
 * Módulo: features/categories
 *
 * ESTADO: Adaptadores listos. Implementación pendiente (Fase 3).
 */

import { type NextRequest } from "next/server";
import { UpdateCategorySchema } from "@/features/categories/types";
import { apiResponse, handleHttpError } from "@/lib/http";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ── PATCH /api/categories/[id] ────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return apiResponse.error("No autenticado", 401, "UNAUTHORIZED");
    }

    const body: unknown = await request.json();
    const data = UpdateCategorySchema.parse(body);

    // TODO (Fase 3): Verificar role === 'ADMIN'
    // TODO: const category = await categoryService.updateCategory(id, data);
    void id;
    void data;

    return apiResponse.notImplemented(`PATCH /api/categories/${id}`);
  } catch (error) {
    return handleHttpError(error);
  }
}

// ── DELETE /api/categories/[id] ───────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return apiResponse.error("No autenticado", 401, "UNAUTHORIZED");
    }

    // TODO (Fase 3): Verificar role === 'ADMIN'
    // TODO: await categoryService.deleteCategory(id);
    // TODO: return new NextResponse(null, { status: 204 });
    void id;

    return apiResponse.notImplemented(`DELETE /api/categories/${id}`);
  } catch (error) {
    return handleHttpError(error);
  }
}
