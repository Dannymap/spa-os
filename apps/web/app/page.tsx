import Link from "next/link";

const features = [
  { icon: "📅", title: "Agenda completa", desc: "Gestiona tus citas día a día, cambia estados y cobra en un clic." },
  { icon: "👤", title: "Ficha de clienta", desc: "Historial, preferencias, alergias y galería de fotos de cada trabajo." },
  { icon: "📸", title: "Galería de trabajos", desc: "Sube fotos de cada servicio directamente en la ficha de tu clienta." },
  { icon: "🌐", title: "Reserva online", desc: "Tus clientas reservan 24/7 desde Instagram, WhatsApp o QR." },
  { icon: "💰", title: "Control de caja", desc: "Registra ingresos por método de pago al completar cada cita." },
  { icon: "📊", title: "Balance financiero", desc: "Visualiza ingresos, gastos y beneficio neto por día, semana o mes." },
];

const services = [
  { cat: "💅 Manos", items: ["Manicura clásica", "Semipermanente", "Uñas acrílicas", "Uñas gel"] },
  { cat: "🦶 Pies", items: ["Pedicura clásica", "Semipermanente", "Pedicura spa"] },
  { cat: "✨ Cejas", items: ["Depilación", "Tinte", "Laminado"] },
  { cat: "👁️ Pestañas", items: ["Extensiones", "Lifting", "Relleno"] },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div className="brand-copy">
            <strong>SpaOS</strong>
            <span>Tu spa de manos, pies y más</span>
          </div>
        </div>
        <nav className="nav-links">
          <Link href="/reservar">Reservar cita</Link>
          <Link href="/agenda">Panel</Link>
          <Link className="pill-button primary" href="/reservar">Reservar ahora</Link>
        </nav>
      </header>

      <main style={{ fontFamily: "Georgia, serif" }}>
        {/* Hero */}
        <section style={{ textAlign: "center", padding: "80px 20px 60px", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>💅</div>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 52px)", color: "var(--color-accent)", lineHeight: 1.2, marginBottom: 16 }}>
            Tu spa, organizado y siempre listo
          </h1>
          <p style={{ fontSize: 18, color: "#888", maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Gestiona citas, fichas de clientas, fotos de trabajos y tus finanzas — todo en un solo lugar.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/reservar" style={{ background: "var(--color-accent)", color: "#fff", padding: "14px 32px", borderRadius: 16, fontWeight: 700, textDecoration: "none", fontSize: 16 }}>
              Reservar cita
            </Link>
            <Link href="/agenda" style={{ background: "var(--color-card)", color: "var(--color-text)", padding: "14px 32px", borderRadius: 16, fontWeight: 600, textDecoration: "none", fontSize: 16, border: "1.5px solid #e0d5cc" }}>
              Panel de gestión →
            </Link>
          </div>
        </section>

        {/* Servicios */}
        <section style={{ background: "var(--color-card)", padding: "56px 20px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: 28, marginBottom: 36, color: "var(--color-text)" }}>Nuestros servicios</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 20 }}>
              {services.map((s) => (
                <div key={s.cat} style={{ background: "var(--color-bg)", borderRadius: 18, padding: "20px 22px" }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: "var(--color-text)" }}>{s.cat}</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                    {s.items.map((item) => (
                      <li key={item} style={{ fontSize: 14, color: "#888" }}>· {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <Link href="/reservar" style={{ background: "var(--color-accent)", color: "#fff", padding: "12px 28px", borderRadius: 14, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
                Ver todos los servicios y reservar
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: "60px 20px", maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 26, marginBottom: 36, color: "var(--color-text)" }}>Herramientas para gestionar tu negocio</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} style={{ background: "var(--color-card)", borderRadius: 18, padding: "24px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "var(--color-text)" }}>{f.title}</h3>
                <p style={{ margin: 0, color: "#888", fontSize: 14, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section style={{ background: "var(--color-accent)", padding: "56px 20px", textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: 28, marginBottom: 12 }}>¿Listas para reservar?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginBottom: 28 }}>Elige tu servicio y tu horario preferido.</p>
          <Link href="/reservar" style={{ background: "#fff", color: "var(--color-accent)", padding: "14px 36px", borderRadius: 16, fontWeight: 700, textDecoration: "none", fontSize: 16 }}>
            Reservar ahora
          </Link>
        </section>
      </main>
    </div>
  );
}
