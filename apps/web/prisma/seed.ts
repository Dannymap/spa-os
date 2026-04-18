import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Servicios
  const services = await Promise.all([
    // Manos
    prisma.service.upsert({ where: { id: "svc-manos-1" }, update: {}, create: { id: "svc-manos-1", name: "Manicura clásica", category: "manos", durationMinutes: 45, price: 20, description: "Lima, cutículas y esmaltado tradicional" } }),
    prisma.service.upsert({ where: { id: "svc-manos-2" }, update: {}, create: { id: "svc-manos-2", name: "Manicura semipermanente", category: "manos", durationMinutes: 60, price: 28, description: "Esmaltado de larga duración hasta 3 semanas" } }),
    prisma.service.upsert({ where: { id: "svc-manos-3" }, update: {}, create: { id: "svc-manos-3", name: "Uñas acrílicas", category: "manos", durationMinutes: 90, price: 45, description: "Extensiones acrílicas completas con diseño" } }),
    prisma.service.upsert({ where: { id: "svc-manos-4" }, update: {}, create: { id: "svc-manos-4", name: "Relleno acrílico", category: "manos", durationMinutes: 60, price: 35, description: "Mantenimiento de uñas acrílicas" } }),
    prisma.service.upsert({ where: { id: "svc-manos-5" }, update: {}, create: { id: "svc-manos-5", name: "Uñas gel", category: "manos", durationMinutes: 75, price: 40, description: "Extensiones o recubrimiento en gel" } }),
    // Pies
    prisma.service.upsert({ where: { id: "svc-pies-1" }, update: {}, create: { id: "svc-pies-1", name: "Pedicura clásica", category: "pies", durationMinutes: 60, price: 28, description: "Hidratación, exfoliación y esmaltado" } }),
    prisma.service.upsert({ where: { id: "svc-pies-2" }, update: {}, create: { id: "svc-pies-2", name: "Pedicura semipermanente", category: "pies", durationMinutes: 75, price: 35, description: "Esmaltado semipermanente en pies" } }),
    prisma.service.upsert({ where: { id: "svc-pies-3" }, update: {}, create: { id: "svc-pies-3", name: "Pedicura spa", category: "pies", durationMinutes: 90, price: 42, description: "Tratamiento completo con masaje y mascarilla" } }),
    // Cejas
    prisma.service.upsert({ where: { id: "svc-cejas-1" }, update: {}, create: { id: "svc-cejas-1", name: "Depilación de cejas", category: "cejas", durationMinutes: 20, price: 12, description: "Diseño y depilación con hilo o pinzas" } }),
    prisma.service.upsert({ where: { id: "svc-cejas-2" }, update: {}, create: { id: "svc-cejas-2", name: "Tinte de cejas", category: "cejas", durationMinutes: 30, price: 15, description: "Tinte y diseño de cejas" } }),
    prisma.service.upsert({ where: { id: "svc-cejas-3" }, update: {}, create: { id: "svc-cejas-3", name: "Laminado de cejas", category: "cejas", durationMinutes: 45, price: 35, description: "Reestructura y fija los vellos de la ceja" } }),
    // Pestañas
    prisma.service.upsert({ where: { id: "svc-pest-1" }, update: {}, create: { id: "svc-pest-1", name: "Extensiones de pestañas", category: "pestanas", durationMinutes: 90, price: 55, description: "Extensiones pelo a pelo efecto natural" } }),
    prisma.service.upsert({ where: { id: "svc-pest-2" }, update: {}, create: { id: "svc-pest-2", name: "Lifting de pestañas", category: "pestanas", durationMinutes: 60, price: 40, description: "Permanente de pestañas con efecto rizador" } }),
    prisma.service.upsert({ where: { id: "svc-pest-3" }, update: {}, create: { id: "svc-pest-3", name: "Relleno de pestañas", category: "pestanas", durationMinutes: 60, price: 38, description: "Mantenimiento de extensiones cada 3 semanas" } }),
    // Depilación
    prisma.service.upsert({ where: { id: "svc-dep-1" }, update: {}, create: { id: "svc-dep-1", name: "Depilación labio superior", category: "depilacion", durationMinutes: 15, price: 8, description: "Con hilo o cera" } }),
    prisma.service.upsert({ where: { id: "svc-dep-2" }, update: {}, create: { id: "svc-dep-2", name: "Depilación facial completa", category: "depilacion", durationMinutes: 30, price: 22, description: "Cejas, labio y mentón" } }),
    // Packs
    prisma.service.upsert({ where: { id: "svc-pack-1" }, update: {}, create: { id: "svc-pack-1", name: "Pack manos + pies", category: "otros", durationMinutes: 120, price: 55, description: "Manicura y pedicura semipermanente" } }),
    prisma.service.upsert({ where: { id: "svc-pack-2" }, update: {}, create: { id: "svc-pack-2", name: "Pack belleza total", category: "otros", durationMinutes: 150, price: 75, description: "Manos + pies + cejas + depilación labio" } }),
  ]);

  console.log(`✅ ${services.length} servicios creados/actualizados`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
