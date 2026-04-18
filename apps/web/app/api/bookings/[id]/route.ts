import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: body.status,
      notes: body.notes,
      date: body.date ? new Date(body.date) : undefined,
      price: body.price,
    },
    include: { client: true, service: true },
  });

  // Auto-register income when booking is marked as completed
  if (body.status === "completada") {
    await prisma.income.upsert({
      where: { bookingId: id },
      update: { amount: booking.price, method: body.paymentMethod ?? "efectivo" },
      create: {
        bookingId: id,
        amount: booking.price,
        method: body.paymentMethod ?? "efectivo",
        date: booking.date,
        description: `${booking.service.name} — ${booking.client.name}`,
      },
    });
  }

  return NextResponse.json(booking);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.booking.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
