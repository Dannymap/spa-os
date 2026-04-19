import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const service = await prisma.service.update({
    where: { id },
    data: {
      name: body.name,
      category: body.category,
      durationMinutes: body.durationMinutes,
      price: body.price,
      description: body.description ?? null,
    },
  });
  return NextResponse.json(service);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.service.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
