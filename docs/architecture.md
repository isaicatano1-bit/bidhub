# BidHub — Arquitectura del Backend

> **Versión:** 2.0 · **Fase:** 2 — Estructura y contratos definidos  
> **Fecha:** 2026-10-26  
> **Estado:** Contratos de API listos. Implementación pendiente en Fase 3.

---

## 1. Arquitectura elegida

**Feature-Based Architecture** con separación estricta en tres capas:

```
HTTP Transport   →  Route Handlers  (src/app/api)
Business Logic   →  Services        (src/features/*/services)
Data Access      →  Repositories    (src/features/*/repositories → Prisma → PostgreSQL)
```

### Principios aplicados

| Principio | Aplicación |
|-----------|------------|
| Separación de capas | Route Handlers no contienen lógica de negocio ni consultas Prisma directas |
| Módulos independientes | Cada feature es autosuficiente |
| Sin dependencias circulares | `features/*` → `lib/*`; nunca al revés |
| TypeScript estricto | `strict: true`, sin `any` |
| Contratos explícitos | Interfaces TypeScript para servicios y repositorios |

---

## 2. Árbol de carpetas real

```
bidhub/
├── prisma/
│   ├── schema.prisma           # Esquema base (modelos pendientes Fase 3)
│   └── seed.ts                 # Seed: categorías + admin (pendiente Fase 3)
├── prisma.config.ts            # Prisma 7: datasource + migrations
├── scripts/
│   └── check-structure.mjs    # Verificador de estructura
├── docs/
│   ├── architecture.md        # Este documento
│   └── api-contracts.md       # Contratos completos de la API
├── src/
│   ├── types/index.ts         # PaginatedResult, SortOrder, ApiResponseMeta
│   ├── lib/
│   │   ├── db/index.ts        # Singleton PrismaClient
│   │   ├── env/index.ts       # Validación vars de entorno (Zod)
│   │   ├── errors/index.ts    # AppError y subclases
│   │   ├── http/index.ts      # apiResponse, handleHttpError, HttpStatus
│   │   └── security/index.ts  # bcrypt + jose (hash, signToken, verifyToken)
│   ├── features/
│   │   ├── auth/
│   │   │   ├── types/         # AuthenticatedUser, AuthTokens, UserRole
│   │   │   ├── schemas/       # RegisterSchema, LoginSchema (Zod)
│   │   │   ├── services/      # AuthService (contrato)
│   │   │   ├── repositories/  # AuthRepository (contrato)
│   │   │   └── errors/        # InvalidCredentialsError, EmailAlreadyExistsError…
│   │   ├── auctions/
│   │   │   ├── types/         # AuctionSummary, AuctionDetail, AuctionStatus
│   │   │   ├── schemas/       # CreateAuctionSchema, UpdateAuctionSchema, ListAuctionsQuerySchema
│   │   │   ├── services/      # AuctionService (contrato)
│   │   │   ├── repositories/  # AuctionRepository (contrato)
│   │   │   └── errors/        # AuctionNotFoundError, AuctionHasBidsError…
│   │   ├── bids/
│   │   │   ├── types/         # BidPublicView, BidPrivateView, PlaceBidResult
│   │   │   ├── schemas/       # PlaceBidSchema, ListBidsQuerySchema
│   │   │   ├── services/      # BidService (contrato)
│   │   │   ├── repositories/  # BidRepository (contrato + estrategia concurrencia)
│   │   │   └── errors/        # BidOnOwnAuctionError, BidTooLowError…
│   │   ├── categories/
│   │   │   └── types/         # Category, schemas, errors, CategoryService, CategoryRepository
│   │   ├── users/             # (reservado Fase 4)
│   │   └── admin/             # (reservado Fase 4)
│   ├── components/
│   │   ├── ui/                # Badge, etc.
│   │   └── shared/            # Navbar, etc.
│   └── app/
│       ├── layout.tsx
│       ├── globals.css
│       ├── (public)/page.tsx
│       ├── (auth)/layout.tsx
│       ├── (private)/layout.tsx
│       ├── (admin)/layout.tsx
│       └── api/
│           ├── auth/{register,login,refresh,logout,me}/route.ts
│           ├── auctions/route.ts
│           ├── auctions/mine/route.ts
│           ├── auctions/[id]/route.ts
│           ├── auctions/[id]/cancel/route.ts
│           ├── auctions/[id]/bids/route.ts
│           ├── bids/mine/route.ts
│           ├── categories/route.ts
│           ├── categories/[id]/route.ts
│           ├── admin/auctions/route.ts
│           └── admin/auctions/[id]/cancel/route.ts
├── .env.example
├── .nvmrc                      # Node 22 (requerido por Prisma 7)
├── tsconfig.json               # strict, paths: @/* → ./src/*
└── package.json
```

