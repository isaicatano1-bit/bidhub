import { existsSync } from "node:fs";
import bcrypt from "bcryptjs";

if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

const { prisma } = await import("../src/lib/db/index");

const categories = [
  { name: "Monedas y Billetes", slug: "monedas-billetes", description: "Numismatica y billetes de coleccion" },
  { name: "Sellos", slug: "sellos", description: "Filatelia y sellos postales" },
  { name: "Arte y Pinturas", slug: "arte-pinturas", description: "Obras de arte y reproducciones" },
  { name: "Joyería Antigua", slug: "joyeria-antigua", description: "Joyas y accesorios de epoca" },
  { name: "Libros Raros", slug: "libros-raros", description: "Primeras ediciones y manuscritos" },
];

async function main(): Promise<void> {
  const seededCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      }),
    ),
  );

  let adminId: string | undefined;
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        name: "Administrador BidHub",
        passwordHash,
        role: "ADMIN",
      },
    });
    adminId = admin.id;
  } else if (adminEmail || adminPassword) {
    throw new Error("Configura SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD juntos.");
  }

  const demoPassword = process.env.SEED_DEMO_USER_PASSWORD;
  let demoUserId: string | undefined;
  if (demoPassword) {
    const passwordHash = await bcrypt.hash(demoPassword, 12);
    const demoUser = await prisma.user.upsert({
      where: { email: "demo@bidhub.local" },
      update: {},
      create: {
        email: "demo@bidhub.local",
        name: "Coleccionista de prueba",
        passwordHash,
      },
    });
    demoUserId = demoUser.id;
  }

  if (adminId && demoUserId) {
    const category = seededCategories[0];
    if (!category) throw new Error("Falta la categoría de muestra requerida.");
    const publishedAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const fixtures = [
      {
        id: "a14d6142-49b5-4b75-a372-697f70e95801",
        title: "Lote de monedas conmemorativas",
        status: "ACTIVE" as const,
        endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "a14d6142-49b5-4b75-a372-697f70e95802",
        title: "Billete historico de coleccion",
        status: "CLOSED" as const,
        endsAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: "a14d6142-49b5-4b75-a372-697f70e95803",
        title: "Moneda antigua sin ofertas",
        status: "UNSOLD" as const,
        endsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "a14d6142-49b5-4b75-a372-697f70e95804",
        title: "Lote cancelado de muestra",
        status: "CANCELLED" as const,
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    ];

    for (const fixture of fixtures) {
      await prisma.auction.upsert({
        where: { id: fixture.id },
        update: {},
        create: {
          ...fixture,
          description: "Elemento de ejemplo creado por el seed de desarrollo.",
          startingPrice: "10.00",
          minimumIncrement: "1.00",
          publishedAt,
          sellerId: demoUserId,
          categoryId: category.id,
          ...(fixture.status === "CANCELLED"
            ? { cancellationReason: "Cancelacion de ejemplo del seed." }
            : {}),
        },
      });
    }

    const auditId = "c14d6142-49b5-4b75-a372-697f70e95804";
    const existingAudit = await prisma.adminAuditLog.findUnique({ where: { id: auditId } });
    if (!existingAudit) {
      await prisma.adminAuditLog.create({
        data: {
          id: auditId,
          actorId: adminId,
          auctionId: fixtures[3]!.id,
          action: "AUCTION_CANCELLED",
          reason: "Cancelacion de ejemplo del seed.",
        },
      });
    }

    const closedBidId = "b14d6142-49b5-4b75-a372-697f70e95802";
    const existingBid = await prisma.bid.findUnique({ where: { id: closedBidId } });
    if (!existingBid) {
      await prisma.bid.create({
        data: {
          id: closedBidId,
          amount: "12.00",
          auctionId: fixtures[1]!.id,
          bidderId: adminId,
        },
      });
    }
  }

  console.info(`Seed completo: ${seededCategories.length} categorias verificadas.`);
  if (!adminId) console.info("Admin omitido; configura SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD para crearlo.");
  if (!demoUserId) console.info("Fixtures omitidos; configura SEED_DEMO_USER_PASSWORD para habilitarlos.");
}

main()
  .catch((error: unknown) => {
    console.error("Error ejecutando el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });