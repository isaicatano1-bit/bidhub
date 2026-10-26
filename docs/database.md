# BidHub: Prisma y PostgreSQL

## Arquitectura

La capa de acceso a datos utiliza Prisma ORM 7 con PostgreSQL. El cliente compartido está en `src/lib/db/index.ts`, usa `@prisma/adapter-pg` y un pool de hasta 10 conexiones, y está marcado `server-only`. Los servicios y repositorios del backend pueden importarlo desde `@/lib/db`; no debe importarse desde componentes cliente. `prisma.config.ts` carga `.env` con la API nativa de Node 22 y configura `DIRECT_URL` para las tareas de Prisma CLI. En runtime, el adapter lee `DATABASE_URL`.

Este cambio prepara el esquema y la infraestructura; no conecta los Route Handlers a repositorios ni implementa las reglas completas de negocio.

## Modelos y relaciones

- `User`: UUID, nombre, email único, hash de contraseña, rol `USER`/`ADMIN`, estado de cuenta y fechas. El alta pública debe fijar `USER` en el servicio, nunca aceptar el rol del cliente.
- `RefreshToken`: hash único del token opaco, usuario, expiración y revocación. El token original no se persiste.
- `Category`: nombre y slug únicos, descripción y fechas. Las relaciones de subasta usan `Restrict`, así que una categoría con subastas no se puede borrar accidentalmente.
- `Auction`: vendedor, categoría, importes `Decimal(12,2)`, publicación, cierre, estado, razón de cancelación y contador de extensiones.
- `Bid`: historial asociado a una subasta y a un usuario, con importe `Decimal(12,2)` y fecha. Las claves foráneas `Restrict` preservan el historial; no se definen operaciones de edición o borrado normal.
- `AdminAuditLog`: actor administrador, subasta, acción, motivo y fecha. Registra acciones de moderación importantes y complementa el estado/motivo actual de la subasta sin duplicar un ganador.

Cardinalidades: usuario 1:N subastas publicadas, usuario 1:N ofertas, usuario 1:N refresh tokens, usuario 1:N acciones de auditoría; categoría 1:N subastas; subasta 1:N ofertas y 1:N registros de auditoría. El ganador se deriva de la oferta válida máxima; no se duplica como columna que pudiera quedar desincronizada.

## Índices e integridad

Hay índices para subastas por estado/cierre, vendedor/estado y categoría/estado; para ofertas por subasta/fecha, subasta/importe y usuario/fecha; para sesiones por usuario/revocación/expiración y auditoría por subasta o actor/fecha. Las claves primarias, únicas y foráneas están en el schema.

Prisma no expresa todas las restricciones `CHECK` de PostgreSQL. La migración inicial añade comprobaciones para importes positivos, incremento positivo y fecha de cierre entre una hora y siete días tras publicación. El límite de cinco subastas activas, normalización del email, estados coherentes con fecha/ofertas y razones de cancelación se validan en servicios/transacciones; reglas que dependen del estado global o del tiempo no son simples restricciones de fila.

Las ofertas concurrentes requieren una transacción serializable o bloqueo/advisory lock por subasta, y reintentos ante conflictos. Dentro de esa sección crítica se debe volver a leer estado, líder, incremento, cierre y vendedor, insertar la oferta y extender cinco minutos si procede. El líder no puede ofertar de nuevo; el vendedor no puede pujar; la primera oferta debe cubrir el inicio. El usuario normal solo cancela subastas propias sin ofertas; una cancelación administrativa con ofertas debe registrar motivo y auditoría en una sola transacción. Al consultar, una subasta `ACTIVE` cuya fecha terminó se presenta como `CLOSED` si tiene ofertas o `UNSOLD` si no tiene; el estado persistido se puede materializar transaccionalmente, pero no depende de un cron para la lectura correcta.

Las ofertas son inmutables también en PostgreSQL: la migración crea un trigger que rechaza `UPDATE` y `DELETE`. Las claves foráneas restrictivas impiden eliminar usuarios o subastas con historial relacionado.

## Entorno y Supabase

Copia `.env.example` a `.env` y reemplaza cada marcador localmente. No compartas ni subas `.env`.

- `DATABASE_URL`: runtime del backend, sugerido el pooler de transacciones Supabase (normalmente puerto `6543`). Copia host, usuario, opciones TLS y demás parámetros exactos del panel. `pgbouncer=true` puede depender del modo/configuración elegidos; no inventes ni reutilices el formato de otra conexión.
- `DIRECT_URL`: Prisma Migrate/DDL. Usa el endpoint directo (normalmente `5432`) si la red lo permite. Si el entorno no admite IPv6/conexión directa, Supabase ofrece session pooler, con host/puerto/usuario distintos. Obtén y configura esta cadena por separado; no es necesariamente igual a `DATABASE_URL`.
- `JWT_SECRET`: secreto de firma independiente de las credenciales de PostgreSQL. Genera uno localmente con `openssl rand -base64 32`.
- `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD`: ambos opcionales; sin ambos no se crea admin. Utiliza credenciales locales controladas, nunca credenciales predeterminadas de producción.
- `SEED_DEMO_USER_PASSWORD`: habilita usuario y subastas fixture de desarrollo. No tiene valor predeterminado.

La configuración observada en este entorno no acredita una conexión funcional: el endpoint directo del archivo `.env` aún es un marcador incompleto. No se ha probado conexión a Supabase.

## Comandos

```sh
npm run prisma:generate
npm run prisma:validate
npm run prisma:format
npm run typecheck
```

Crear una migración de desarrollo (requiere base configurada y accesible para migrate):

```sh
npm run prisma:migrate:dev -- --name init
```

Aplicar migraciones ya creadas en un entorno autorizado:

```sh
npm run prisma:migrate:deploy
```

Ejecutar el seed en una base local/de desarrollo autorizada:

```sh
npm run prisma:seed
```

El seed hace upsert de categorías por slug. Las cuentas y fixtures se crean solamente con las variables opcionales descritas; los IDs de fixtures son estables para evitar duplicados. Antes de ejecutarlo, comprueba que las URLs apunten a una base de desarrollo, no a datos compartidos.

## Comprobar conexión sin revelar secretos

Configura `.env` con las cadenas suministradas por Supabase. Para probar la conexión directa usada por Prisma CLI, ejecuta `printf 'SELECT 1;' | npx prisma db execute --stdin`; Prisma informa éxito o error, sin imprimir filas ni URL. Para probar el endpoint runtime sin migrar, ejecuta:

```sh
node --env-file=.env --input-type=module -e 'import pg from "pg"; const client = new pg.Client({ connectionString: process.env.DATABASE_URL }); try { await client.connect(); await client.query("SELECT 1"); console.log("DATABASE_URL: conexión correcta"); } finally { await client.end(); }'
```

Ambas pruebas son de solo lectura. No uses `migrate deploy` ni `db push` como prueba de conexión: pueden cambiar el esquema. La generación y validación del schema son locales y no prueban conectividad.

## Estado de esta fase

Prisma Client se genera localmente y el schema se valida. No se ha generado ni aplicado una migración remota, no se ha ejecutado el seed y la conexión Supabase está pendiente de URLs válidas y autorización explícita. Para crear la migración inicial, primero confirma las URLs de desarrollo y solicita aprobación antes de cualquier operación sobre una base remota.
