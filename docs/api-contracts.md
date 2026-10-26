# BidHub — Contratos de API REST

> **Versión:** 2.0 · **Fecha:** 2026-10-26  
> **Formato de respuesta:** `application/json`  
> **Estado de endpoints:** Adaptadores HTTP listos. Lógica de negocio pendiente (Fase 3).

---

## Formato estándar de respuestas

### Respuesta exitosa
```json
{
  "success": true,
  "data": { },
  "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 }
}
```

### Respuesta de error
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

### Cookies de sesión

| Cookie | Tipo | Path | SameSite | Descripción |
|--------|------|------|----------|-------------|
| `access_token` | HttpOnly, Secure en prod | `/` | `Lax` | JWT (15 min) |
| `refresh_token` | HttpOnly, Secure en prod | `/api/auth/refresh` | `Strict` | Token opaco (7 días) |

> Los tokens **nunca** aparecen en el body de la respuesta ni en localStorage.

---

## Tabla resumen de endpoints

| Método | URL | Módulo | Acceso | Schema | Servicio |
|--------|-----|--------|--------|--------|---------|
| POST | /api/auth/register | auth | Público | RegisterSchema | authService.register |
| POST | /api/auth/login | auth | Público | LoginSchema | authService.login |
| POST | /api/auth/refresh | auth | Cookie refresh_token | — | authService.refresh |
| POST | /api/auth/logout | auth | Cookie access_token | — | authService.logout |
| GET | /api/auth/me | auth | Autenticado | — | authService.getCurrentUser |
| GET | /api/auctions | auctions | Público | ListAuctionsQuerySchema | auctionService.listAuctions |
| POST | /api/auctions | auctions | Autenticado | CreateAuctionSchema | auctionService.createAuction |
| GET | /api/auctions/mine | auctions | Autenticado | ListAuctionsQuerySchema (parcial) | auctionService.getMyAuctions |
| GET | /api/auctions/[id] | auctions | Público | — | auctionService.getAuctionById |
| PATCH | /api/auctions/[id] | auctions | Autenticado (propietario) | UpdateAuctionSchema | auctionService.updateAuction |
| POST | /api/auctions/[id]/cancel | auctions | Autenticado | AdminCancelAuctionSchema (ADMIN) | auctionService.cancelAuction |
| GET | /api/auctions/[id]/bids | bids | Público | ListBidsQuerySchema | bidService.getPublicBidHistory |
| POST | /api/auctions/[id]/bids | bids | Autenticado | PlaceBidSchema | bidService.placeBid |
| GET | /api/bids/mine | bids | Autenticado | ListBidsQuerySchema | bidService.getMyBids |
| GET | /api/categories | categories | Público | — | categoryService.listCategories |
| POST | /api/categories | categories | ADMIN | CreateCategorySchema | categoryService.createCategory |
| PATCH | /api/categories/[id] | categories | ADMIN | UpdateCategorySchema | categoryService.updateCategory |
| DELETE | /api/categories/[id] | categories | ADMIN | — | categoryService.deleteCategory |
| GET | /api/admin/auctions | admin→auctions | ADMIN | ListAuctionsQuerySchema | auctionService.listAuctionsForAdmin |
| POST | /api/admin/auctions/[id]/cancel | admin→auctions | ADMIN | AdminCancelAuctionSchema | auctionService.cancelAuction |

> **Nota de rutas:** `GET /api/auctions/mine` NO colisiona con `GET /api/auctions/[id]` porque Next.js App Router resuelve segmentos literales antes que dinámicos.

---

## Contratos detallados

---

### POST /api/auth/register

**Módulo:** `features/auth`  
**Acceso:** Público  
**Reglas:** El correo no puede estar registrado. El rol es siempre `USER`.

**Body:**
```json
{
  "name": "Juan Coleccionista",
  "email": "juan@example.com",
  "password": "Segura123"
}
```

**Schema Zod:** `RegisterSchema`
- `name`: string, 2–100 chars
- `email`: email válido (normalizado a minúsculas)
- `password`: 8–128 chars, debe contener mayúscula, minúscula y dígito

**Respuesta 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Juan Coleccionista",
      "email": "juan@example.com",
      "role": "USER",
      "createdAt": "2026-10-26T10:00:00.000Z"
    }
  }
}
```

**Errores:**
| HTTP | Code | Cuándo |
|------|------|--------|
| 400 | `VALIDATION_ERROR` | Body inválido |
| 409 | `EMAIL_ALREADY_EXISTS` | El correo ya está registrado |

---

### POST /api/auth/login

**Módulo:** `features/auth`  
**Acceso:** Público

**Body:**
```json
{ "email": "juan@example.com", "password": "Segura123" }
```

**Schema Zod:** `LoginSchema`

**Respuesta 200:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "name": "Juan", "email": "juan@example.com", "role": "USER" }
  }
}
```
*Cookies `access_token` y `refresh_token` se establecen en la respuesta.*

