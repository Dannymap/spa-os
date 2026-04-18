import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  const clients = await prisma.client.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      bookings: {
        orderBy: { date: "desc" },
        take: 1,
        include: { service: true },
      },
      photos: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = await prisma.client.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      allergies: body.allergies,
      notes: body.notes,
      birthdate: body.birthdate ? new Date(body.birthdate) : undefined,
      preferredShape: body.preferredShape,
      preferredLength: body.preferredLength,
      favoriteColors: body.favoriteColors ?? [],
      photoUrl: body.photoUrl,
    },
  });
  return NextResponse.json(client, { status: 201 });
}
