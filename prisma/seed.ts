/**
 * BIDHUB — Prisma Seed
 * Datos iniciales: categorías base y usuario ADMIN.
 *
 * Uso: npx prisma migrate dev --name seed
 * O directamente: npx tsx prisma/seed.ts
 *
 * ESTADO: Estructura lista. La ejecución requiere los modelos definitivos (Fase 3).
 */

// TODO (Fase 3): Descomentar e implementar tras definir los modelos Prisma.
//
// import prisma from "@/lib/db";
// import bcrypt from "bcryptjs";
//
// async function main() {
//   // ── Categorías base ────────────────────────────────────────────────────
//   const categories = [
//     { name: "Monedas y Billetes", slug: "monedas-billetes", description: "Numismática y billetes de colección" },
//     { name: "Sellos", slug: "sellos", description: "Filatelia y sellos postales" },
//     { name: "Arte y Pinturas", slug: "arte-pinturas", description: "Obras de arte originales y reproducciones" },
//     { name: "Joyería Antigua", slug: "joyeria-antigua", description: "Joyas y accesorios de época" },
//     { name: "Libros Raros", slug: "libros-raros", description: "Primeras ediciones y manuscritos" },
//     { name: "Juguetes Vintage", slug: "juguetes-vintage", description: "Juguetes y figuras retro" },
//     { name: "Relojes de Colección", slug: "relojes-coleccion", description: "Relojes históricos y de lujo" },
//     { name: "Cerámica y Porcelana", slug: "ceramica-porcelana", description: "Piezas de cerámica y porcelana artesanal" },
//   ];
//
//   for (const cat of categories) {
//     await prisma.category.upsert({
//       where: { slug: cat.slug },
//       update: {},
//       create: cat,
//     });
//   }
//
//   // ── Usuario ADMIN ───────────────────────────────────────────────────────
//   // El rol ADMIN SOLO se asigna mediante seed. No existe endpoint de registro de admin.
//   const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@bidhub.local";
//   const adminPassword = process.env.SEED_ADMIN_PASSWORD;
//
//   if (!adminPassword) {
//     console.warn("⚠️  SEED_ADMIN_PASSWORD no definida. Saltando creación de admin.");
//   } else {
//     const passwordHash = await bcrypt.hash(adminPassword, 12);
//     await prisma.user.upsert({
//       where: { email: adminEmail },
//       update: {},
//       create: {
//         name: "Administrador BidHub",
//         email: adminEmail,
//         passwordHash,
//         role: "ADMIN",
//       },
//     });
//     console.log(`✅ Admin creado: ${adminEmail}`);
//   }
//
//   console.log(`✅ Categorías sembradas: ${categories.length}`);
// }
//
// main()
//   .catch(console.error)
//   .finally(async () => await prisma.$disconnect());

console.log("📌 Seed pendiente de implementación (Fase 3: Modelos Prisma).");
