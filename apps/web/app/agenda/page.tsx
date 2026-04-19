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
  service: { id: string; name: string; durationMinutes: number; category: string };
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  prevista:   { label: "Prevista",   color: "#b5771a" },
  en_curso:   { label: "En curso",   color: "#2b7a62" },
  completada: { label: "Completada", color: "#2b7a62" },
  cancelada:  { label: "Cancelada",  color: "#c0392b" },
  no_show:    { label: "No show",    color: "#888" },
};

function pad(n: number) { return String(n).padStart(2, "0"); }
function fmt(d: string) { const dt = new Date(d); return `${pad(dt.getHours())}:${pad(dt.getMinutes())}`; }
function todayISO() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function addDays(base: string, n: number) {
  const d = new Date(base + "T12:00:00"); d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}
function formatDayES(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
}

export default function AgendaPage() {
  const [date, setDate] = useState(todayISO());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  // Reagendar modal state
  const [reagendarBooking, setReagendarBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [saving, setSaving] = useState(false);

  async function load(d: string) {
    setLoading(true);
    const res = await fetch(`/api/bookings?date=${d}`);
    setBookings(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(date); }, [date]);

  // Load slots when reagendar date changes
  useEffect(() => {
    if (!reagendarBooking || !newDate) { setSlots([]); return; }
    setSlotsLoading(true);
    setSelectedSlot("");
    fetch(`/api/availability?date=${newDate}&duration=${reagendarBooking.service.durationMinutes}`)
      .then((r) => r.json())
      .then((data) => { setSlots(data.slots ?? []); setSlotsLoading(false); });
  }, [newDate, reagendarBooking]);

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

  async function confirmReagendar() {
    if (!reagendarBooking || !newDate || !selectedSlot) return;
    setSaving(true);
    const [h, m] = selectedSlot.split(":").map(Number);
    const dt = new Date(newDate + "T00:00:00.000Z");
    dt.setUTCHours(h, m, 0, 0);
    await fetch(`/api/bookings/${reagendarBooking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: dt.toISOString(), status: "prevista" }),
    });
    setSaving(false);
    setReagendarBooking(null);
    setNewDate("");
    setSelectedSlot("");
    await load(date);
  }

  function openReagendar(b: Booking) {
    setReagendarBooking(b);
    setNewDate(todayISO());
    setSelectedSlot("");
  }

  const completed = bookings.filter((b) => b.status === "completada");
  const totalIncome = completed.reduce((s, b) => s + b.price, 0);
  const pending = bookings.filter((b) => ["prevista", "en_curso"].includes(b.status));
  const today = todayISO();
  const dateOptions = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  return (
    <DashboardShell title="Agenda" description="Gestión de citas" activePath="/agenda">
      {/* Selector de fecha */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <label style={{ fontWeight: 600 }}>Fecha:</label>
        <input
          type="date" value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid var(--color-line)", background: "var(--color-card)", fontSize: 15, color: "var(--color-text)" }}
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
          <div key={s.label} style={{ background: "var(--color-card)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 8px rgba(139,58,82,0.06)" }}>
            <div style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-heading)", color: "var(--color-deep)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <p style={{ color: "var(--color-muted)" }}>Cargando...</p>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <p>No hay citas para esta fecha.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {bookings.map((b) => {
            const st = STATUS_MAP[b.status] ?? { label: b.status, color: "#888" };
            const canReschedule = ["prevista", "no_show", "cancelada"].includes(b.status);
            return (
              <div key={b.id} style={{
                background: "var(--color-card)", borderRadius: 18, padding: "18px 22px",
                boxShadow: "0 2px 8px rgba(139,58,82,0.06)", border: "1px solid var(--color-line)",
                display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
                opacity: busy === b.id ? 0.6 : 1,
              }}>
                {/* Hora */}
                <div style={{ minWidth: 52, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>{fmt(b.date)}</div>
                  <div style={{ fontSize: 11, color: "var(--color-muted)" }}>{b.service.durationMinutes}min</div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 160 }}>
                  <a href={`/clientas/${b.client.id}`} style={{ fontWeight: 700, fontSize: 16, color: "var(--color-text)", textDecoration: "none" }}>{b.client.name}</a>
                  <div style={{ fontSize: 13, color: "var(--color-muted)" }}>{b.service.name}</div>
                  {b.notes && <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 3 }}>📝 {b.notes}</div>}
                </div>

                {/* Precio + estado */}
                <div style={{ fontWeight: 700, fontSize: 18, color: "var(--color-deep)", fontFamily: "var(--font-heading)" }}>€{b.price.toFixed(2)}</div>
                <span style={{ background: st.color + "22", color: st.color, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{st.label}</span>

                {/* Acciones */}
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
                  {canReschedule && (
                    <button onClick={() => openReagendar(b)} style={btn("#c9856a")}>📅 Reagendar</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <a href="/agenda/nueva" style={{ display: "inline-block", background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))", color: "#fff", padding: "12px 28px", borderRadius: 14, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
          + Nueva cita
        </a>
      </div>

      {/* ── Modal Reagendar ── */}
      {reagendarBooking && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) { setReagendarBooking(null); setNewDate(""); setSelectedSlot(""); } }}
          style={{ position: "fixed", inset: 0, background: "rgba(44,26,26,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 20 }}
        >
          <div style={{ background: "var(--color-card)", borderRadius: 24, padding: "32px 28px", width: "100%", maxWidth: 520, boxShadow: "0 20px 60px rgba(44,26,26,0.25)", border: "1px solid var(--color-line)", maxHeight: "90vh", overflowY: "auto" }}>

            {/* Header */}
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: "var(--color-deep)", margin: "0 0 6px" }}>Reagendar cita</h2>
            <div style={{ background: "var(--color-accent-soft)", borderRadius: 12, padding: "10px 14px", marginBottom: 24, fontSize: 14 }}>
              <strong>{reagendarBooking.client.name}</strong> · {reagendarBooking.service.name}
            </div>

            {/* Date strip */}
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-muted)", margin: "0 0 10px" }}>Nuevo día</p>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 24 }}>
              {dateOptions.map((d) => {
                const dayShort = new Date(d + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
                const dayNum = new Date(d + "T12:00:00").getDate();
                const isSelected = d === newDate;
                return (
                  <button key={d} onClick={() => setNewDate(d)} style={{
                    flexShrink: 0, width: 52, padding: "10px 0", borderRadius: 12, cursor: "pointer",
                    border: isSelected ? "2px solid var(--color-deep)" : "1.5px solid var(--color-line)",
                    background: isSelected ? "linear-gradient(135deg, var(--color-accent), var(--color-deep))" : "white",
                    color: isSelected ? "#fff" : "var(--color-muted)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    fontFamily: "var(--font-body)",
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 600 }}>{dayShort}</span>
                    <span style={{ fontSize: 17, fontWeight: 700 }}>{dayNum}</span>
                  </button>
                );
              })}
            </div>

            {/* Slots */}
            {newDate && (
              <>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-muted)", margin: "0 0 10px" }}>Nueva hora</p>
                {slotsLoading && <p style={{ color: "var(--color-muted)", fontSize: 14 }}>Cargando horarios...</p>}
                {!slotsLoading && slots.length === 0 && (
                  <p style={{ color: "#c0392b", fontSize: 14, background: "#fff0f0", padding: "10px 14px", borderRadius: 10 }}>Sin disponibilidad este día.</p>
                )}
                {!slotsLoading && slots.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                    {slots.map((slot) => {
                      const isOn = slot === selectedSlot;
                      return (
                        <button key={slot} onClick={() => setSelectedSlot(slot)} style={{
                          padding: "9px 16px", borderRadius: 10, cursor: "pointer",
                          border: isOn ? "2px solid var(--color-deep)" : "1.5px solid var(--color-line)",
                          background: isOn ? "linear-gradient(135deg, var(--color-accent), var(--color-deep))" : "white",
                          color: isOn ? "#fff" : "var(--color-text)",
                          fontWeight: isOn ? 700 : 500, fontSize: 14, fontFamily: "var(--font-body)",
                        }}>
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={confirmReagendar}
                disabled={!selectedSlot || saving}
                style={{ flex: 2, padding: "13px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))", color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "var(--font-body)", opacity: (!selectedSlot || saving) ? 0.5 : 1 }}
              >
                {saving ? "Guardando..." : "✓ Confirmar reagendado"}
              </button>
              <button
                onClick={() => { setReagendarBooking(null); setNewDate(""); setSelectedSlot(""); }}
                style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1px solid var(--color-line)", background: "white", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--color-muted)" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function btn(color: string): React.CSSProperties {
  return { background: color, color: "#fff", border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" };
}
