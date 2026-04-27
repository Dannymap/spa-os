"use client";

import { useState } from "react";

type Worker = { id: string; name: string; active: boolean };

export function WorkersManager({ initialWorkers }: { initialWorkers: Worker[] }) {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function handleAdd() {
    if (!newName.trim()) return;
    setSaving(true);
    const res = await fetch("/api/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const created = await res.json();
    setWorkers((prev) => [...prev, created]);
    setNewName("");
    setSaving(false);
  }

  async function handleRename(id: string) {
    if (!editName.trim()) return;
    const res = await fetch(`/api/workers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    });
    const updated = await res.json();
    setWorkers((prev) => prev.map((w) => (w.id === id ? updated : w)));
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Desactivar esta trabajadora?")) return;
    await fetch(`/api/workers/${id}`, { method: "DELETE" });
    setWorkers((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 20, color: "var(--color-deep)", margin: "0 0 6px" }}>
        Trabajadoras
      </h2>
      <p style={{ fontSize: 13, color: "var(--color-muted)", margin: "0 0 20px" }}>
        Las trabajadoras se asignan a las citas para controlar la disponibilidad individual.
      </p>

      {/* Lista */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {workers.length === 0 && (
          <p style={{ color: "var(--color-muted)", fontSize: 14 }}>No hay trabajadoras añadidas todavía.</p>
        )}
        {workers.map((w) => (
          <div key={w.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "var(--color-card)", borderRadius: 14,
            border: "1px solid var(--color-line)", padding: "12px 18px",
          }}>
            {editingId === w.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRename(w.id); if (e.key === "Escape") setEditingId(null); }}
                  autoFocus
                  style={{ flex: 1, padding: "7px 12px", borderRadius: 8, border: "1.5px solid var(--color-accent)", fontSize: 14, fontFamily: "var(--font-body)" }}
                />
                <button onClick={() => handleRename(w.id)} style={smBtn("var(--color-deep)", "#fff")}>Guardar</button>
                <button onClick={() => setEditingId(null)} style={smBtn("transparent", "var(--color-muted)", "1px solid var(--color-line)")}>Cancelar</button>
              </>
            ) : (
              <>
                <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>👤 {w.name}</span>
                <button onClick={() => { setEditingId(w.id); setEditName(w.name); }} style={smBtn("var(--color-accent-soft)", "var(--color-deep)")}>Editar</button>
                <button onClick={() => handleDelete(w.id)} style={smBtn("#fff0f0", "#c0392b")}>Eliminar</button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Añadir nueva */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder="Nombre de la trabajadora..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--color-line)", background: "var(--color-card)", fontSize: 14, fontFamily: "var(--font-body)" }}
        />
        <button
          onClick={handleAdd}
          disabled={saving || !newName.trim()}
          style={{ padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))", color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "var(--font-body)", opacity: saving || !newName.trim() ? 0.6 : 1 }}
        >
          + Añadir
        </button>
      </div>
    </div>
  );
}

function smBtn(bg: string, color: string, border?: string): React.CSSProperties {
  return {
    padding: "6px 12px", borderRadius: 8, border: border ?? "none",
    background: bg, color, fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: "var(--font-body)",
  };
}
