"use client";

import { useEffect, useState } from "react";

type DaySchedule = { id?: string; dayOfWeek: number; isOpen: boolean; openTime: string; closeTime: string };

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const DAY_SHORT = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

const DEFAULT: DaySchedule[] = DAY_NAMES.map((_, i) => ({
  dayOfWeek: i,
  isOpen: i >= 1 && i <= 6,
  openTime: i === 6 ? "10:00" : "09:00",
  closeTime: i === 5 ? "20:00" : i === 6 ? "18:00" : "19:00",
}));

export function ScheduleConfig() {
  const [days, setDays] = useState<DaySchedule[]>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((data) => { if (data?.length) setDays(data); });
  }, []);

  function toggle(idx: number) {
    setDays((prev) => prev.map((d) => d.dayOfWeek === idx ? { ...d, isOpen: !d.isOpen } : d));
  }

  function setTime(idx: number, field: "openTime" | "closeTime", val: string) {
    setDays((prev) => prev.map((d) => d.dayOfWeek === idx ? { ...d, [field]: val } : d));
  }

  async function save() {
    setSaving(true);
    await fetch("/api/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(days),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{
      background: "var(--color-card)", borderRadius: 20,
      border: "1px solid var(--color-line)", padding: "28px 24px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-accent)", margin: "0 0 4px" }}>
            Horario del salón
          </p>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, color: "var(--color-deep)", margin: 0 }}>
            Días y horas disponibles
          </h3>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "10px 22px", borderRadius: 999, border: "none", cursor: "pointer",
            background: saved ? "var(--color-success)" : "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
            color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "var(--font-body)",
            opacity: saving ? 0.7 : 1, transition: "background 0.3s",
          }}
        >
          {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar horario"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {days.map((d) => (
          <div key={d.dayOfWeek} style={{
            display: "grid", gridTemplateColumns: "90px 48px 1fr", alignItems: "center", gap: 16,
            padding: "14px 16px", borderRadius: 14,
            background: d.isOpen ? "var(--color-accent-soft)" : "#f8f4f2",
            border: `1px solid ${d.isOpen ? "rgba(201,133,106,0.25)" : "var(--color-line)"}`,
            opacity: d.isOpen ? 1 : 0.65,
            transition: "all 0.15s",
          }}>
            {/* Día */}
            <span style={{ fontWeight: 700, fontSize: 13, color: d.isOpen ? "var(--color-deep)" : "var(--color-muted)", letterSpacing: "0.06em" }}>
              {DAY_NAMES[d.dayOfWeek]}
            </span>

            {/* Toggle */}
            <div
              onClick={() => toggle(d.dayOfWeek)}
              style={{
                width: 44, height: 24, borderRadius: 999, cursor: "pointer",
                background: d.isOpen ? "var(--color-deep)" : "#d0c4c0",
                position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                position: "absolute", top: 3, left: d.isOpen ? 23 : 3,
                width: 18, height: 18, borderRadius: "50%", background: "white",
                transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }} />
            </div>

            {/* Horas */}
            {d.isOpen ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="time" value={d.openTime}
                  onChange={(e) => setTime(d.dayOfWeek, "openTime", e.target.value)}
                  style={timeInputStyle}
                />
                <span style={{ color: "var(--color-muted)", fontSize: 13 }}>a</span>
                <input
                  type="time" value={d.closeTime}
                  onChange={(e) => setTime(d.dayOfWeek, "closeTime", e.target.value)}
                  style={timeInputStyle}
                />
                <span style={{ fontSize: 12, color: "var(--color-muted)", marginLeft: 4 }}>
                  ({calcHours(d.openTime, d.closeTime)} h)
                </span>
              </div>
            ) : (
              <span style={{ fontSize: 13, color: "var(--color-muted)" }}>Cerrado</span>
            )}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 16, margin: "16px 0 0" }}>
        Las clientas solo podrán reservar en días abiertos. Los horarios se muestran en franjas de 30 minutos.
      </p>
    </div>
  );
}

function calcHours(open: string, close: string) {
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  const diff = (ch * 60 + cm) - (oh * 60 + om);
  return (diff / 60).toFixed(1).replace(".0", "");
}

const timeInputStyle: React.CSSProperties = {
  padding: "6px 10px", borderRadius: 8, border: "1.5px solid var(--color-line)",
  background: "white", fontSize: 14, color: "var(--color-text)",
  fontFamily: "var(--font-body)", cursor: "pointer",
};
