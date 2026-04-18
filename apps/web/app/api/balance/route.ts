import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function getRange(period: string) {
  const now = new Date();
  const from = new Date();
  if (period === "day") {
    from.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    const day = now.getDay();
    from.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    from.setHours(0, 0, 0, 0);
  } else if (period === "month") {
    from.setDate(1);
    from.setHours(0, 0, 0, 0);
  }
  return { from, to: now };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") ?? "month";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const range =
    from && to
      ? { from: new Date(from), to: new Date(to) }
      : getRange(period);

  const [incomeRows, expenseRows, bookingRows] = await Promise.all([
    prisma.income.findMany({
      where: { date: { gte: range.from, lte: range.to } },
      orderBy: { date: "asc" },
    }),
    prisma.expense.findMany({
      where: { date: { gte: range.from, lte: range.to } },
      orderBy: { date: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        date: { gte: range.from, lte: range.to },
        status: { in: ["completada", "no_show", "cancelada"] },
      },
      include: { service: true },
    }),
  ]);

  const totalIncome = incomeRows.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenseRows.reduce((s, r) => s + r.amount, 0);
  const balance = totalIncome - totalExpenses;

  const byCategory = expenseRows.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const byMethod = incomeRows.reduce<Record<string, number>>((acc, i) => {
    acc[i.method] = (acc[i.method] ?? 0) + i.amount;
    return acc;
  }, {});

  const completedBookings = bookingRows.filter((b) => b.status === "completada").length;
  const canceledBookings = bookingRows.filter((b) => b.status === "cancelada").length;
  const noShowBookings = bookingRows.filter((b) => b.status === "no_show").length;

  return NextResponse.json({
    period,
    from: range.from,
    to: range.to,
    totalIncome,
    totalExpenses,
    balance,
    byCategory,
    byMethod,
    completedBookings,
    canceledBookings,
    noShowBookings,
    income: incomeRows,
    expenses: expenseRows,
  });
}
