"use client";

import { useState } from "react";

type Service = {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  description: string | null;
};

const CATEGORIES = ["manos", "pies", "cejas", "pestanas", "depilacion", "packs", "otros"];

const CATEGORY_LABELS: Record<string, string> = {
  manos: "💅 Manos",
  pies: "🦶 Pies",
  cejas: "✨ Cejas",
  pestanas: "👁 Pestañas",
  depilacion: "🌿 Depilación",
  packs: "🎁 Packs",
  otros: "➕ Otros",
};

const emptyForm = { name: "", category: "manos", durationMinutes: 60, price: 0, description: "" };

export function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string>("todas");

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      name: s.name,
      category: s.category,
      durationMinutes: s.durationMinutes,
      price: s.price,
      description: s.description ?? "",
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/services/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, durationMinutes: Number(form.durationMinutes), price: Number(form.price) }),
        });
        const updated = await res.json();
        setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, durationMinutes: Number(form.durationMinutes), price: Number(form.price) }),
        });
        const created = await res.json();
        setServices((prev) => [...prev, created]);
      }
      closeForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este servicio? Ya no aparecerá en el catálogo.")) return;
    setDeletingId(id);
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    setServices((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
  }

  const filtered = filterCat === "todas" ? services : services.filter((s) => s.category === filterCat);
  const grouped = CATEGORIES.reduce<Record<string, Service[]>>((acc, cat) => {
    const list = filtered.filter((s) => s.category === cat);
    if (list.length) acc[cat] = list;
    return acc;
  }, {});

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["todas", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              style={{
                padding: "7px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer",
                border: "1px solid var(--color-line)",
                background: filterCat === cat ? "linear-gradient(135deg, var(--color-accent), var(--color-deep))" : "white",
                color: filterCat === cat ? "#fff" : "var(--color-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              {cat === "todas" ? "Todas" : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        <button
          onClick={openNew}
          style={{
            padding: "10px 22px", borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: "pointer",
            background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
            color: "#fff", border: "none", fontFamily: "var(--font-body)",
            boxShadow: "0 4px 14px rgba(139,58,82,0.25)",
          }}
        >
          + Nuevo servicio
        </button>
      </div>

      {/* ── Service list by category ── */}
      {Object.keys(grouped).length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-muted)", fontSize: 15 }}>
          No hay servicios en esta categoría.
        </div>
      )}

      {Object.entries(grouped).map(([cat, list]) => (
        <div key={cat} style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--color-deep)", margin: "0 0 12px", letterSpacing: "0.02em" }}>
            {CATEGORY_LABELS[cat] ?? cat}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {list.map((s) => (
              <div key={s.id} style={{
                background: "var(--color-card)", borderRadius: 18,
                border: "1px solid var(--color-line)", padding: "20px 20px 16px",
                boxShadow: "0 2px 10px rgba(139,58,82,0.05)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--color-text)", lineHeight: 1.3 }}>
                    {s.name}
                  </h4>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 10 }}>
                    <button
                      onClick={() => openEdit(s)}
                      style={{ background: "var(--color-accent-soft)", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, cursor: "pointer", color: "var(--color-deep)", fontWeight: 600, fontFamily: "var(--font-body)" }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={deletingId === s.id}
                      style={{ background: "#fff0f0", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, cursor: "pointer", color: "#c0392b", fontWeight: 600, fontFamily: "var(--font-body)" }}
                    >
                      {deletingId === s.id ? "..." : "Borrar"}
                    </button>
                  </div>
                </div>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--color-muted)" }}>
                  {s.durationMinutes} min · <strong style={{ color: "var(--color-deep)" }}>€{s.price}</strong>
                </p>
                {s.description && (
                  <p style={{ margin: 0, fontSize: 13, color: "var(--color-muted)", lineHeight: 1.5 }}>{s.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ── Modal form ── */}
      {showForm && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeForm(); }}
          style={{
            position: "fixed", inset: 0, background: "rgba(44,26,26,0.45)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20,
          }}
        >
          <div style={{
            background: "var(--color-card)", borderRadius: 24, padding: "32px 28px",
            width: "100%", maxWidth: 460, boxShadow: "0 20px 60px rgba(44,26,26,0.25)",
            border: "1px solid var(--color-line)",
          }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: "var(--color-deep)", margin: "0 0 24px" }}>
              {editing ? "Editar servicio" : "Nuevo servicio"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Nombre */}
              <div>
                <label style={labelStyle}>Nombre del servicio</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ej. Manicura semipermanente"
                  style={inputStyle}
                />
              </div>

              {/* Categoría */}
              <div>
                <label style={labelStyle}>Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={inputStyle}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>

              {/* Duración + Precio */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Duración (min)</label>
                  <input
                    type="number" min={5} step={5}
                    value={form.durationMinutes}
                    onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Precio (€)</label>
                  <input
                    type="number" min={0} step={0.5}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label style={labelStyle}>Descripción (opcional)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detalles del servicio..."
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button
                onClick={closeForm}
                style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid var(--color-line)", background: "white", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--color-muted)" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                style={{
                  flex: 2, padding: "12px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
                  color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "var(--font-body)",
                  opacity: saving || !form.name.trim() ? 0.7 : 1,
                }}
              >
                {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear servicio"}
              </button>
            </div>
          </div>
        </div>
      )}
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
  fontSize: 15, color: "var(--color-text)", boxSizing: "border-box", outline: "none",
  fontFamily: "var(--font-body)",
};