**Errores:**
| HTTP | Code | Cuándo |
|------|------|--------|
| 400 | `VALIDATION_ERROR` | Body inválido |
| 401 | `INVALID_CREDENTIALS` | Correo o contraseña incorrectos |

---

### POST /api/auth/refresh

**Módulo:** `features/auth`  
**Acceso:** Cookie `refresh_token` válida  
**Comportamiento:** Rota el refresh token (invalida el actual, emite uno nuevo)

**Respuesta 200:** igual que login (usuario + nuevas cookies)

**Errores:**
| HTTP | Code | Cuándo |
|------|------|--------|
| 401 | `UNAUTHORIZED` | Cookie ausente |
| 401 | `REFRESH_TOKEN_REVOKED` | Token revocado o expirado |
| 401 | `INVALID_TOKEN` | Token no encontrado en BD |

---

### POST /api/auth/logout

**Módulo:** `features/auth`  
**Acceso:** Cookie `access_token` (idempotente sin sesión)

**Respuesta 200:** `{ "success": true, "data": null }`  
*Elimina ambas cookies y revoca todos los refresh tokens del usuario.*

---

### GET /api/auth/me

**Módulo:** `features/auth`  
**Acceso:** Cookie `access_token`

**Respuesta 200:** `{ "success": true, "data": { "user": { ... } } }`

**Errores:**
| HTTP | Code | Cuándo |
|------|------|--------|
| 401 | `UNAUTHORIZED` | Cookie ausente o JWT inválido |
| 401 | `TOKEN_EXPIRED` | JWT expirado |

---

### GET /api/auctions

**Módulo:** `features/auctions`  
**Acceso:** Público  
**Default:** Solo subastas `ACTIVE`

**Query params:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `page` | number | 1 | Página |
| `limit` | number | 20 | Máx 50 |
| `categoryId` | UUID | — | Filtrar por categoría |
| `status` | enum | `ACTIVE` | ACTIVE/CLOSED/UNSOLD/CANCELLED |
| `sort` | enum | `endsAt` | endsAt/currentPrice/createdAt |
| `order` | enum | `asc` | asc/desc |
| `search` | string | — | Búsqueda en título/descripción |

**Respuesta 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Moneda de oro 1920",
      "startingPrice": 100.00,
      "currentPrice": 150.00,
      "endsAt": "2026-10-28T18:00:00.000Z",
      "status": "ACTIVE",
      "categoryName": "Monedas y Billetes",
      "sellerAlias": "Col***",
      "totalBids": 3
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 }
}
```

---

### POST /api/auctions

**Módulo:** `features/auctions`  
**Acceso:** Autenticado (cualquier USER)  
**Schema Zod:** `CreateAuctionSchema`

**Body:**
```json
{
  "title": "Moneda de plata República 1952",
  "description": "Excelente estado de conservación, certificada por experto numismático.",
  "imageUrl": "https://example.com/img/moneda.jpg",
  "startingPrice": 80.00,
  "minimumIncrement": 5.00,
  "endsAt": "2026-10-28T20:00:00.000Z",
  "categoryId": "uuid-categoria"
}
```

**Reglas de negocio:**
1. `startingPrice` > 0
2. `minimumIncrement` > 0
3. `endsAt` entre 1h y 7 días desde el momento de publicación
4. `categoryId` debe existir en la BD
5. El vendedor no puede tener más de 5 subastas `ACTIVE` simultáneas

**Respuesta 201:** `{ "success": true, "data": { auction } }`

**Errores:**
| HTTP | Code | Cuándo |
|------|------|--------|
| 400 | `VALIDATION_ERROR` | Body inválido |
| 401 | `UNAUTHORIZED` | No autenticado |
| 404 | `CATEGORY_NOT_FOUND` | Categoría no existe |
| 409 | `MAX_ACTIVE_AUCTIONS_REACHED` | Límite de 5 subastas activas |

---

### GET /api/auctions/mine

**Módulo:** `features/auctions`  
**Acceso:** Autenticado (devuelve solo las subastas del vendedor autenticado)

**Query params:** `page`, `limit`, `status`

**Respuesta 200:** misma estructura paginada que `GET /api/auctions`

---

### GET /api/auctions/[id]

**Módulo:** `features/auctions`  
**Acceso:** Público  

**Respuesta 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Moneda de plata República 1952",
    "currentPrice": 100.00,
    "status": "ACTIVE",
    "endsAt": "2026-10-28T20:00:00.000Z",
    "totalBids": 2,
    "extensionCount": 0
  }
}
```

