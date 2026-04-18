import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photos = await prisma.clientPhoto.findMany({
    where: { clientId: id },
    include: { booking: { include: { service: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const photo = await prisma.clientPhoto.create({
    data: {
      clientId: id,
      url: body.url,
      description: body.description,
      bookingId: body.bookingId,
    },
  });
  return NextResponse.json(photo, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const photoId = searchParams.get("photoId");
  if (!photoId) return NextResponse.json({ error: "photoId required" }, { status: 400 });
  await prisma.clientPhoto.delete({ where: { id: photoId } });
  return new NextResponse(null, { status: 204 });
}
