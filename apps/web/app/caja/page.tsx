"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";

type Income = {
  id: string; amount: number; method: string; date: string; description?: string;
  booking?: { client: { name: string }; service: { name: string } };
};

const METHOD_LABEL: Record<string, string> = { efectivo: "💵 Efectivo", tarjeta: "💳 Tarjeta", transferencia: "🏦 Transfer." };

function pad(n: number) { return String(n).padStart(2, "0"); }
function todayISO() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

export default function CajaPage() {
  const [date, setDate] = useState(todayISO());
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newIncome, setNewIncome] = useState({ amount: "", method: "efectivo", description: "" });
  const [saving, setSaving] = useState(false);

  async function load(d: string) {
    setLoading(true);
    const from = `${d}T00:00:00`;
    const to = `${d}T23:59:59`;
    const res = await fetch(`/api/income?from=${from}&to=${to}`);
    setIncome(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(date); }, [date]);

  async function addIncome(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newIncome, amount: parseFloat(newIncome.amount), date: `${date}T12:00:00` }),
    });
    setNewIncome({ amount: "", method: "efectivo", description: "" });
    setShowAdd(false);
    setSaving(false);
    load(date);
  }

  const total = income.reduce((s, i) => s + i.amount, 0);
  const byMethod = income.reduce<Record<string, number>>((acc, i) => { acc[i.method] = (acc[i.method] ?? 0) + i.amount; return acc; }, {});

  return (
    <DashboardShell title="Caja" description="Ingresos del día" activePath="/caja">
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <label style={{ fontWeight: 600 }}>Fecha:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #e0d5cc", background: "var(--color-card)", fontSize: 15, color: "var(--color-text)" }} />
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <div style={{ background: "var(--color-card)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Total del día</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "var(--color-accent)" }}>€{total.toFixed(2)}</div>
        </div>
        {Object.entries(byMethod).map(([method, amount]) => (
          <div key={method} style={{ background: "var(--color-card)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{METHOD_LABEL[method] ?? method}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#2b7a62" }}>€{amount.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Botón agregar ingreso manual */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setShowAdd(!showAdd)}
          style={{ background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 22px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          {showAdd ? "Cancelar" : "+ Ingreso manual"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addIncome} style={{ background: "var(--color-card)", borderRadius: 16, padding: 20, marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Importe (€)</label>
            <input type="number" step="0.01" required value={newIncome.amount} onChange={(e) => setNewIncome((f) => ({ ...f, amount: e.target.value }))}
              style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e0d5cc", width: 100, fontSize: 15 }} placeholder="0.00" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Método</label>
            <select value={newIncome.method} onChange={(e) => setNewIncome((f) => ({ ...f, method: e.target.value }))}
              style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e0d5cc", fontSize: 14 }}>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Descripción</label>
            <input value={newIncome.description} onChange={(e) => setNewIncome((f) => ({ ...f, description: e.target.value }))}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e0d5cc", fontSize: 14, boxSizing: "border-box" }} placeholder="Concepto..." />
          </div>
          <button type="submit" disabled={saving} style={{ background: "#2b7a62", color: "#fff", border: "none", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer" }}>
            {saving ? "..." : "Guardar"}
          </button>
        </form>
      )}

      {/* Lista de ingresos */}
      {loading ? <p style={{ color: "#888" }}>Cargando...</p> : income.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>💰</div>
          <p>Sin ingresos registrados para esta fecha.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {income.map((i) => (
            <div key={i.id} style={{ background: "var(--color-card)", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>
                  {i.booking ? `${i.booking.client.name} — ${i.booking.service.name}` : (i.description || "Ingreso manual")}
                </div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{new Date(i.date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
              <span style={{ fontSize: 12, color: "#888" }}>{METHOD_LABEL[i.method] ?? i.method}</span>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#2b7a62" }}>€{i.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <a href="/gastos" style={{ background: "transparent", border: "1.5px solid #e0d5cc", borderRadius: 12, padding: "10px 20px", fontWeight: 600, textDecoration: "none", color: "var(--color-text)", fontSize: 14 }}>Ver gastos →</a>
        <a href="/balance" style={{ background: "var(--color-accent)", color: "#fff", borderRadius: 12, padding: "10px 20px", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>Balance completo →</a>
      </div>
    </DashboardShell>
  );
}