**Errores:**
| HTTP | Code | Cuándo |
|------|------|--------|
| 404 | `AUCTION_NOT_FOUND` | ID no existe |

---

### PATCH /api/auctions/[id]

**Módulo:** `features/auctions`  
**Acceso:** Autenticado, solo el propietario  
**Schema Zod:** `UpdateAuctionSchema` (partial de `CreateAuctionSchema`)

**Reglas:**
- Subasta en estado `ACTIVE`
- Sin ofertas registradas
- Solo el propietario puede editar

**Errores:**
| HTTP | Code | Cuándo |
|------|------|--------|
| 401 | `UNAUTHORIZED` | No autenticado |
| 403 | `AUCTION_OWNERSHIP_VIOLATION` | No es el propietario |
| 404 | `AUCTION_NOT_FOUND` | Subasta no existe |
| 409 | `AUCTION_NOT_ACTIVE` | Estado != ACTIVE |
| 409 | `AUCTION_HAS_BIDS` | Tiene ofertas |

---

### POST /api/auctions/[id]/cancel

**Módulo:** `features/auctions`  
**Acceso:** Autenticado

**Body (USER):** `{}` (vacío)  
**Body (ADMIN):** `{ "reason": "Descripción del motivo de cancelación" }`

**Reglas:**
- USER: solo cancela la propia subasta `ACTIVE` sin ofertas
- ADMIN: puede cancelar cualquier subasta `ACTIVE`, motivo obligatorio (10–500 chars)
- Historial se conserva

**Respuesta 200:** `{ "success": true, "data": null }`

**Errores:**
| HTTP | Code | Cuándo |
|------|------|--------|
| 400 | `VALIDATION_ERROR` | ADMIN sin reason válido |
| 401 | `UNAUTHORIZED` | No autenticado |
| 403 | `AUCTION_OWNERSHIP_VIOLATION` | USER intenta cancelar subasta ajena |
| 404 | `AUCTION_NOT_FOUND` | Subasta no existe |
| 409 | `AUCTION_NOT_ACTIVE` | Ya cerrada/cancelada |
| 409 | `AUCTION_HAS_BIDS` | USER intenta cancelar con ofertas |

---

### GET /api/auctions/[id]/bids

**Módulo:** `features/bids`  
**Acceso:** Público  
**Privacidad:** Alias parcial (ej: `"Jua***"`), sin nombre completo ni correo

**Respuesta 200:**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "amount": 100.00, "bidderAlias": "Jua***", "createdAt": "2026-10-27T…" }
  ],
  "meta": { "page": 1, "limit": 50, "total": 3 }
}
```

---

### POST /api/auctions/[id]/bids

**Módulo:** `features/bids`  
**Acceso:** Autenticado  
**Schema Zod:** `PlaceBidSchema`

**Body:** `{ "amount": 105.00 }`

**Reglas:**
1. La subasta debe estar `ACTIVE` y no haber expirado (`endsAt > now()`)
2. El postor no puede ser el vendedor
3. El postor no puede ser el líder actual
4. Si es la primera oferta: `amount >= startingPrice`
5. Si no es la primera: `amount >= currentPrice + minimumIncrement`
6. Si `endsAt - now() <= 5min`: extender `endsAt` +5 minutos (repetible)
7. Operación dentro de transacción con `SELECT ... FOR UPDATE`

**Respuesta 201:**
```json
{
  "success": true,
  "data": {
    "bid": { "id": "uuid", "amount": 105.00, "createdAt": "…" },
    "newCurrentPrice": 105.00,
    "newEndsAt": "2026-10-28T20:05:00.000Z",
    "wasExtended": true
  }
}
```

**Errores:**
| HTTP | Code | Cuándo |
|------|------|--------|
| 401 | `UNAUTHORIZED` | No autenticado |
| 403 | `BID_ON_OWN_AUCTION` | Vendedor ofertando en su subasta |
| 404 | `AUCTION_NOT_FOUND` | Subasta no existe |
| 409 | `AUCTION_CLOSED_FOR_BIDS` | Estado != ACTIVE |
| 409 | `BID_BY_CURRENT_LEADER` | Ya es el líder |
| 422 | `BID_TOO_LOW` | Monto insuficiente |

---

### GET /api/bids/mine

**Módulo:** `features/bids`  
**Acceso:** Autenticado  
**Datos:** Historial completo (incluyendo `bidderId` y `auctionId`)

**Respuesta 200:** lista paginada de `BidPrivateView`

---

### GET /api/categories

**Módulo:** `features/categories`  
**Acceso:** Público  
**Nota:** Sin paginación (lista completa para menú y filtros)

**Respuesta 200:**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Monedas y Billetes", "slug": "monedas-billetes" }
  ]
}
```

