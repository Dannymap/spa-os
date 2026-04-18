"use client";

import { useEffect, useState } from "react";

type Service = { id: string; name: string; category: string; durationMinutes: number; price: number; description?: string };

const CATEGORY_LABELS: Record<string, string> = {
  manos: "💅 Manos", pies: "🦶 Pies", cejas: "✨ Cejas",
  pestanas: "👁️ Pestañas", depilacion: "🌸 Depilación", otros: "💆 Otros",
};

const STEPS = ["Servicio", "Tus datos", "Confirmar"];

export default function ReservarPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Service | null>(null);
  const [date, setDate] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => { fetch("/api/services").then((r) => r.json()).then(setServices); }, []);

  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  async function submit() {
    setSending(true);
    // Busca o crea clienta por teléfono, luego crea la cita
    const clientRes = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email }),
    });
    const client = await clientRes.json();

    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: client.id,
        serviceId: selected!.id,
        date: new Date(date).toISOString(),
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
      <div style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
        <div style={{ background: "var(--color-card)", borderRadius: 24, padding: "48px 40px", textAlign: "center", maxWidth: 440, boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: "var(--color-accent)", marginBottom: 8 }}>¡Cita confirmada!</h2>
          <p style={{ color: "#888", marginBottom: 24 }}>Hola <strong>{form.name}</strong>, tu cita para <strong>{selected?.name}</strong> ha sido registrada. Te contactaremos por WhatsApp para confirmar.</p>
          <button onClick={() => { setSubmitted(false); setStep(0); setSelected(null); setForm({ name: "", phone: "", email: "", notes: "" }); }}
            style={{ background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 14, padding: "12px 28px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
            Hacer otra reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", fontFamily: "Georgia, serif", padding: "40px 20px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ color: "var(--color-accent)", fontSize: 32, marginBottom: 8 }}>Reserva tu cita</h1>
          <p style={{ color: "#888", fontSize: 16 }}>Elige tu servicio y te contactamos para confirmar</p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: i <= step ? "var(--color-accent)" : "#e0d5cc", color: i <= step ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{i + 1}</div>
              <span style={{ fontSize: 13, color: i <= step ? "var(--color-text)" : "#aaa", fontWeight: i === step ? 700 : 400 }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ width: 24, height: 2, background: "#e0d5cc" }} />}
            </div>
          ))}
        </div>

        {/* Step 0 — Elegir servicio */}
        {step === 0 && (
          <div>
            {Object.entries(grouped).map(([cat, svcs]) => (
              <div key={cat} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, marginBottom: 12, color: "#888" }}>{CATEGORY_LABELS[cat] ?? cat}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
                  {svcs.map((s) => (
                    <div key={s.id} onClick={() => { setSelected(s); setStep(1); }}
                      style={{ background: "var(--color-card)", borderRadius: 16, padding: "18px 20px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "transform 0.15s, box-shadow 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.name}</div>
                      {s.description && <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>{s.description}</div>}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888" }}>
                        <span>⏱ {s.durationMinutes}min</span>
                        <span style={{ fontWeight: 700, color: "var(--color-accent)", fontSize: 16 }}>€{s.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 1 — Datos + fecha */}
        {step === 1 && selected && (
          <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ background: "var(--color-accent)11", borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
              <strong>{selected.name}</strong> — {selected.durationMinutes}min — <strong style={{ color: "var(--color-accent)" }}>€{selected.price}</strong>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "name", label: "Tu nombre *", type: "text", required: true },
                { key: "phone", label: "Teléfono / WhatsApp *", type: "tel", required: true },
                { key: "email", label: "Email (opcional)", type: "email" },
              ].map(({ key, label, type, required }) => (
                <div key={key}>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 5, fontSize: 14 }}>{label}</label>
                  <input type={type} required={required} value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0d5cc", background: "#faf8f5", fontSize: 15, boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 5, fontSize: 14 }}>Fecha y hora preferida *</label>
                <input type="datetime-local" required value={date} onChange={(e) => setDate(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0d5cc", background: "#faf8f5", fontSize: 15, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 5, fontSize: 14 }}>Notas adicionales</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Preferencias, alergias, alguna indicación..." rows={3}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0d5cc", background: "#faf8f5", fontSize: 15, resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setStep(2)} disabled={!form.name || !form.phone || !date}
                  style={{ flex: 1, background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 14, padding: "12px", fontWeight: 700, cursor: "pointer", opacity: (!form.name || !form.phone || !date) ? 0.5 : 1 }}>
                  Continuar →
                </button>
                <button type="button" onClick={() => setStep(0)} style={{ background: "transparent", border: "1.5px solid #e0d5cc", borderRadius: 14, padding: "12px 20px", cursor: "pointer" }}>← Volver</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Confirmar */}
        {step === 2 && selected && (
          <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 20px" }}>Confirma tu reserva</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Servicio", value: selected.name },
                { label: "Duración", value: `${selected.durationMinutes} minutos` },
                { label: "Precio", value: `€${selected.price}` },
                { label: "Fecha", value: date ? new Date(date).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : "" },
                { label: "Nombre", value: form.name },
                { label: "Teléfono", value: form.phone },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0e8e0", fontSize: 14 }}>
                  <span style={{ color: "#888" }}>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={submit} disabled={sending}
                style={{ flex: 1, background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontWeight: 700, cursor: "pointer", fontSize: 16 }}>
                {sending ? "Enviando..." : "✓ Confirmar reserva"}
              </button>
              <button type="button" onClick={() => setStep(1)} style={{ background: "transparent", border: "1.5px solid #e0d5cc", borderRadius: 14, padding: "14px 20px", cursor: "pointer" }}>← Volver</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
