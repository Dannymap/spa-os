"use client";

import { useEffect, useState } from "react";

type Override = { id: string; date: string; slots: string[] };

// All possible slots in a day (every 30 min, 08:00–21:00)
const ALL_SLOTS = Array.from({ length: 27 }, (_, i) => {
  const totalMin = 480 + i * 30; // start 08:00
  return `${Math.floor(totalMin / 60).toString().padStart(2, "0")}:${(totalMin % 60).toString().padStart(2, "0")}`;
});

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export function DayOverrides() {
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/overrides").then((r) => r.json()).then(setOverrides);
  }, []);

  function toggleSlot(slot: string) {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot].sort()
    );
  }

  async function save() {
    if (!selectedDate) return;
    setSaving(true);
    const res = await fetch("/api/overrides", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selectedDate, slots: [...selectedSlots].sort() }),
    });
    const data = await res.json();
    if (data.deleted) {
      setOverrides((prev) => prev.filter((o) => o.date !== selectedDate));
    } else {
      setOverrides((prev) => {
        const exists = prev.find((o) => o.date === selectedDate);
        return exists ? prev.map((o) => (o.date === selectedDate ? data : o)) : [...prev, data].sort((a, b) => a.date.localeCompare(b.date));
      });
    }
    setSaving(false);
    setSaved(true);
    setShowForm(false);
    setSelectedDate("");
    setSelectedSlots([]);
    setEditingDate(null);
    setTimeout(() => setSaved(false), 2500);
  }

  async function deleteOverride(date: string) {
    await fetch(`/api/overrides?date=${date}`, { method: "DELETE" });
    setOverrides((prev) => prev.filter((o) => o.date !== date));
  }

  function startEdit(o: Override) {
    setEditingDate(o.date);
    setSelectedDate(o.date);
    setSelectedSlots(o.slots);
    setShowForm(true);
  }

  function startNew() {
    setEditingDate(null);
    setSelectedDate("");
    setSelectedSlots([]);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setSelectedDate("");
    setSelectedSlots([]);
    setEditingDate(null);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{
      background: "var(--color-card)", borderRadius: 20,
      border: "1px solid var(--color-line)", padding: "28px 24px",
    }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-accent)", margin: "0 0 4px" }}>
          Disponibilidad específica
        </p>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, color: "var(--color-deep)", margin: "0 0 6px" }}>
          Horarios por día
        </h3>
        <p style={{ fontSize: 13, color: "var(--color-muted)", margin: 0 }}>
          Configura los horarios exactos de un día concreto. Si no configuras nada, se usan los horarios generales en franjas de 1 hora.
        </p>
      </div>

      {/* ── Existing overrides ── */}
      {overrides.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Días configurados
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {overrides.map((o) => (
              <div key={o.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", borderRadius: 14,
                background: editingDate === o.date ? "var(--color-accent-soft)" : "#f8f4f2",
                border: `1px solid ${editingDate === o.date ? "rgba(201,133,106,0.3)" : "var(--color-line)"}`,
                flexWrap: "wrap", gap: 10,
              }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "var(--color-deep)" }}>
                    {formatDate(o.date)}
                  </span>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    {o.slots.map((s) => (
                      <span key={s} style={{
                        padding: "3px 10px", borderRadius: 999, background: "var(--color-deep)",
                        color: "#fff", fontSize: 12, fontWeight: 600,
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => startEdit(o)} style={btnSecondary}>Editar</button>
                  <button onClick={() => deleteOverride(o.date)} style={btnDanger}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Form ── */}
      <div style={{ borderTop: overrides.length ? "1px solid var(--color-line)" : "none", paddingTop: overrides.length ? 24 : 0 }}>
        {!showForm && (
          <button onClick={startNew} style={btnPrimary}>+ Configurar un día específico</button>
        )}

        {showForm && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Fecha del día</label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  // Load existing override if exists
                  const existing = overrides.find((o) => o.date === e.target.value);
                  setSelectedSlots(existing ? existing.slots : []);
                }}
                style={{ ...inputStyle, maxWidth: 220 }}
              />
            </div>

            {selectedDate && (
              <>
                <label style={{ ...labelStyle, marginBottom: 12 }}>
                  Selecciona los horarios disponibles para {formatDate(selectedDate)}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  {ALL_SLOTS.map((slot) => {
                    const isOn = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(slot)}
                        style={{
                          padding: "9px 16px", borderRadius: 10, cursor: "pointer",
                          border: isOn ? "2px solid var(--color-deep)" : "1.5px solid var(--color-line)",
                          background: isOn ? "linear-gradient(135deg, var(--color-accent), var(--color-deep))" : "white",
                          color: isOn ? "#fff" : "var(--color-muted)",
                          fontWeight: isOn ? 700 : 500, fontSize: 14,
                          fontFamily: "var(--font-body)", transition: "all 0.12s",
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                {selectedSlots.length > 0 && (
                  <p style={{ fontSize: 13, color: "var(--color-muted)", marginBottom: 16 }}>
                    {selectedSlots.length} horario{selectedSlots.length > 1 ? "s" : ""} seleccionado{selectedSlots.length > 1 ? "s" : ""}: <strong style={{ color: "var(--color-deep)" }}>{selectedSlots.join(" · ")}</strong>
                  </p>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={save}
                    disabled={saving || selectedSlots.length === 0}
                    style={{ ...btnPrimary, opacity: (saving || selectedSlots.length === 0) ? 0.5 : 1 }}
                  >
                    {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar horarios"}
                  </button>
                  <button
                    onClick={cancelForm}
                    style={btnSecondary}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
  textTransform: "uppercase", color: "var(--color-muted)", marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  padding: "10px 14px", borderRadius: 12, border: "1.5px solid var(--color-line)",
  background: "#fdf8f6", fontSize: 15, color: "var(--color-text)",
  fontFamily: "var(--font-body)", outline: "none",
};

const btnPrimary: React.CSSProperties = {
  padding: "11px 22px", borderRadius: 999, border: "none", cursor: "pointer",
  background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
  color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "var(--font-body)",
  boxShadow: "0 4px 14px rgba(139,58,82,0.2)",
};

const btnSecondary: React.CSSProperties = {
  padding: "9px 16px", borderRadius: 10, border: "1px solid var(--color-line)",
  background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600,
  color: "var(--color-muted)", fontFamily: "var(--font-body)",
};

const btnDanger: React.CSSProperties = {
  padding: "9px 16px", borderRadius: 10, border: "none",
  background: "#fff0f0", cursor: "pointer", fontSize: 13, fontWeight: 600,
  color: "#c0392b", fontFamily: "var(--font-body)",
};
