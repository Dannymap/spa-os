"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/dashboard-shell";

type Photo = { id: string; url: string; description?: string; createdAt: string; booking?: { service: { name: string } } };
type Booking = { id: string; date: string; status: string; price: number; service: { name: string; category: string }; photos: Photo[] };
type Client = {
  id: string; name: string; phone?: string; email?: string;
  isVip: boolean; allergies?: string; notes?: string;
  birthdate?: string; preferredShape?: string; preferredLength?: string;
  favoriteColors: string[]; photoUrl?: string;
  bookings: Booking[]; photos: Photo[];
};

const STATUS_COLORS: Record<string, string> = { completada: "#2b7a62", cancelada: "#c0392b", no_show: "#888", prevista: "#b5771a", en_curso: "#2b7a62" };

export default function FichaClientaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Client>>({});
  const [uploading, setUploading] = useState(false);
  const [photoDesc, setPhotoDesc] = useState("");
  const [mounted, setMounted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  async function load() {
    const res = await fetch(`/api/clients/${id}`);
    const data = await res.json();
    setClient(data);
    setForm(data);
  }

  useEffect(() => { load(); }, [id]);

  async function saveClient() {
    await fetch(`/api/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditing(false);
    load();
  }

  async function uploadPhoto(file: File, isProfile = false) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await res.json();

    if (isProfile) {
      await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: url }),
      });
    } else {
      await fetch(`/api/clients/${id}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, description: photoDesc }),
      });
      setPhotoDesc("");
    }
    setUploading(false);
    load();
  }

  async function deletePhoto(photoId: string) {
    await fetch(`/api/clients/${id}/photos?photoId=${photoId}`, { method: "DELETE" });
    load();
  }

  if (!client || !mounted) return <DashboardShell title="Cargando..." description="" activePath="/clientas"><p style={{ color: "#aaa" }}>Cargando ficha...</p></DashboardShell>;

  const totalSpent = client.bookings.filter((b) => b.status === "completada").reduce((s, b) => s + b.price, 0);

  return (
    <DashboardShell title={client.name} description="Ficha completa de clienta" activePath="/clientas">
      <button onClick={() => router.back()} style={{ marginBottom: 20, background: "none", border: "none", color: "var(--color-accent)", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>← Volver</button>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24, alignItems: "start" }}>
        {/* Panel izquierdo — datos de la clienta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Foto de perfil */}
          <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 24, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
              {client.photoUrl ? (
                <img src={client.photoUrl} alt={client.name} style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 36, fontWeight: 700 }}>
                  {client.name[0].toUpperCase()}
                </div>
              )}
              <button onClick={() => profileRef.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, background: "var(--color-accent)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", color: "#fff", fontSize: 14 }}>📷</button>
              <input ref={profileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0], true)} />
            </div>

            <div style={{ fontWeight: 700, fontSize: 22 }}>{client.name}</div>
            {client.isVip && <span style={{ background: "#b5771a22", color: "#b5771a", borderRadius: 20, padding: "3px 14px", fontSize: 12, fontWeight: 700 }}>⭐ VIP</span>}
            <div style={{ marginTop: 12, fontSize: 13, color: "#888", display: "flex", flexDirection: "column", gap: 4 }}>
              {client.phone && <span>📞 {client.phone}</span>}
              {client.email && <span>✉️ {client.email}</span>}
              {client.birthdate && <span>🎂 {new Date(client.birthdate).toLocaleDateString("es-ES")}</span>}
            </div>
            <div style={{ marginTop: 14, fontSize: 13, color: "#888" }}>
              <strong style={{ color: "var(--color-accent)", fontSize: 18 }}>€{totalSpent.toFixed(2)}</strong> gastado en total · {client.bookings.filter((b) => b.status === "completada").length} visitas
            </div>
          </div>

          {/* Preferencias */}
          <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Preferencias</h3>
              <button onClick={() => setEditing(!editing)} style={{ background: "none", border: "1.5px solid #e0d5cc", borderRadius: 10, padding: "4px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{editing ? "Cancelar" : "Editar"}</button>
            </div>

            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { key: "name", label: "Nombre", type: "text" },
                  { key: "phone", label: "Teléfono", type: "tel" },
                  { key: "email", label: "Email", type: "email" },
                  { key: "preferredShape", label: "Forma", type: "text" },
                  { key: "preferredLength", label: "Largo", type: "text" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>{label}</label>
                    <input type={type} value={(form as Record<string, string>)[key] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e0d5cc", background: "#faf8f5", fontSize: 14, boxSizing: "border-box" }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>Alergias</label>
                  <input value={form.allergies ?? ""} onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e0d5cc", background: "#faf8f5", fontSize: 14, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>Colores favoritos (separados por coma)</label>
                  <input value={(form.favoriteColors ?? []).join(", ")} onChange={(e) => setForm((f) => ({ ...f, favoriteColors: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e0d5cc", background: "#faf8f5", fontSize: 14, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>Notas internas</label>
                  <textarea value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e0d5cc", background: "#faf8f5", fontSize: 14, height: 70, resize: "vertical", boxSizing: "border-box" }} />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.isVip ?? false} onChange={(e) => setForm((f) => ({ ...f, isVip: e.target.checked }))} />
                  Clienta VIP
                </label>
                <button onClick={saveClient} style={{ background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer" }}>Guardar cambios</button>
              </div>
            ) : (
              <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: 13, margin: 0 }}>
                {[
                  { k: "Forma", v: client.preferredShape },
                  { k: "Largo", v: client.preferredLength },
                  { k: "Alergias", v: client.allergies },
                  { k: "Notas", v: client.notes },
                ].filter((i) => i.v).map(({ k, v }) => (
                  <div key={k}>
                    <dt style={{ color: "#aaa", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{k}</dt>
                    <dd style={{ margin: 0, fontWeight: 600, color: k === "Alergias" ? "#c0392b" : "var(--color-text)" }}>{v}</dd>
                  </div>
                ))}
                {client.favoriteColors.length > 0 && (
                  <div style={{ gridColumn: "1/-1" }}>
                    <dt style={{ color: "#aaa", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Colores</dt>
                    <dd style={{ margin: 0, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {client.favoriteColors.map((c) => <span key={c} style={{ background: "#e0d5cc", borderRadius: 20, padding: "2px 10px", fontSize: 11 }}>{c}</span>)}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>

        {/* Panel derecho */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Subir foto de trabajo */}
          <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>📸 Subir foto del servicio</h3>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input
                placeholder="Descripción (opcional)..."
                value={photoDesc}
                onChange={(e) => setPhotoDesc(e.target.value)}
                style={{ flex: 1, padding: "8px 14px", borderRadius: 10, border: "1.5px solid #e0d5cc", background: "#faf8f5", fontSize: 14 }}
              />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                {uploading ? "Subiendo..." : "📎 Subir foto"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
            </div>
          </div>

          {/* Galería de fotos */}
          {client.photos.length > 0 && (
            <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Galería de trabajos</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }}>
                {client.photos.map((p) => (
                  <div key={p.id} style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
                    <img src={p.url} alt={p.description ?? "foto"} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                    {p.description && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 10, padding: "4px 8px" }}>{p.description}</div>}
                    <button onClick={() => deletePhoto(p.id)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", fontSize: 12 }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historial de citas */}
          <div style={{ background: "var(--color-card)", borderRadius: 20, padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Historial de citas</h3>
              <a href={`/agenda/nueva?clientId=${client.id}`} style={{ background: "var(--color-accent)", color: "#fff", padding: "6px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>+ Nueva cita</a>
            </div>
            {client.bookings.length === 0 ? (
              <p style={{ color: "#aaa", fontSize: 14 }}>Sin citas registradas.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {client.bookings.map((b) => (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#faf8f5", borderRadius: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{b.service.name}</div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>{new Date(b.date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: "var(--color-accent)" }}>€{b.price.toFixed(2)}</div>
                    <span style={{ background: (STATUS_COLORS[b.status] ?? "#888") + "22", color: STATUS_COLORS[b.status] ?? "#888", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
