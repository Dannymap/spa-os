import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Returns available time slots for a given date + service duration
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dateStr = searchParams.get("date");      // "2026-04-20"
  const duration = Number(searchParams.get("duration") ?? 60); // minutes

  if (!dateStr) return NextResponse.json({ error: "date required" }, { status: 400 });

  const date = new Date(dateStr);
  const dayOfWeek = date.getUTCDay(); // 0=Sun ... 6=Sat

  const schedule = await prisma.workSchedule.findUnique({ where: { dayOfWeek } });

  if (!schedule || !schedule.isOpen) {
    return NextResponse.json({ available: false, slots: [] });
  }

  // Generate all possible slots for the day
  const [openH, openM] = schedule.openTime.split(":").map(Number);
  const [closeH, closeM] = schedule.closeTime.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const slots: string[] = [];
  for (let m = openMinutes; m + duration <= closeMinutes; m += 30) {
    const h = Math.floor(m / 60).toString().padStart(2, "0");
    const min = (m % 60).toString().padStart(2, "0");
    slots.push(`${h}:${min}`);
  }

  // Find bookings that day to block occupied slots
  const dayStart = new Date(dateStr + "T00:00:00.000Z");
  const dayEnd   = new Date(dateStr + "T23:59:59.999Z");

  const bookings = await prisma.booking.findMany({
    where: {
      date: { gte: dayStart, lte: dayEnd },
      status: { not: "cancelada" },
    },
    include: { service: { select: { durationMinutes: true } } },
  });

  // Build set of blocked minutes
  const blocked = new Set<number>();
  for (const b of bookings) {
    const bDate = new Date(b.date);
    const bStart = bDate.getUTCHours() * 60 + bDate.getUTCMinutes();
    const bEnd = bStart + b.service.durationMinutes;
    for (let m = bStart; m < bEnd; m++) blocked.add(m);
  }

  const available = slots.filter((slot) => {
    const [h, min] = slot.split(":").map(Number);
    const start = h * 60 + min;
    for (let m = start; m < start + duration; m++) {
      if (blocked.has(m)) return false;
    }
    return true;
  });

  return NextResponse.json({ available: true, slots: available, openTime: schedule.openTime, closeTime: schedule.closeTime });
}
