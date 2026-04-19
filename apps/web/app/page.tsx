import Link from "next/link";

const services = [
  {
    cat: "Manos",
    icon: "💅",
    items: ["Manicura clásica", "Semipermanente", "Uñas acrílicas", "Uñas gel", "Nail art"],
  },
  {
    cat: "Pies",
    icon: "🦶",
    items: ["Pedicura clásica", "Semipermanente", "Pedicura spa", "Esmaltado"],
  },
  {
    cat: "Cejas & Pestañas",
    icon: "✨",
    items: ["Depilación cejas", "Tinte cejas", "Laminado", "Extensiones", "Lifting"],
  },
  {
    cat: "Packs especiales",
    icon: "🎁",
    items: ["Pack novia", "Pack cumpleaños", "Pack mamá e hija", "Pack relax total"],
  },
];

const features = [
  { icon: "🗓", title: "Reserva online 24/7", desc: "Elige tu servicio, fecha y hora desde cualquier dispositivo." },
  { icon: "💌", title: "Confirmación inmediata", desc: "Recibe confirmación de tu cita al instante." },
  { icon: "🌿", title: "Ambiente de lujo", desc: "Un espacio pensado para que te relajes y desconectes." },
  { icon: "⭐", title: "Resultados impecables", desc: "Productos de primera calidad y técnicas exclusivas." },
];

export default function HomePage() {
  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--color-text)" }}>

      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(253,248,245,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-line)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
              display: "grid", placeItems: "center", fontSize: 18,
            }}>🌸</div>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 20, color: "var(--color-deep)", fontWeight: 700, letterSpacing: "-0.3px" }}>
              Rose Nails
            </span>
          </div>
          {/* Nav */}
          <nav style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a href="#servicios" style={{ padding: "8px 16px", borderRadius: 999, fontSize: 14, fontWeight: 500, color: "var(--color-muted)" }}>
              Servicios
            </a>
            <a href="#nosotros" style={{ padding: "8px 16px", borderRadius: 999, fontSize: 14, fontWeight: 500, color: "var(--color-muted)" }}>
              Nosotros
            </a>
            <Link href="/reservar" style={{
              padding: "10px 22px", borderRadius: 999,
              background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
              color: "#fff", fontWeight: 600, fontSize: 14,
            }}>
              Reservar cita
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(160deg, #fdf8f5 0%, #f9ece8 50%, #fdf0ea 100%)",
        padding: "100px 24px 90px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 20 }}>
            Manicura · Pedicura · Cejas · Pestañas
          </p>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontSize: "clamp(40px, 7vw, 72px)",
            lineHeight: 1.08, color: "var(--color-deep)", margin: "0 0 24px",
          }}>
            El arte de cuidar<br />
            <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>cada detalle</em>
          </h1>
          <p style={{ fontSize: 17, color: "var(--color-muted)", lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
            En Rose Nails cada cita es una experiencia. Reserva online y llega a disfrutar.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/reservar" style={{
              padding: "15px 36px", borderRadius: 999,
              background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
              color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.03em",
              boxShadow: "0 8px 24px rgba(139,58,82,0.25)",
            }}>
              Reservar ahora
            </Link>
            <a href="#servicios" style={{
              padding: "15px 36px", borderRadius: 999,
              border: "1.5px solid var(--color-line)",
              background: "rgba(255,255,255,0.7)",
              color: "var(--color-deep)", fontWeight: 600, fontSize: 15,
            }}>
              Ver servicios
            </a>
          </div>
        </div>

        {/* Floating badges */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
          {["✓ Sin esperas", "✓ Productos premium", "✓ Ambiente íntimo", "✓ Resultados duraderos"].map((b) => (
            <span key={b} style={{
              padding: "8px 16px", borderRadius: 999, background: "white",
              border: "1px solid var(--color-line)", fontSize: 13, fontWeight: 500,
              color: "var(--color-deep)", boxShadow: "0 2px 8px rgba(139,58,82,0.06)",
            }}>
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* ── Servicios ── */}
      <section id="servicios" style={{ padding: "90px 24px", background: "var(--color-bg)" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>
              Lo que ofrecemos
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 4vw, 44px)", color: "var(--color-deep)", margin: 0 }}>
              Nuestros servicios
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {services.map((s) => (
              <div key={s.cat} style={{
                background: "var(--color-card)", borderRadius: 22,
                border: "1px solid var(--color-line)", padding: "28px 24px",
                boxShadow: "0 2px 12px rgba(139,58,82,0.06)",
              }}>
                <div style={{ fontSize: 30, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, margin: "0 0 14px", color: "var(--color-deep)" }}>
                  {s.cat}
                </h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                  {s.items.map((item) => (
                    <li key={item} style={{ fontSize: 14, color: "var(--color-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "var(--color-accent)", fontSize: 10 }}>◆</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Link href="/reservar" style={{
              padding: "13px 32px", borderRadius: 999,
              background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
              color: "#fff", fontWeight: 600, fontSize: 15,
              boxShadow: "0 6px 20px rgba(139,58,82,0.2)",
            }}>
              Reservar mi cita →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Por qué elegirnos ── */}
      <section id="nosotros" style={{ padding: "90px 24px", background: "linear-gradient(160deg, #f9ece8, var(--color-bg))" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>
              Por qué elegirnos
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(26px, 4vw, 40px)", color: "var(--color-deep)", margin: 0 }}>
              Una experiencia diferente
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} style={{
                background: "var(--color-card)", borderRadius: 20,
                border: "1px solid var(--color-line)", padding: "28px 22px",
                boxShadow: "0 2px 12px rgba(139,58,82,0.05)",
              }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, margin: "0 0 8px", color: "var(--color-text)" }}>
                  {f.title}
                </h3>
                <p style={{ margin: 0, color: "var(--color-muted)", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "90px 24px", textAlign: "center",
        background: "linear-gradient(135deg, var(--color-deep) 0%, #6b2240 100%)",
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>
          Lista para mimarte
        </p>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 4vw, 46px)", color: "#fff", margin: "0 0 16px", lineHeight: 1.15 }}>
          Reserva tu cita hoy
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, marginBottom: 36, maxWidth: 440, margin: "0 auto 36px" }}>
          Elige tu servicio favorito y tu horario ideal. En 2 minutos todo está listo.
        </p>
        <Link href="/reservar" style={{
          padding: "16px 44px", borderRadius: 999,
          background: "#fff", color: "var(--color-deep)",
          fontWeight: 700, fontSize: 16, letterSpacing: "0.02em",
          boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
        }}>
          Reservar ahora →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: "#2c1a1a", color: "rgba(255,255,255,0.5)",
        padding: "36px 24px", textAlign: "center", fontSize: 13,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>🌸</span>
          <span style={{ fontFamily: "var(--font-heading)", color: "rgba(255,255,255,0.8)", fontSize: 15 }}>Rose Nails</span>
        </div>
        <p style={{ margin: "0 0 20px" }}>© {new Date().getFullYear()} Rose Nails · Todos los derechos reservados</p>
        <Link
          href="/login"
          style={{
            fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em",
            textTransform: "uppercase", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: 2, transition: "color 0.2s",
          }}
        >
          Acceso administración
        </Link>
      </footer>

    </div>
  );
}
