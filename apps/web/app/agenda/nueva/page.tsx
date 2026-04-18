"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/dashboard-shell";

type Client = { id: string; name: string; phone?: string };
type Service = { id: string; name: string; price: number; durationMinutes: number; category: string };

function pad(n: number) { return String(n).padStart(2, "0"); }
function nowLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function NuevaCitaPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({ clientId: "", serviceId: "", date: nowLocal(), notes: "", price: "" });
  const [saving, setSaving] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/clients?q=${clientSearch}`).then((r) => r.json()).then(setClients);
    }, 250);
    return () => clearTimeout(t);
  }, [clientSearch]);

  function onServiceChange(id: string) {
    const svc = services.find((s) => s.id === id);
    setForm((f) => ({ ...f, serviceId: id, price: svc ? String(svc.price) : f.price }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    });
    router.push("/agenda");
  }

  return (
    <DashboardShell title="Nueva cita" description="Registrar una cita en la agenda" activePath="/agenda">
      <div style={{ maxWidth: 560 }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Clienta */}
          <div>
            <label style={lbl}>Clienta</label>
            <input
              placeholder="Buscar por nombre o teléfono..."
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              style={input}
            />
            {clients.length > 0 && !form.clientId && (
              <div style={{ border: "1.5px solid #e0d5cc", borderRadius: 10, overflow: "hidden", marginTop: 4 }}>
                {clients.slice(0, 6).map((c) => (
                  <div key={c.id} onClick={() => { setForm((f) => ({ ...f, clientId: c.id })); setClientSearch(c.name); setClients([]); }}
                    style={{ padding: "10px 14px", cursor: "pointer", background: "var(--color-card)", borderBottom: "1px solid #f0e8e0", fontSize: 14 }}>
                    {c.name} {c.phone && <span style={{ color: "#aaa" }}>· {c.phone}</span>}
                  </div>
                ))}
              </div>
            )}
            {!form.clientId && (
              <div style={{ marginTop: 6, fontSize: 13 }}>
                <a href="/clientas/nueva" style={{ color: "var(--color-accent)" }}>+ Crear nueva clienta</a>
              </div>
            )}
          </div>

          {/* Servicio */}
          <div>
            <label style={lbl}>Servicio</label>
            <select value={form.serviceId} onChange={(e) => onServiceChange(e.target.value)} required style={input}>
              <option value="">Seleccionar servicio...</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — €{s.price} ({s.durationMinutes}min)</option>
              ))}
            </select>
          </div>

          {/* Fecha y hora */}
          <div>
            <label style={lbl}>Fecha y hora</label>
            <input type="datetime-local" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required style={input} />
          </div>

          {/* Precio */}
          <div>
            <label style={lbl}>Precio (€)</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required style={input} placeholder="0.00" />
          </div>

          {/* Notas */}
          <div>
            <label style={lbl}>Notas (opcional)</label>
            <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} style={{ ...input, height: 80, resize: "vertical" }} placeholder="Indicaciones, preferencias..." />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" disabled={saving || !form.clientId} style={{ background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 14, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", opacity: saving || !form.clientId ? 0.6 : 1 }}>
              {saving ? "Guardando..." : "Guardar cita"}
            </button>
            <button type="button" onClick={() => router.back()} style={{ background: "transparent", border: "1.5px solid #e0d5cc", borderRadius: 14, padding: "12px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

const lbl: React.CSSProperties = { display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14 };
const input: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0d5cc", background: "var(--color-card)", fontSize: 15, color: "var(--color-text)", boxSizing: "border-box" };
