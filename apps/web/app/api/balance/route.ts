import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function getRange(period: string, year?: string) {
  const now = new Date();

  if (period === "day") {
    const from = new Date(now);
    from.setHours(0, 0, 0, 0);
    const to = new Date(now);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  }

  if (period === "week") {
    const from = new Date(now);
    const day = now.getDay();
    from.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(from.getDate() + 6);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  }

  if (period === "month") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { from, to };
  }

  if (period === "year") {
    const y = year ? Number(year) : now.getFullYear();
    const from = new Date(y, 0, 1, 0, 0, 0, 0);
    const to = new Date(y, 11, 31, 23, 59, 59, 999);
    return { from, to };
  }

  // default: current month
  const from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { from, to };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const period = searchParams.get("period") ?? "month";
  const fromParam = searchParams.get("from");
  const toParam   = searchParams.get("to");
  const year      = searchParams.get("year") ?? undefined;

  const range =
    fromParam && toParam
      ? { from: new Date(fromParam + "T00:00:00"), to: new Date(toParam + "T23:59:59") }
      : getRange(period, year);

  const [incomeRows, expenseRows, bookingRows] = await Promise.all([
    prisma.income.findMany({
      where: { date: { gte: range.from, lte: range.to } },
      orderBy: { date: "desc" },
    }),
    prisma.expense.findMany({
      where: { date: { gte: range.from, lte: range.to } },
      orderBy: { date: "desc" },
    }),
    prisma.booking.findMany({
      where: {
        date: { gte: range.from, lte: range.to },
        status: { in: ["completada", "no_show", "cancelada"] },
      },
    }),
  ]);

  const totalIncome   = incomeRows.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenseRows.reduce((s, r) => s + r.amount, 0);
  const balance       = totalIncome - totalExpenses;

  const byCategory = expenseRows.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const byMethod = incomeRows.reduce<Record<string, number>>((acc, i) => {
    acc[i.method] = (acc[i.method] ?? 0) + i.amount;
    return acc;
  }, {});

  // Monthly breakdown for year view
  const byMonth = Array.from({ length: 12 }, (_, i) => {
    const inc = incomeRows.filter((r) => new Date(r.date).getMonth() === i).reduce((s, r) => s + r.amount, 0);
    const exp = expenseRows.filter((r) => new Date(r.date).getMonth() === i).reduce((s, r) => s + r.amount, 0);
    return { month: i, income: inc, expenses: exp, balance: inc - exp };
  });

  return NextResponse.json({
    period,
    from: range.from,
    to: range.to,
    totalIncome,
    totalExpenses,
    balance,
    byCategory,
    byMethod,
    byMonth,
    completedBookings: bookingRows.filter((b) => b.status === "completada").length,
    canceledBookings:  bookingRows.filter((b) => b.status === "cancelada").length,
    noShowBookings:    bookingRows.filter((b) => b.status === "no_show").length,
    income:   incomeRows,
    expenses: expenseRows,
  });
}