---

## 3. Responsabilidad de cada capa

### Route Handlers (`src/app/api`)
- Reciben `NextRequest`, leen body/query, leen cookies
- Validan con el schema Zod de la feature
- Verifican autenticación (cookie `access_token`)
- Invocan el servicio correspondiente
- Responden con `apiResponse` o capturan con `handleHttpError`
- **No** contienen reglas de negocio, Prisma ni React

### Services (`features/*/services`)
- Implementan los casos de uso
- Verifican reglas de negocio y lanzan errores de dominio
- Coordinan repositorios
- **No** importan `NextRequest`, `NextResponse` ni Prisma

### Repositories (`features/*/repositories`)
- Encapsulan todas las queries Prisma
- Transforman registros al tipo de dominio
- Gestionan transacciones (especialmente `bids`)
- **No** contienen reglas de negocio

### Schemas (`features/*/schemas`)
- Definen la forma de los datos de entrada con Zod
- Los DTOs se infieren: `type Foo = z.infer<typeof FooSchema>`

### Lib compartida (`src/lib`)

| Módulo | Responsabilidad |
|--------|----------------|
| `lib/db` | Singleton PrismaClient con gestión de HMR |
| `lib/env` | Validación y acceso tipado a `process.env` |
| `lib/errors` | Jerarquía base `AppError` |
| `lib/http` | `apiResponse`, `handleHttpError`, `HttpStatus` |
| `lib/security` | `hashPassword`, `comparePasswords`, `signToken`, `verifyToken` |

---

## 4. Convenciones de importación

```typescript
// Siempre usar el alias @/
import { prisma } from "@/lib/db";
import { apiResponse } from "@/lib/http";
import { RegisterSchema } from "@/features/auth/schemas";
import type { AuctionDetail } from "@/features/auctions/types";
```

**Regla de dependencias entre features:**
- `features/admin` puede invocar services de `features/auctions`
- `features/auctions` NO importa de `features/bids`
- `features/bids` NO importa de `features/auctions` (usa IDs)
- Todas las features pueden importar de `lib/*`

---

## 5. Flujo de autenticación

### Registro
```
POST /api/auth/register
  RegisterSchema.parse(body)
  authService.register(data)
    authRepository.findUserByEmail() → EmailAlreadyExistsError si existe
    security.hashPassword(password)
    authRepository.createUser()
  → 201 { user }
```

### Login
```
POST /api/auth/login
  LoginSchema.parse(body)
  authService.login(data)
    authRepository.findUserByEmail() → InvalidCredentialsError
    security.comparePasswords()      → InvalidCredentialsError
    security.signToken() → accessToken JWT (15m)
    crypto.randomUUID() → refreshToken opaco
    security.hashPassword(refreshToken) → hash
    authRepository.saveRefreshToken(userId, hash, expiresAt)
  → 200 { user }
  → Set-Cookie: access_token (HttpOnly, Secure, SameSite=Lax)
  → Set-Cookie: refresh_token (HttpOnly, Secure, SameSite=Strict, Path=/api/auth/refresh)
```

### Refresh (rotación)
```
POST /api/auth/refresh
  Leer cookie refresh_token
  authService.refresh(rawToken)
    hash(rawToken) → buscar en BD
    authRepository.findValidRefreshToken(hash) → RefreshTokenRevokedError
    authRepository.revokeRefreshToken(hash)  ← rotación
    Emitir nuevos accessToken + refreshToken
    authRepository.saveRefreshToken(userId, newHash, newExpiresAt)
  → 200 { user }
  → Set-Cookie: nuevas cookies
```

### Logout
```
POST /api/auth/logout
  Verificar access_token → extraer userId
  authService.logout(userId)
    authRepository.revokeAllRefreshTokens(userId)
  → 200 { null }
  → Set-Cookie: access_token=; expires=0
  → Set-Cookie: refresh_token=; expires=0
```

---

## 6. Estrategia de concurrencia para ofertas

El método `placeBid` usa **bloqueo pesimista** para evitar race conditions:

```typescript
await prisma.$transaction(async (tx) => {
  // SELECT ... FOR UPDATE bloquea la fila hasta el COMMIT
  const [auction] = await tx.$queryRaw<AuctionRow[]>`
    SELECT * FROM "Auction" WHERE id = ${auctionId} FOR UPDATE
  `;
  // Todas las validaciones se hacen sobre datos frescos
  // Insertar la oferta
  await tx.bid.create({ data: { auctionId, bidderId, amount } });
  // Actualizar precio, líder y extensión de tiempo
  await tx.auction.update({
    where: { id: auctionId },
    data: {
      currentPrice: amount,
      leadingBidderId: bidderId,
      // Extensión automática si quedan ≤5 min
      endsAt: extensionNeeded
        ? new Date(auction.endsAt.getTime() + 5 * 60 * 1000)
        : auction.endsAt,
    },
  });
}, { isolationLevel: "Serializable", maxWait: 5000, timeout: 10000 });
```

