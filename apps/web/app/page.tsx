import Link from "next/link";
import { bookingSuggestions, services, technicians } from "@nails/core";

export default function HomePage() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div className="brand-copy">
            <strong>NailsOS</strong>
            <span>Agenda visual, reservas y fidelizacion para salones de unas</span>
          </div>
        </div>
        <nav className="nav-links">
          <Link href="/agenda">Dashboard</Link>
          <Link href="/reservar">Reserva online</Link>
        </nav>
      </header>

      <main className="landing-grid">
        <section className="hero-card">
          <span className="eyebrow">MVP listo para SaaS</span>
          <h1 className="hero-title">Menos mensajes. Mas huecos llenos. Mejor salon.</h1>
          <p className="hero-copy">
            Esta base ya separa frontend, backend y app movil para que puedas desplegar web y API como
            proyectos distintos en Vercel y mantener React Native para la experiencia movil.
          </p>
          <div className="hero-actions">
            <Link className="pill-button primary" href="/agenda">
              Entrar al panel
            </Link>
            <Link className="pill-button" href="/reservar">
              Ver reserva publica
            </Link>
          </div>
        </section>

        <section className="feature-stack">
          <article className="panel-card">
            <span className="eyebrow">Tecnicas activas</span>
            <h2 className="mini-title">{technicians.length} cabinas coordinadas</h2>
            <p className="muted">
              Turnos por profesional, estados de cita y huecos sugeridos para rellenar el dia.
            </p>
          </article>
          <article className="panel-card">
            <span className="eyebrow">Servicios</span>
            <h2 className="mini-title">{services.length} servicios y packs</h2>
            <p className="muted">
              Manicura, rellenos, pedicura y extras de diseno preparados para ampliar a precios reales.
            </p>
          </article>
          <article className="panel-card">
            <span className="eyebrow">Rellenar huecos</span>
            <h2 className="mini-title">{bookingSuggestions.flatMap((item) => item.slots).length} sugerencias listas</h2>
            <p className="muted">Perfecto para bajar tiempos muertos sin llamar ni revisar chats manualmente.</p>
          </article>
        </section>
      </main>
    </div>
  );
}

