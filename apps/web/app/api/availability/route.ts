import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dateStr = searchParams.get("date");       // "2026-04-20"
  const duration = Number(searchParams.get("duration") ?? 60);
  const excludeId = searchParams.get("excludeId") ?? null;
  const workerIdParam = searchParams.get("workerId") ?? null;

  if (!dateStr) return NextResponse.json({ error: "date required" }, { status: 400 });

  const dayOfWeek = new Date(dateStr + "T12:00:00").getDay();

  const override = await prisma.dayOverride.findUnique({ where: { date: dateStr } });

  let baseSlots: string[];

  if (override) {
    baseSlots = override.slots;
  } else {
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

  // Use local-time day boundaries
  const dayStart = new Date(dateStr + "T00:00:00");
  const dayEnd   = new Date(dateStr + "T23:59:59.999");

  const workers = await prisma.worker.findMany({ where: { active: true }, select: { id: true } });
  const workerIds = workers.map((w) => w.id);

  function minutesBlocked(bookings: { date: Date; service: { durationMinutes: number } }[]): Set<number> {
    const blocked = new Set<number>();
    for (const b of bookings) {
      const bStart = b.date.getHours() * 60 + b.date.getMinutes();
      for (let m = bStart; m < bStart + b.service.durationMinutes; m++) blocked.add(m);
    }
    return blocked;
  }

  function filterSlots(blocked: Set<number>): string[] {
    return baseSlots.filter((slot) => {
      const [h, min] = slot.split(":").map(Number);
      const start = h * 60 + min;
      for (let m = start; m < start + duration; m++) {
        if (blocked.has(m)) return false;
      }
      return true;
    });
  }

  // Case 1: specific worker requested (admin creating/checking a booking)
  if (workerIdParam) {
    const bookings = await prisma.booking.findMany({
      where: {
        workerId: workerIdParam,
        date: { gte: dayStart, lte: dayEnd },
        status: { not: "cancelada" },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      include: { service: { select: { durationMinutes: true } } },
    });
    const available = filterSlots(minutesBlocked(bookings));
    return NextResponse.json({ available: true, slots: available, source: override ? "override" : "schedule" });
  }

  // Case 2: no workers configured → original behavior (block on any booking)
  if (workerIds.length === 0) {
    const bookings = await prisma.booking.findMany({
      where: {
        date: { gte: dayStart, lte: dayEnd },
        status: { not: "cancelada" },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      include: { service: { select: { durationMinutes: true } } },
    });
    const available = filterSlots(minutesBlocked(bookings));
    return NextResponse.json({ available: true, slots: available, source: override ? "override" : "schedule" });
  }

  // Case 3: workers exist, no specific worker (client view) → slot available if at least one worker is free
  const allBookings = await prisma.booking.findMany({
    where: {
      date: { gte: dayStart, lte: dayEnd },
      status: { not: "cancelada" },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    include: { service: { select: { durationMinutes: true } } },
  });

  // Bookings without a worker assigned block all workers (legacy data)
  const legacyBlocked = minutesBlocked(allBookings.filter((b) => !b.workerId));

  const available = baseSlots.filter((slot) => {
    const [h, min] = slot.split(":").map(Number);
    const start = h * 60 + min;

    // Check if any minute in this slot is blocked for all workers
    for (let m = start; m < start + duration; m++) {
      if (legacyBlocked.has(m)) return false;
    }

    // Slot is available if at least one worker has no overlap
    return workerIds.some((wid) => {
      const workerBookings = allBookings.filter((b) => b.workerId === wid);
      for (const b of workerBookings) {
        const bStart = b.date.getHours() * 60 + b.date.getMinutes();
        for (let m = bStart; m < bStart + b.service.durationMinutes; m++) {
          if (m >= start && m < start + duration) return false;
        }
      }
      return true;
    });
  });

  return NextResponse.json({ available: true, slots: available, source: override ? "override" : "schedule" });
}
