"use client";

import { useEffect, useState } from "react";

type Service = { id: string; name: string; category: string; durationMinutes: number; price: number; description?: string };

const CATEGORY_LABELS: Record<string, string> = {
  manos: "💅 Manos", pies: "🦶 Pies", cejas: "✨ Cejas",
  pestanas: "👁️ Pestañas", depilacion: "🌸 Depilación",
  packs: "🎁 Packs", otros: "💆 Otros",
};

const STEPS = ["Servicio", "Fecha y hora", "Tus datos", "Confirmar"];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function addDays(base: string, n: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function formatDateES(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
}

export default function ReservarPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Service | null>(null);

  // Step 1 — date/time
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [dayOpen, setDayOpen] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState("");

  // Step 2 — form
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices);
  }, []);

  // Load slots when date or service changes
  useEffect(() => {
    if (!selected || !selectedDate) return;
    setSlotsLoading(true);
    setSelectedSlot("");
    fetch(`/api/availability?date=${selectedDate}&duration=${selected.durationMinutes}`)
      .then((r) => r.json())
      .then((data) => {
        setDayOpen(data.available ?? false);
        setSlots(data.slots ?? []);
        setSlotsLoading(false);
      });
  }, [selected, selectedDate]);

  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  // Build next 14 days for date picker
  const today = todayStr();
  const dateOptions = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  async function submit() {
    setSending(true);
    const clientRes = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email }),
    });
    const client = await clientRes.json();

    const [h, m] = selectedSlot.split(":").map(Number);
    const dateTime = new Date(selectedDate + "T00:00:00.000Z");
    dateTime.setUTCHours(h, m, 0, 0);

    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: client.id,
        serviceId: selected!.id,
        date: dateTime.toISOString(),
        notes: form.notes,
        price: selected!.price,
        status: "prevista",
      }),
    });
    setSending(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", padding: 20 }}>
        <div style={{ background: "var(--color-card)", borderRadius: 28, padding: "48px 40px", textAlign: "center", maxWidth: 440, boxShadow: "0 8px 40px rgba(139,58,82,0.12)", border: "1px solid var(--color-line)" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🌸</div>
          <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--color-deep)", marginBottom: 8, fontSize: 26 }}>¡Cita confirmada!</h2>
          <p style={{ color: "var(--color-muted)", marginBottom: 8, lineHeight: 1.6 }}>
            Hola <strong>{form.name}</strong>, tu cita para <strong>{selected?.name}</strong> está registrada.
          </p>
          <p style={{ color: "var(--color-muted)", marginBottom: 28, fontSize: 14 }}>
            📅 {formatDateES(selectedDate)} a las <strong>{selectedSlot}</strong>
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => { setSubmitted(false); setStep(0); setSelected(null); setSelectedSlot(""); setForm({ name: "", phone: "", email: "", notes: "" }); }}
              style={{ background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))", color: "#fff", border: "none", borderRadius: 14, padding: "13px 28px", fontWeight: 700, cursor: "pointer", fontSize: 15, fontFamily: "var(--font-body)" }}
            >
              Hacer otra reserva
            </button>
            <a href="/" style={{ border: "1.5px solid var(--color-line)", borderRadius: 14, padding: "13px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none", color: "var(--color-text)", display: "block" }}>
              ← Ir al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", fontFamily: "var(--font-body)", padding: "40px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
          <a href="/" style={{ color: "var(--color-accent)", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>← Inicio</a>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>🌸</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: "var(--color-deep)", fontWeight: 700 }}>Rose Nails</span>
            </div>
            <p style={{ color: "var(--color-muted)", fontSize: 13, margin: 0 }}>Reserva tu cita online</p>
          </div>
          <div style={{ width: 60 }} />
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: i < step ? "var(--color-deep)" : i === step ? "linear-gradient(135deg, var(--color-accent), var(--color-deep))" : "var(--color-line)",
                color: i <= step ? "#fff" : "var(--color-muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 13,
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 12, color: i === step ? "var(--color-deep)" : "var(--color-muted)", fontWeight: i === step ? 700 : 400, display: "none" }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ width: 20, height: 2, background: i < step ? "var(--color-deep)" : "var(--color-line)" }} />}
            </div>
          ))}
          <span style={{ marginLeft: 12, fontSize: 13, fontWeight: 600, color: "var(--color-deep)" }}>{STEPS[step]}</span>
        </div>

        {/* ── STEP 0: Elegir servicio ── */}
        {step === 0 && (
          <div>
            {Object.entries(grouped).map(([cat, svcs]) => (
              <div key={cat} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>
                  {CATEGORY_LABELS[cat] ?? cat}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 12 }}>
                  {svcs.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => { setSelected(s); setStep(1); }}
                      style={{ background: "var(--color-card)", borderRadius: 18, padding: "20px", cursor: "pointer", border: "1.5px solid var(--color-line)", boxShadow: "0 2px 8px rgba(139,58,82,0.05)", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-line)"; e.currentTarget.style.transform = ""; }}
                    >
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 15, marginBottom: 4, color: "var(--color-text)" }}>{s.name}</div>
                      {s.description && <div style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 8, lineHeight: 1.4 }}>{s.description}</div>}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "var(--color-muted)" }}>⏱ {s.durationMinutes} min</span>
                        <span style={{ fontWeight: 700, color: "var(--color-deep)", fontSize: 15 }}>€{s.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 1: Fecha y horario ── */}
        {step === 1 && selected && (
          <div>
            {/* Servicio seleccionado */}
            <div style={{ background: "var(--color-accent-soft)", borderRadius: 14, padding: "12px 18px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontWeight: 700, color: "var(--color-deep)" }}>{selected.name}</span>
                <span style={{ color: "var(--color-muted)", fontSize: 13, marginLeft: 8 }}>{selected.durationMinutes} min</span>
              </div>
              <span style={{ fontWeight: 700, color: "var(--color-deep)", fontSize: 16 }}>€{selected.price}</span>
            </div>

            {/* Selector de fecha — próximos 14 días */}
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 17, color: "var(--color-deep)", margin: "0 0 14px" }}>Elige el día</h3>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 24 }}>
              {dateOptions.map((d) => {
                const dayName = new Date(d + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
                const dayNum = new Date(d + "T12:00:00").getDate();
                const isSelected = d === selectedDate;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    style={{
                      flexShrink: 0, width: 56, padding: "10px 0", borderRadius: 14, cursor: "pointer",
                      border: isSelected ? "2px solid var(--color-deep)" : "1.5px solid var(--color-line)",
                      background: isSelected ? "linear-gradient(135deg, var(--color-accent), var(--color-deep))" : "white",
                      color: isSelected ? "#fff" : "var(--color-muted)",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>{dayName}</span>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{dayNum}</span>
                  </button>
                );
              })}
            </div>

            {/* Horarios disponibles */}
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 17, color: "var(--color-deep)", margin: "0 0 14px" }}>Elige la hora</h3>

            {slotsLoading && (
              <p style={{ color: "var(--color-muted)", fontSize: 14 }}>Cargando disponibilidad...</p>
            )}

            {!slotsLoading && !dayOpen && (
              <div style={{ background: "#fff0f0", borderRadius: 14, padding: "16px 20px", color: "#c0392b", fontSize: 14 }}>
                😔 Este día el salón está cerrado. Elige otro día.
              </div>
            )}

            {!slotsLoading && dayOpen && slots.length === 0 && (
              <div style={{ background: "#fff8f0", borderRadius: 14, padding: "16px 20px", color: "var(--color-warning)", fontSize: 14 }}>
                No hay horarios disponibles para este día. Prueba con otra fecha.
              </div>
            )}

            {!slotsLoading && dayOpen && slots.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                {slots.map((slot) => {
                  const isSelected = slot === selectedSlot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: "10px 18px", borderRadius: 12, cursor: "pointer",
                        border: isSelected ? "2px solid var(--color-deep)" : "1.5px solid var(--color-line)",
                        background: isSelected ? "linear-gradient(135deg, var(--color-accent), var(--color-deep))" : "white",
                        color: isSelected ? "#fff" : "var(--color-text)",
                        fontWeight: isSelected ? 700 : 500, fontSize: 15,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedSlot}
                style={{
                  flex: 1, padding: "13px", borderRadius: 14, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
                  color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "var(--font-body)",
                  opacity: !selectedSlot ? 0.45 : 1,
                }}
              >
                Continuar →
              </button>
              <button onClick={() => setStep(0)} style={{ background: "white", border: "1.5px solid var(--color-line)", borderRadius: 14, padding: "13px 20px", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                ← Volver
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Datos personales ── */}
        {step === 2 && selected && (
          <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 28, border: "1px solid var(--color-line)", boxShadow: "0 2px 12px rgba(139,58,82,0.06)" }}>
            <div style={{ background: "var(--color-accent-soft)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 14 }}>
              <strong>{selected.name}</strong> · {formatDateES(selectedDate)} · <strong>{selectedSlot}</strong>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {([
                { key: "name" as const,  label: "Tu nombre *",           type: "text",  required: true },
                { key: "phone" as const, label: "Teléfono / WhatsApp *", type: "tel",   required: true },
                { key: "email" as const, label: "Email (opcional)",       type: "email", required: false },
              ]).map(({ key, label, type, required }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type={type} required={required}
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Notas (alergias, preferencias...)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3} style={{ ...inputStyle, resize: "none" }}
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setStep(3)}
                  disabled={!form.name || !form.phone}
                  style={{ flex: 1, padding: "13px", borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))", color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "var(--font-body)", opacity: (!form.name || !form.phone) ? 0.45 : 1 }}
                >
                  Continuar →
                </button>
                <button onClick={() => setStep(1)} style={{ background: "white", border: "1.5px solid var(--color-line)", borderRadius: 14, padding: "13px 20px", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                  ← Volver
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirmar ── */}
        {step === 3 && selected && (
          <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 28, border: "1px solid var(--color-line)", boxShadow: "0 2px 12px rgba(139,58,82,0.06)" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 20, color: "var(--color-deep)", margin: "0 0 20px" }}>Confirma tu reserva</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 24 }}>
              {[
                { label: "Servicio", value: selected.name },
                { label: "Duración", value: `${selected.durationMinutes} min` },
                { label: "Precio", value: `€${selected.price}` },
                { label: "Día", value: formatDateES(selectedDate) },
                { label: "Hora", value: selectedSlot },
                { label: "Nombre", value: form.name },
                { label: "Teléfono", value: form.phone },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--color-line)", fontSize: 14 }}>
                  <span style={{ color: "var(--color-muted)" }}>{label}</span>
                  <strong style={{ color: "var(--color-text)" }}>{value}</strong>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={submit}
                disabled={sending}
                style={{ flex: 1, padding: "14px", borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))", color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "var(--font-body)" }}
              >
                {sending ? "Enviando..." : "✓ Confirmar reserva"}
              </button>
              <button onClick={() => setStep(2)} style={{ background: "white", border: "1.5px solid var(--color-line)", borderRadius: 14, padding: "14px 20px", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                ← Volver
              </button>
            </div>
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
  width: "100%", padding: "11px 14px", borderRadius: 12,
  border: "1.5px solid var(--color-line)", background: "#fdf8f6",
  fontSize: 15, color: "var(--color-text)", boxSizing: "border-box",
  fontFamily: "var(--font-body)",
};
