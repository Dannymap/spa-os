"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";

type Expense = { id: string; category: string; description: string; amount: number; date: string; receiptUrl?: string };

const CATEGORIES = ["productos", "alquiler", "servicios", "equipo", "publicidad", "otros"];
const CAT_ICONS: Record<string, string> = { productos: "🧴", alquiler: "🏠", servicios: "🔧", equipo: "🛠️", publicidad: "📣", otros: "📌" };

function pad(n: number) { return String(n).padStart(2, "0"); }
function monthStart() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`; }
function today() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

export default function GastosPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(monthStart());
  const [to, setTo] = useState(today());
  const [catFilter, setCatFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "productos", description: "", amount: "", date: today() });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ from: `${from}T00:00:00`, to: `${to}T23:59:59` });
    if (catFilter) params.set("category", catFilter);
    const res = await fetch(`/api/expenses?${params}`);
    setExpenses(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, [from, to, catFilter]);

  async function addExpense(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
    });
    setForm({ category: "productos", description: "", amount: "", date: today() });
    setShowForm(false);
    setSaving(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este gasto?")) return;
    await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
    load();
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => { acc[e.category] = (acc[e.category] ?? 0) + e.amount; return acc; }, {});

  return (
    <DashboardShell title="Gastos" description="Control de gastos del negocio" activePath="/gastos">
      {/* Filtros */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24, alignItems: "flex-end" }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Desde</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Hasta</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Categoría</label>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={inputStyle}>
            <option value="">Todas</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
          </select>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 22px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          {showForm ? "Cancelar" : "+ Nuevo gasto"}
        </button>
      </div>

      {/* Resumen por categoría */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <div style={{ background: "var(--color-card)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Total gastos</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#c0392b" }}>€{total.toFixed(2)}</div>
        </div>
        {Object.entries(byCategory).slice(0, 3).map(([cat, amount]) => (
          <div key={cat} style={{ background: "var(--color-card)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{CAT_ICONS[cat]} {cat}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#888" }}>€{amount.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Formulario nuevo gasto */}
      {showForm && (
        <form onSubmit={addExpense} style={{ background: "var(--color-card)", borderRadius: 16, padding: 22, marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Categoría</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Descripción *</label>
            <input required value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Ej: Esmaltes OPI, pack 12..." style={{ ...inputStyle, width: "100%", boxSizing: "border-box" as const }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Importe (€)</label>
            <input type="number" step="0.01" required value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="0.00" style={{ ...inputStyle, width: 100 }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Fecha</label>
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} style={inputStyle} />
          </div>
          <button type="submit" disabled={saving} style={{ background: "#c0392b", color: "#fff", border: "none", borderRadius: 10, padding: "9px 20px", fontWeight: 700, cursor: "pointer" }}>
            {saving ? "..." : "Guardar"}
          </button>
        </form>
      )}

      {/* Lista */}
      {loading ? <p style={{ color: "#888" }}>Cargando...</p> : expenses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
          <p>Sin gastos en este período.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {expenses.map((e) => (
            <div key={e.id} style={{ background: "var(--color-card)", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: 22 }}>{CAT_ICONS[e.category] ?? "📌"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{e.description}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{new Date(e.date).toLocaleDateString("es-ES")} · {e.category}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#c0392b" }}>€{e.amount.toFixed(2)}</div>
              <button onClick={() => remove(e.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#ccc", padding: "0 4px" }}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

const inputStyle: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e0d5cc", background: "var(--color-card)", fontSize: 14, color: "var(--color-text)" };
