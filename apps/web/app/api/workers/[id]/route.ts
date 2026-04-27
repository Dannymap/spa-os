import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const worker = await prisma.worker.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.active !== undefined && { active: body.active }),
    },
  });
  return NextResponse.json(worker);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.worker.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
