import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dateStr = searchParams.get("date");       // "2026-04-20"
  const duration = Number(searchParams.get("duration") ?? 60);

  if (!dateStr) return NextResponse.json({ error: "date required" }, { status: 400 });

  const dayOfWeek = new Date(dateStr + "T12:00:00").getDay(); // local day

  // Check if there's a specific override for this date
  const override = await prisma.dayOverride.findUnique({ where: { date: dateStr } });

  let baseSlots: string[];

  if (override) {
    // Admin set specific slots for this day
    baseSlots = override.slots;
  } else {
    // Fall back to general schedule — 1-hour intervals
    const schedule = await prisma.workSchedule.findUnique({ where: { dayOfWeek } });
    if (!schedule || !schedule.isOpen) {
      return NextResponse.json({ available: false, slots: [], source: "schedule" });
    }
    const [openH, openM] = schedule.openTime.split(":").map(Number);
    const [closeH, closeM] = schedule.closeTime.split(":").map(Number);
    const openMin = openH * 60 + openM;
    const closeMin = closeH * 60 + closeM;

    baseSlots = [];
    for (let m = openMin; m + duration <= closeMin; m += 60) {
      baseSlots.push(`${Math.floor(m / 60).toString().padStart(2, "0")}:${(m % 60).toString().padStart(2, "0")}`);
    }
  }

  // Remove already-booked slots
  const dayStart = new Date(dateStr + "T00:00:00.000Z");
  const dayEnd   = new Date(dateStr + "T23:59:59.999Z");

  const bookings = await prisma.booking.findMany({
    where: { date: { gte: dayStart, lte: dayEnd }, status: { not: "cancelada" } },
    include: { service: { select: { durationMinutes: true } } },
  });

  const blocked = new Set<number>();
  for (const b of bookings) {
    const d = new Date(b.date);
    const bStart = d.getUTCHours() * 60 + d.getUTCMinutes();
    for (let m = bStart; m < bStart + b.service.durationMinutes; m++) blocked.add(m);
  }

  const available = baseSlots.filter((slot) => {
    const [h, min] = slot.split(":").map(Number);
    const start = h * 60 + min;
    for (let m = start; m < start + duration; m++) {
      if (blocked.has(m)) return false;
    }
    return true;
  });

  return NextResponse.json({
    available: true,
    slots: available,
    source: override ? "override" : "schedule",
  });
}
