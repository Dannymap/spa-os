"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";

type Booking = {
  id: string;
  date: string;
  status: string;
  price: number;
  notes?: string;
  client: { id: string; name: string; phone?: string };
  service: { name: string; durationMinutes: number; category: string };
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  prevista: { label: "Prevista", color: "#b5771a" },
  en_curso: { label: "En curso", color: "#2b7a62" },
  completada: { label: "Completada", color: "#2b7a62" },
  cancelada: { label: "Cancelada", color: "#c0392b" },
  no_show: { label: "No show", color: "#888" },
};

function pad(n: number) { return String(n).padStart(2, "0"); }
function fmt(d: string) { const dt = new Date(d); return `${pad(dt.getHours())}:${pad(dt.getMinutes())}`; }
function todayISO() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

export default function AgendaPage() {
  const [date, setDate] = useState(todayISO());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load(d: string) {
    setLoading(true);
    const res = await fetch(`/api/bookings?date=${d}`);
    setBookings(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(date); }, [date]);

  async function changeStatus(id: string, status: string, paymentMethod?: string) {
    setBusy(id);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentMethod }),
    });
    await load(date);
    setBusy(null);
  }

  const completed = bookings.filter((b) => b.status === "completada");
  const totalIncome = completed.reduce((s, b) => s + b.price, 0);
  const pending = bookings.filter((b) => ["prevista", "en_curso"].includes(b.status));

  return (
    <DashboardShell title="Agenda" description="Gestión de citas" activePath="/agenda">
      {/* Selector de fecha */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <label style={{ fontWeight: 600 }}>Fecha:</label>
        <input
          type="date" value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #e0d5cc", background: "var(--color-card)", fontSize: 15, color: "var(--color-text)" }}
        />
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[
          { label: "Total citas", value: bookings.length },
          { label: "Pendientes", value: pending.length },
          { label: "Completadas", value: completed.length },
          { label: "Ingresos del día", value: `€${totalIncome.toFixed(2)}` },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--color-card)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "var(--color-accent)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <p style={{ color: "#888" }}>Cargando...</p>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <p>No hay citas para esta fecha.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {bookings.map((b) => {
            const st = STATUS_MAP[b.status] ?? { label: b.status, color: "#888" };
            return (
              <div key={b.id} style={{ background: "var(--color-card)", borderRadius: 18, padding: "18px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", opacity: busy === b.id ? 0.6 : 1 }}>
                <div style={{ minWidth: 52, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-accent)" }}>{fmt(b.date)}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{b.service.durationMinutes}min</div>
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <a href={`/clientas/${b.client.id}`} style={{ fontWeight: 700, fontSize: 16, color: "var(--color-text)", textDecoration: "none" }}>{b.client.name}</a>
                  <div style={{ fontSize: 13, color: "#777" }}>{b.service.name}</div>
                  {b.notes && <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>📝 {b.notes}</div>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "var(--color-accent)" }}>€{b.price.toFixed(2)}</div>
                <span style={{ background: st.color + "22", color: st.color, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{st.label}</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {b.status === "prevista" && (
                    <>
                      <button onClick={() => changeStatus(b.id, "en_curso")} style={btn("#2b7a62")}>▶ Iniciar</button>
                      <button onClick={() => changeStatus(b.id, "cancelada")} style={btn("#c0392b")}>✕ Cancelar</button>
                      <button onClick={() => changeStatus(b.id, "no_show")} style={btn("#888")}>No show</button>
                    </>
                  )}
                  {b.status === "en_curso" && (
                    <>
                      <button onClick={() => changeStatus(b.id, "completada", "efectivo")} style={btn("#2b7a62")}>✓ Efectivo</button>
                      <button onClick={() => changeStatus(b.id, "completada", "tarjeta")} style={btn("#2563eb")}>✓ Tarjeta</button>
                      <button onClick={() => changeStatus(b.id, "completada", "transferencia")} style={btn("#7c3aed")}>✓ Transfer.</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <a href="/agenda/nueva" style={{ display: "inline-block", background: "var(--color-accent)", color: "#fff", padding: "12px 28px", borderRadius: 14, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
          + Nueva cita
        </a>
      </div>
    </DashboardShell>
  );
}

function btn(color: string): React.CSSProperties {
  return { background: color, color: "#fff", border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" };
}
