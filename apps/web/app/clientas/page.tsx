"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/dashboard-shell";

type Client = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  isVip: boolean;
  allergies?: string;
  favoriteColors: string[];
  preferredShape?: string;
  preferredLength?: string;
  photoUrl?: string;
  bookings: { date: string; service: { name: string } }[];
  photos: { url: string }[];
};

export default function ClientasPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/clients?q=${q}`);
      setClients(await res.json());
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const vipCount = clients.filter((c) => c.isVip).length;
  const withAllergies = clients.filter((c) => c.allergies).length;

  return (
    <DashboardShell title="Clientas" description="Fichas y historial" activePath="/clientas">
      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: "Total clientas", value: clients.length },
          { label: "VIP", value: vipCount },
          { label: "Con alergias", value: withAllergies },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--color-card)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "var(--color-accent)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Buscador */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center" }}>
        <input
          placeholder="Buscar por nombre, teléfono o email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, padding: "10px 16px", borderRadius: 12, border: "1.5px solid #e0d5cc", background: "var(--color-card)", fontSize: 15, color: "var(--color-text)" }}
        />
        <a href="/clientas/nueva" style={{ background: "var(--color-accent)", color: "#fff", padding: "10px 22px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontSize: 14, whiteSpace: "nowrap" }}>
          + Nueva clienta
        </a>
      </div>

      {/* Grid de clientas */}
      {loading ? (
        <p style={{ color: "#888" }}>Cargando...</p>
      ) : clients.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
          <p>No se encontraron clientas.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 18 }}>
          {clients.map((c) => {
            const lastBooking = c.bookings[0];
            return (
              <a key={c.id} href={`/clientas/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "var(--color-card)", borderRadius: 20, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "transform 0.15s", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                    {c.photoUrl ? (
                      <img src={c.photoUrl} alt={c.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20 }}>
                        {c.name[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                      {c.phone && <div style={{ fontSize: 13, color: "#888" }}>{c.phone}</div>}
                    </div>
                    {c.isVip && <span style={{ marginLeft: "auto", background: "#b5771a22", color: "#b5771a", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>VIP</span>}
                  </div>

                  {c.allergies && (
                    <div style={{ background: "#c0392b11", color: "#c0392b", borderRadius: 8, padding: "4px 10px", fontSize: 12, marginBottom: 8 }}>
                      ⚠️ {c.allergies}
                    </div>
                  )}

                  {c.favoriteColors.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      {c.favoriteColors.map((col) => (
                        <span key={col} style={{ background: "#e0d5cc", borderRadius: 20, padding: "2px 10px", fontSize: 11 }}>{col}</span>
                      ))}
                    </div>
                  )}

                  {lastBooking && (
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
                      Última visita: {new Date(lastBooking.date).toLocaleDateString("es-ES")} · {lastBooking.service.name}
                    </div>
                  )}

                  {c.photos[0] && (
                    <img src={c.photos[0].url} alt="último trabajo" style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 10, marginTop: 10 }} />
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