---

### POST /api/categories

**Módulo:** `features/categories`  
**Acceso:** Solo ADMIN  
**Schema:** `CreateCategorySchema`

**Body:** `{ "name": "Sellos", "slug": "sellos", "description": "Filatelia" }`

**Respuesta 201:** `{ "success": true, "data": { category } }`

**Errores:**
| HTTP | Code | Cuándo |
|------|------|--------|
| 401 | `UNAUTHORIZED` | No autenticado |
| 403 | `FORBIDDEN` | No es ADMIN |
| 409 | `CATEGORY_SLUG_CONFLICT` | Slug ya en uso |

---

### PATCH /api/categories/[id]

**Módulo:** `features/categories`  
**Acceso:** Solo ADMIN  
**Schema:** `UpdateCategorySchema` (partial)

**Respuesta 200:** `{ "success": true, "data": { category } }`

---

### DELETE /api/categories/[id]

**Módulo:** `features/categories`  
**Acceso:** Solo ADMIN

**Regla:** No se puede eliminar si tiene subastas asociadas (cualquier estado)

**Respuesta 204:** sin body

**Errores:**
| HTTP | Code | Cuándo |
|------|------|--------|
| 409 | `CATEGORY_HAS_AUCTIONS` | Tiene subastas asociadas |

---

### GET /api/admin/auctions

**Módulo:** `features/admin` → `auctionService.listAuctionsForAdmin`  
**Acceso:** Solo ADMIN  
**Diferencia vs GET /api/auctions:** Incluye todos los estados y metadatos de cancelación

**Respuesta 200:** lista paginada con campos adicionales como `cancelReason`, `cancelledById`

---

### POST /api/admin/auctions/[id]/cancel

**Módulo:** `features/admin` → `auctionService.cancelAuction`  
**Acceso:** Solo ADMIN  
**Schema:** `AdminCancelAuctionSchema`

**Body:** `{ "reason": "Artículo falsificado según verificación interna" }`

**Reglas:**
- Puede cancelar cualquier subasta `ACTIVE`, incluso con ofertas
- El motivo es obligatorio (10–500 chars)

**Respuesta 200:** `{ "success": true, "data": null }`

---

## Colisiones de rutas verificadas

| Ruta literal | Ruta dinámica | Resolución |
|---|---|---|
| `/api/auctions/mine` | `/api/auctions/[id]` | ✅ Next.js prioriza literales: `mine` no se confunde con un `[id]` |
| `/api/bids/mine` | — | ✅ Sin conflicto |
| `/api/admin/auctions` | `/api/auctions` | ✅ Prefijos diferentes, sin conflicto |

---

## Estados de subastas

| Estado | Descripción | Permite ofertas | Editable |
|--------|-------------|-----------------|----------|
| `ACTIVE` | En curso, aceptando ofertas | Sí | Sí (sin ofertas) |
| `CLOSED` | Expirada con al menos una oferta (hay ganador) | No | No |
| `UNSOLD` | Expirada sin ofertas (desierta) | No | No |
| `CANCELLED` | Cancelada por vendedor o admin | No | No |

**Determinación del ganador:** Al consultar o intentar ofertar, si `endsAt <= now()` y `totalBids > 0` → estado efectivo es `CLOSED` y ganador es `leadingBidderId`. Si `totalBids == 0` → estado efectivo es `UNSOLD`.

> El estado en BD se actualiza al momento de la consulta o mediante un job periódico. La lógica de detección de expiración no debe depender únicamente del valor almacenado.

---

## Reglas de privacidad implementadas

- `GET /api/auctions/[id]/bids` devuelve alias parcial: primeras 3 letras del nombre + `***`
- Nunca se expone `email` ni nombre completo en historial público
- `GET /api/bids/mine` solo devuelve ofertas del usuario autenticado
- El backend verifica propiedad/rol en cada endpoint, independientemente del frontend
