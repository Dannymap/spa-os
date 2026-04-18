import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const income = await prisma.income.findMany({
    where: {
      date: {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(to) : undefined,
      },
    },
    include: { booking: { include: { client: true, service: true } } },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(income);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const income = await prisma.income.create({
    data: {
      amount: body.amount,
      method: body.method ?? "efectivo",
      date: body.date ? new Date(body.date) : new Date(),
      description: body.description,
      bookingId: body.bookingId,
    },
  });
  return NextResponse.json(income, { status: 201 });
}
