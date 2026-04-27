import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const service = await prisma.service.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.durationMinutes !== undefined && { durationMinutes: body.durationMinutes }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.description !== undefined && { description: body.description ?? null }),
      ...(body.active !== undefined && { active: body.active }),
    },
  });
  return NextResponse.json(service);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.service.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
