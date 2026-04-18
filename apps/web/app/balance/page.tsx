"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";

type BalanceData = {
  totalIncome: number; totalExpenses: number; balance: number;
  byCategory: Record<string, number>; byMethod: Record<string, number>;
  completedBookings: number; canceledBookings: number; noShowBookings: number;
  income: { id: string; amount: number; method: string; date: string; description?: string }[];
  expenses: { id: string; category: string; description: string; amount: number; date: string }[];
};

const CAT_ICONS: Record<string, string> = { productos: "🧴", alquiler: "🏠", servicios: "🔧", equipo: "🛠️", publicidad: "📣", otros: "📌" };

export default function BalancePage() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");
  const [data, setData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(p: string) {
    setLoading(true);
    const res = await fetch(`/api/balance?period=${p}`);
    setData(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(period); }, [period]);

  const periods: { key: "day" | "week" | "month"; label: string }[] = [
    { key: "day", label: "Hoy" },
    { key: "week", label: "Esta semana" },
    { key: "month", label: "Este mes" },
  ];

  return (
    <DashboardShell title="Balance" description="Resumen financiero del negocio" activePath="/balance">
      {/* Selector de período */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {periods.map(({ key, label }) => (
          <button key={key} onClick={() => setPeriod(key)}
            style={{ padding: "8px 22px", borderRadius: 20, border: period === key ? "none" : "1.5px solid #e0d5cc", background: period === key ? "var(--color-accent)" : "var(--color-card)", color: period === key ? "#fff" : "var(--color-text)", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            {label}
          </button>
        ))}
      </div>

      {loading || !data ? (
        <p style={{ color: "#888" }}>Calculando...</p>
      ) : (
        <>
          {/* KPIs principales */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
            {[
              { label: "Ingresos", value: `€${data.totalIncome.toFixed(2)}`, color: "#2b7a62" },
              { label: "Gastos", value: `€${data.totalExpenses.toFixed(2)}`, color: "#c0392b" },
              { label: "Balance neto", value: `€${data.balance.toFixed(2)}`, color: data.balance >= 0 ? "#2b7a62" : "#c0392b" },
              { label: "Citas completadas", value: data.completedBookings, color: "var(--color-accent)" },
              { label: "Canceladas", value: data.canceledBookings, color: "#888" },
              { label: "No show", value: data.noShowBookings, color: "#888" },
            ].map((s) => (
              <div key={s.label} style={{ background: "var(--color-card)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Barra visual ingresos vs gastos */}
          <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Ingresos vs Gastos</h3>
            {data.totalIncome === 0 && data.totalExpenses === 0 ? (
              <p style={{ color: "#aaa", fontSize: 14 }}>Sin movimientos en este período.</p>
            ) : (
              <>
                <div style={{ display: "flex", gap: 4, height: 24, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
                  {data.totalIncome > 0 && (
                    <div style={{ flex: data.totalIncome, background: "#2b7a62", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                      {data.totalIncome > 50 ? `€${data.totalIncome.toFixed(0)}` : ""}
                    </div>
                  )}
                  {data.totalExpenses > 0 && (
                    <div style={{ flex: data.totalExpenses, background: "#c0392b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                      {data.totalExpenses > 50 ? `€${data.totalExpenses.toFixed(0)}` : ""}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                  <span><span style={{ color: "#2b7a62" }}>■</span> Ingresos €{data.totalIncome.toFixed(2)}</span>
                  <span><span style={{ color: "#c0392b" }}>■</span> Gastos €{data.totalExpenses.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            {/* Ingresos por método */}
            <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>Ingresos por método</h3>
              {Object.keys(data.byMethod).length === 0 ? <p style={{ color: "#aaa", fontSize: 14 }}>Sin datos.</p> : (
                Object.entries(data.byMethod).map(([method, amount]) => (
                  <div key={method} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0e8e0", fontSize: 14 }}>
                    <span style={{ color: "#888" }}>{method === "efectivo" ? "💵 Efectivo" : method === "tarjeta" ? "💳 Tarjeta" : "🏦 Transferencia"}</span>
                    <strong style={{ color: "#2b7a62" }}>€{amount.toFixed(2)}</strong>
                  </div>
                ))
              )}
            </div>

            {/* Gastos por categoría */}
            <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>Gastos por categoría</h3>
              {Object.keys(data.byCategory).length === 0 ? <p style={{ color: "#aaa", fontSize: 14 }}>Sin gastos.</p> : (
                Object.entries(data.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
                  <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0e8e0", fontSize: 14 }}>
                    <span style={{ color: "#888" }}>{CAT_ICONS[cat] ?? "📌"} {cat}</span>
                    <strong style={{ color: "#c0392b" }}>€{amount.toFixed(2)}</strong>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Últimos movimientos */}
          <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>Últimos movimientos</h3>
            {[...data.income.map((i) => ({ ...i, type: "income" as const })), ...data.expenses.map((e) => ({ ...e, type: "expense" as const }))]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 20)
              .map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0e8e0", fontSize: 14 }}>
                  <span style={{ fontSize: 18 }}>{item.type === "income" ? "💚" : "🔴"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{"description" in item && item.description ? item.description : ("category" in item ? item.category : "")}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{new Date(item.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</div>
                  </div>
                  <strong style={{ color: item.type === "income" ? "#2b7a62" : "#c0392b" }}>
                    {item.type === "income" ? "+" : "-"}€{item.amount.toFixed(2)}
                  </strong>
                </div>
              ))}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
