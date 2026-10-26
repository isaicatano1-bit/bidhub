#!/usr/bin/env node
/**
 * BIDHUB — Script de verificación de estructura del proyecto
 * Verifica que todos los archivos críticos de la arquitectura existan.
 *
 * Uso: node scripts/check-structure.mjs
 */

import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const requiredFiles = [
  // Configuración
  "tsconfig.json",
  "prisma.config.ts",
  "prisma/schema.prisma",
  "prisma/seed.ts",
  ".env.example",

  // Lib
  "src/lib/db/index.ts",
  "src/lib/env/index.ts",
  "src/lib/errors/index.ts",
  "src/lib/http/index.ts",
  "src/lib/security/index.ts",

  // Types globales
  "src/types/index.ts",

  // Features — auth
  "src/features/auth/types/index.ts",
  "src/features/auth/schemas/index.ts",
  "src/features/auth/services/index.ts",
  "src/features/auth/repositories/index.ts",
  "src/features/auth/errors/index.ts",

  // Features — auctions
  "src/features/auctions/types/index.ts",
  "src/features/auctions/schemas/index.ts",
  "src/features/auctions/services/index.ts",
  "src/features/auctions/repositories/index.ts",
  "src/features/auctions/errors/index.ts",

  // Features — bids
  "src/features/bids/types/index.ts",
  "src/features/bids/schemas/index.ts",
  "src/features/bids/services/index.ts",
  "src/features/bids/repositories/index.ts",
  "src/features/bids/errors/index.ts",

  // Features — categories
  "src/features/categories/types/index.ts",

  // App — Route Groups
  "src/app/layout.tsx",
  "src/app/globals.css",
  "src/app/(public)/page.tsx",
  "src/app/(auth)/layout.tsx",
  "src/app/(private)/layout.tsx",
  "src/app/(admin)/layout.tsx",

  // API — Auth
  "src/app/api/auth/register/route.ts",
  "src/app/api/auth/login/route.ts",
  "src/app/api/auth/refresh/route.ts",
  "src/app/api/auth/logout/route.ts",
  "src/app/api/auth/me/route.ts",

  // API — Auctions
  "src/app/api/auctions/route.ts",
  "src/app/api/auctions/[id]/route.ts",
  "src/app/api/auctions/[id]/bids/route.ts",
  "src/app/api/auctions/[id]/cancel/route.ts",
  "src/app/api/auctions/mine/route.ts",

  // API — Bids
  "src/app/api/bids/mine/route.ts",

  // API — Categories
  "src/app/api/categories/route.ts",
  "src/app/api/categories/[id]/route.ts",

  // API — Admin
  "src/app/api/admin/auctions/route.ts",
  "src/app/api/admin/auctions/[id]/cancel/route.ts",

  // Docs
  "docs/architecture.md",
  "docs/api-contracts.md",
];

let missing = 0;
let found = 0;

for (const file of requiredFiles) {
  const fullPath = resolve(root, file);
  if (existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
    found++;
  } else {
    console.error(`  ❌ FALTA: ${file}`);
    missing++;
  }
}

console.log(`\n📊 Resultado: ${found} encontrados, ${missing} faltantes de ${requiredFiles.length} archivos verificados.`);
if (missing > 0) {
  process.exit(1);
}
