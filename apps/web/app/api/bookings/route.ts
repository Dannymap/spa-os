import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const status = searchParams.get("status");

  let dateFilter = {};
  if (date) {
    const d = new Date(date);
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    dateFilter = { date: { gte: start, lte: end } };
  }

  const bookings = await prisma.booking.findMany({
    where: { ...dateFilter, ...(status ? { status } : {}) },
    include: { client: true, service: true, photos: true },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const booking = await prisma.booking.create({
    data: {
      clientId: body.clientId,
      serviceId: body.serviceId,
      date: new Date(body.date),
      status: body.status ?? "prevista",
      notes: body.notes,
      price: body.price,
    },
    include: { client: true, service: true },
  });
  return NextResponse.json(booking, { status: 201 });
}
