import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_DAYS = [
  { dayOfWeek: 0, isOpen: false, openTime: "09:00", closeTime: "19:00" }, // Dom
  { dayOfWeek: 1, isOpen: true,  openTime: "09:00", closeTime: "19:00" }, // Lun
  { dayOfWeek: 2, isOpen: true,  openTime: "09:00", closeTime: "19:00" }, // Mar
  { dayOfWeek: 3, isOpen: true,  openTime: "09:00", closeTime: "19:00" }, // Mié
  { dayOfWeek: 4, isOpen: true,  openTime: "09:00", closeTime: "19:00" }, // Jue
  { dayOfWeek: 5, isOpen: true,  openTime: "09:00", closeTime: "20:00" }, // Vie
  { dayOfWeek: 6, isOpen: true,  openTime: "10:00", closeTime: "18:00" }, // Sáb
];

export async function GET() {
  let schedule = await prisma.workSchedule.findMany({ orderBy: { dayOfWeek: "asc" } });

  // Si no hay configuración aún, insertar los defaults
  if (schedule.length === 0) {
    await prisma.workSchedule.createMany({ data: DEFAULT_DAYS });
    schedule = await prisma.workSchedule.findMany({ orderBy: { dayOfWeek: "asc" } });
  }

  return NextResponse.json(schedule);
}

export async function PUT(req: NextRequest) {
  const days = await req.json() as Array<{ dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string }>;

  const results = await Promise.all(
    days.map((d) =>
      prisma.workSchedule.upsert({
        where: { dayOfWeek: d.dayOfWeek },
        update: { isOpen: d.isOpen, openTime: d.openTime, closeTime: d.closeTime },
        create: { dayOfWeek: d.dayOfWeek, isOpen: d.isOpen, openTime: d.openTime, closeTime: d.closeTime },
      })
    )
  );

  return NextResponse.json(results);
}