---

## 7. Manejo de errores

### Formato estándar
```json
{
  "success": false,
  "error": {
    "code": "AUCTION_HAS_BIDS",
    "message": "No se puede cancelar una subasta que ya tiene ofertas",
    "details": null
  }
}
```

### Jerarquía completa

| Clase | HTTP | Code |
|-------|------|------|
| `AppError` | 500 | `INTERNAL_SERVER_ERROR` |
| `ValidationError` | 400 | `VALIDATION_ERROR` |
| `UnauthorizedError` | 401 | `UNAUTHORIZED` |
| `ForbiddenError` | 403 | `FORBIDDEN` |
| `NotFoundError` | 404 | `NOT_FOUND` |
| `ConflictError` | 409 | `CONFLICT` |
| `InvalidCredentialsError` | 401 | `INVALID_CREDENTIALS` |
| `EmailAlreadyExistsError` | 409 | `EMAIL_ALREADY_EXISTS` |
| `TokenExpiredError` | 401 | `TOKEN_EXPIRED` |
| `RefreshTokenRevokedError` | 401 | `REFRESH_TOKEN_REVOKED` |
| `AuctionNotFoundError` | 404 | `AUCTION_NOT_FOUND` |
| `AuctionNotActiveError` | 409 | `AUCTION_NOT_ACTIVE` |
| `AuctionHasBidsError` | 409 | `AUCTION_HAS_BIDS` |
| `MaxActiveAuctionsError` | 409 | `MAX_ACTIVE_AUCTIONS_REACHED` |
| `AuctionOwnershipError` | 403 | `AUCTION_OWNERSHIP_VIOLATION` |
| `BidOnOwnAuctionError` | 403 | `BID_ON_OWN_AUCTION` |
| `BidTooLowError` | 422 | `BID_TOO_LOW` |
| `BidByLeaderError` | 409 | `BID_BY_CURRENT_LEADER` |
| `AuctionClosedForBidsError` | 409 | `AUCTION_CLOSED_FOR_BIDS` |
| `CategoryHasAuctionsError` | 409 | `CATEGORY_HAS_AUCTIONS` |

---

## 8. Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | Sí | Supabase Pooler (puerto 6543) |
| `DIRECT_URL` | No | Migraciones directas (puerto 5432) |
| `JWT_SECRET` | Sí | Mínimo 32 caracteres |
| `JWT_EXPIRES_IN` | No | Default `15m` |
| `REFRESH_TOKEN_EXPIRES_IN_DAYS` | No | Default `7` |
| `CRON_SECRET` | No | Endpoints de mantenimiento |
| `NEXT_PUBLIC_APP_URL` | No | Default `http://localhost:3000` |
| `NODE_ENV` | No | `development`/`production`/`test` |
| `SEED_ADMIN_EMAIL` | Solo seed | No versionar con valor real |
| `SEED_ADMIN_PASSWORD` | Solo seed | No versionar con valor real |

---

## 9. Bloqueos y dependencias entre fases

| Pendiente | Bloquea | Fase |
|-----------|---------|------|
| Modelos Prisma definitivos | Implementaciones de repositorios | 3 |
| `AuthService` implementado | Todos los endpoints protegidos | 3 |
| `BidRepository` transaccional | POST /api/auctions/[id]/bids | 3 |
| Helper `withAuth` | Route Handlers autenticados | 3 |
| Middleware de rol ADMIN | Endpoints admin | 3 |
| Páginas UI | App completa | 4 |

---

## 10. Decisiones pendientes

| Decisión | Recomendación |
|----------|---------------|
| `withAuth` como HOF vs `middleware.ts` | HOF explícito en cada handler; middleware.ts para redirect de páginas |
| Sesión única vs multidispositivo | Tabla `RefreshToken` con `revokedAt` permite múltiples sesiones |
| Notificación al ganador | Email via Resend (Fase 4); polling como interim |
| Caché de categorías | `unstable_cache` Next.js con revalidación por etiqueta (Fase 4) |

---

## 11. Bloqueo activo: Node.js

> **Problema:** Node.js 18 (system) no es compatible con Prisma 7 (requiere ≥ 20).  
> **Solución actual:** Usar `nvm use 22` o `source ~/.nvm/nvm.sh && nvm use 22` antes de ejecutar comandos Prisma.  
> **Estado:** `.nvmrc` contiene `22`. Verificar que CI/CD use la versión correcta.
