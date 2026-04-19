import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const overrides = await prisma.dayOverride.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(overrides);
}

// PUT { date, slots } — upsert override for a date
export async function PUT(req: NextRequest) {
  const { date, slots } = await req.json() as { date: string; slots: string[] };
  if (slots.length === 0) {
    // Empty slots = delete override (fall back to schedule)
    await prisma.dayOverride.deleteMany({ where: { date } });
    return NextResponse.json({ deleted: true });
  }
  const override = await prisma.dayOverride.upsert({
    where: { date },
    update: { slots },
    create: { date, slots },
  });
  return NextResponse.json(override);
}

// DELETE ?date=2026-04-20
export async function DELETE(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });
  await prisma.dayOverride.deleteMany({ where: { date } });
  return NextResponse.json({ ok: true });
}
