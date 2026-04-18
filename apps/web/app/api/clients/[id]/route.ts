import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      bookings: {
        orderBy: { date: "desc" },
        include: { service: true, photos: true },
      },
      photos: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(client);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const client = await prisma.client.update({
    where: { id },
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      isVip: body.isVip,
      allergies: body.allergies,
      notes: body.notes,
      birthdate: body.birthdate ? new Date(body.birthdate) : undefined,
      preferredShape: body.preferredShape,
      preferredLength: body.preferredLength,
      favoriteColors: body.favoriteColors,
      photoUrl: body.photoUrl,
    },
  });
  return NextResponse.json(client);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.client.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
