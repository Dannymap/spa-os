import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const workers = await prisma.worker.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(workers);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  const worker = await prisma.worker.create({ data: { name } });
  return NextResponse.json(worker, { status: 201 });
}
