import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const service = await prisma.service.create({
    data: {
      name: body.name,
      category: body.category,
      durationMinutes: body.durationMinutes,
      price: body.price,
      description: body.description,
    },
  });
  return NextResponse.json(service, { status: 201 });
}
