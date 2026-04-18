"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/dashboard-shell";

export default function NuevaClientaPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", allergies: "", preferredShape: "", preferredLength: "", favoriteColors: "", notes: "", isVip: false });
  const [saving, setSaving] = useState(false);

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        favoriteColors: form.favoriteColors.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    const client = await res.json();
    router.push(`/clientas/${client.id}`);
  }

  return (
    <DashboardShell title="Nueva clienta" description="Crear ficha de clienta" activePath="/clientas">
      <div style={{ maxWidth: 560 }}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { key: "name", label: "Nombre *", type: "text", required: true },
            { key: "phone", label: "Teléfono", type: "tel" },
            { key: "email", label: "Email", type: "email" },
            { key: "allergies", label: "Alergias (productos a evitar)", type: "text" },
            { key: "preferredShape", label: "Forma de uñas preferida", type: "text", placeholder: "Ej: almendra, cuadrada..." },
            { key: "preferredLength", label: "Largo preferido", type: "text", placeholder: "Ej: corto, medio, largo..." },
            { key: "favoriteColors", label: "Colores favoritos (separados por coma)", type: "text", placeholder: "Ej: nude, rojo, rosa..." },
          ].map(({ key, label, type, required, placeholder }) => (
            <div key={key}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 5, fontSize: 14 }}>{label}</label>
              <input
                type={type} required={required} placeholder={placeholder}
                value={(form as unknown as Record<string, string>)[key]}
                onChange={(e) => set(key, e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0d5cc", background: "var(--color-card)", fontSize: 15, color: "var(--color-text)", boxSizing: "border-box" }}
              />
            </div>
          ))}

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 5, fontSize: 14 }}>Notas internas</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0d5cc", background: "var(--color-card)", fontSize: 15, height: 80, resize: "vertical", boxSizing: "border-box" }}
              placeholder="Notas privadas sobre la clienta..." />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 15 }}>
            <input type="checkbox" checked={form.isVip} onChange={(e) => set("isVip", e.target.checked)} />
            <span>Marcar como VIP</span>
          </label>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="submit" disabled={saving}
              style={{ background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 14, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Guardando..." : "Crear clienta"}
            </button>
            <button type="button" onClick={() => router.back()}
              style={{ background: "transparent", border: "1.5px solid #e0d5cc", borderRadius: 14, padding: "12px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
