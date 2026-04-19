"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";

type BalanceData = {
  totalIncome: number; totalExpenses: number; balance: number;
  byCategory: Record<string, number>; byMethod: Record<string, number>;
  byMonth: { month: number; income: number; expenses: number; balance: number }[];
  completedBookings: number; canceledBookings: number; noShowBookings: number;
  income: { id: string; amount: number; method: string; date: string; description?: string }[];
  expenses: { id: string; category: string; description: string; amount: number; date: string }[];
};

const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const CAT_ICONS: Record<string, string> = { productos: "🧴", alquiler: "🏠", servicios: "🔧", equipo: "🛠️", publicidad: "📣", otros: "📌" };
const METHOD_LABELS: Record<string, string> = { efectivo: "💵 Efectivo", tarjeta: "💳 Tarjeta", transferencia: "🏦 Transferencia" };

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

type Period = "day" | "week" | "month" | "year" | "range";

export default function BalancePage() {
  const [period, setPeriod]     = useState<Period>("month");
  const [year, setYear]         = useState(CURRENT_YEAR);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate]     = useState("");
  const [data, setData]         = useState<BalanceData | null>(null);
  const [loading, setLoading]   = useState(true);

  function buildUrl() {
    if (period === "range" && fromDate && toDate)
      return `/api/balance?period=range&from=${fromDate}&to=${toDate}`;
    if (period === "year")
      return `/api/balance?period=year&year=${year}`;
    return `/api/balance?period=${period}`;
  }

  async function load() {
    if (period === "range" && (!fromDate || !toDate)) return;
    setLoading(true);
    const res = await fetch(buildUrl());
    setData(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, [period, year]);

  const periods: { key: Period; label: string }[] = [
    { key: "day",   label: "Hoy" },
    { key: "week",  label: "Semana" },
    { key: "month", label: "Mes" },
    { key: "year",  label: "Año" },
    { key: "range", label: "Rango" },
  ];

  const maxBar = data ? Math.max(...data.byMonth.map((m) => Math.max(m.income, m.expenses)), 1) : 1;

  return (
    <DashboardShell title="Balance" description="Resumen financiero del negocio" activePath="/balance">

      {/* ── Filtros ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {periods.map(({ key, label }) => (
          <button key={key} onClick={() => setPeriod(key)} style={{
            padding: "8px 20px", borderRadius: 999, border: "none", cursor: "pointer",
            background: period === key ? "linear-gradient(135deg, var(--color-accent), var(--color-deep))" : "var(--color-card)",
            color: period === key ? "#fff" : "var(--color-muted)",
            fontWeight: period === key ? 700 : 500, fontSize: 14, fontFamily: "var(--font-body)",
            border: period === key ? "none" : "1.5px solid var(--color-line)" as unknown as undefined,
          }}>{label}</button>
        ))}

        {/* Selector de año */}
        {period === "year" && (
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}
            style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid var(--color-line)", background: "var(--color-card)", fontSize: 14, fontFamily: "var(--font-body)", color: "var(--color-text)", cursor: "pointer" }}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        )}

        {/* Rango personalizado */}
        {period === "range" && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
              style={dateInputStyle} />
            <span style={{ color: "var(--color-muted)", fontSize: 13 }}>hasta</span>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
              style={dateInputStyle} />
            <button onClick={load} disabled={!fromDate || !toDate} style={{
              padding: "8px 18px", borderRadius: 999, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
              color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "var(--font-body)",
              opacity: (!fromDate || !toDate) ? 0.5 : 1,
            }}>Ver</button>
          </div>
        )}
      </div>

      {loading || !data ? (
        <p style={{ color: "var(--color-muted)" }}>Calculando...</p>
      ) : (
        <>
          {/* ── KPIs ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Ingresos",           value: `€${data.totalIncome.toFixed(2)}`,   color: "var(--color-success)" },
              { label: "Gastos",             value: `€${data.totalExpenses.toFixed(2)}`, color: "#c0392b" },
              { label: "Balance neto",       value: `€${data.balance.toFixed(2)}`,       color: data.balance >= 0 ? "var(--color-success)" : "#c0392b" },
              { label: "Citas completadas",  value: data.completedBookings,              color: "var(--color-deep)" },
              { label: "Canceladas",         value: data.canceledBookings,               color: "var(--color-muted)" },
              { label: "No show",            value: data.noShowBookings,                 color: "var(--color-muted)" },
            ].map((s) => (
              <div key={s.label} style={{ background: "var(--color-card)", borderRadius: 16, padding: "18px 20px", border: "1px solid var(--color-line)", boxShadow: "0 2px 8px rgba(139,58,82,0.05)" }}>
                <div style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-heading)", color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* ── Gráfico por meses (solo en vista año) ── */}
          {period === "year" && (
            <div style={{ background: "var(--color-card)", borderRadius: 20, padding: "24px 20px", marginBottom: 24, border: "1px solid var(--color-line)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 17, color: "var(--color-deep)", margin: "0 0 20px" }}>Evolución mensual {year}</h3>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 140 }}>
                {data.byMonth.map((m) => (
                  <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 110 }}>
                      <div style={{ flex: 1, background: "var(--color-success)", borderRadius: "4px 4px 0 0", height: `${(m.income / maxBar) * 100}%`, minHeight: m.income > 0 ? 4 : 0, opacity: 0.85 }} />
                      <div style={{ flex: 1, background: "#c0392b", borderRadius: "4px 4px 0 0", height: `${(m.expenses / maxBar) * 100}%`, minHeight: m.expenses > 0 ? 4 : 0, opacity: 0.75 }} />
                    </div>
                    <span style={{ fontSize: 10, color: "var(--color-muted)", fontWeight: 600 }}>{MONTHS_ES[m.month]}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, background: "var(--color-success)", borderRadius: 2, display: "inline-block" }} /> Ingresos</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, background: "#c0392b", borderRadius: 2, display: "inline-block" }} /> Gastos</span>
              </div>
            </div>
          )}

          {/* ── Barra ingresos vs gastos ── */}
          {period !== "year" && (
            <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 24, marginBottom: 24, border: "1px solid var(--color-line)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--color-deep)", margin: "0 0 16px" }}>Ingresos vs Gastos</h3>
              {data.totalIncome === 0 && data.totalExpenses === 0 ? (
                <p style={{ color: "var(--color-muted)", fontSize: 14 }}>Sin movimientos en este período.</p>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 4, height: 28, borderRadius: 12, overflow: "hidden", marginBottom: 12, background: "var(--color-line)" }}>
                    {data.totalIncome > 0 && (
                      <div style={{ flex: data.totalIncome, background: "var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                        {data.totalIncome > 30 ? `€${data.totalIncome.toFixed(0)}` : ""}
                      </div>
                    )}
                    {data.totalExpenses > 0 && (
                      <div style={{ flex: data.totalExpenses, background: "#c0392b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                        {data.totalExpenses > 30 ? `€${data.totalExpenses.toFixed(0)}` : ""}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: "var(--color-success)", fontSize: 16 }}>■</span> Ingresos <strong>€{data.totalIncome.toFixed(2)}</strong></span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: "#c0392b", fontSize: 16 }}>■</span> Gastos <strong>€{data.totalExpenses.toFixed(2)}</strong></span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Por método y categoría ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 22, border: "1px solid var(--color-line)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--color-deep)", margin: "0 0 14px" }}>Ingresos por método</h3>
              {Object.keys(data.byMethod).length === 0 ? (
                <p style={{ color: "var(--color-muted)", fontSize: 14 }}>Sin datos.</p>
              ) : Object.entries(data.byMethod).map(([method, amount]) => (
                <div key={method} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--color-line)", fontSize: 14 }}>
                  <span style={{ color: "var(--color-muted)" }}>{METHOD_LABELS[method] ?? method}</span>
                  <strong style={{ color: "var(--color-success)" }}>€{amount.toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 22, border: "1px solid var(--color-line)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--color-deep)", margin: "0 0 14px" }}>Gastos por categoría</h3>
              {Object.keys(data.byCategory).length === 0 ? (
                <p style={{ color: "var(--color-muted)", fontSize: 14 }}>Sin gastos.</p>
              ) : Object.entries(data.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
                <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--color-line)", fontSize: 14 }}>
                  <span style={{ color: "var(--color-muted)" }}>{CAT_ICONS[cat] ?? "📌"} {cat}</span>
                  <strong style={{ color: "#c0392b" }}>€{amount.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* ── Últimos movimientos ── */}
          <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 22, border: "1px solid var(--color-line)" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--color-deep)", margin: "0 0 14px" }}>Movimientos</h3>
            {data.income.length === 0 && data.expenses.length === 0 ? (
              <p style={{ color: "var(--color-muted)", fontSize: 14 }}>Sin movimientos en este período.</p>
            ) : (
              [...data.income.map((i) => ({ ...i, type: "income" as const })),
               ...data.expenses.map((e) => ({ ...e, type: "expense" as const }))]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 30)
                .map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--color-line)", fontSize: 14 }}>
                    <span style={{ fontSize: 18 }}>{item.type === "income" ? "💚" : "🔴"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "var(--color-text)" }}>
                        {"description" in item && item.description ? item.description : ("category" in item ? item.category : "")}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--color-muted)" }}>
                        {new Date(item.date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <strong style={{ color: item.type === "income" ? "var(--color-success)" : "#c0392b", fontSize: 15 }}>
                      {item.type === "income" ? "+" : "-"}€{item.amount.toFixed(2)}
                    </strong>
                  </div>
                ))
            )}
          </div>
        </>
      )}
    </DashboardShell>
  );
}

const dateInputStyle: React.CSSProperties = {
  padding: "8px 12px", borderRadius: 10, border: "1.5px solid var(--color-line)",
  background: "var(--color-card)", fontSize: 14, fontFamily: "var(--font-body)", color: "var(--color-text)",
};
