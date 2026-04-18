"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/agenda", label: "📅 Agenda" },
  { href: "/clientas", label: "👤 Clientas" },
  { href: "/caja", label: "💰 Caja" },
  { href: "/gastos", label: "📋 Gastos" },
  { href: "/balance", label: "📊 Balance" },
  { href: "/configuracion", label: "⚙️ Servicios" },
  { href: "/reservar", label: "🌐 Reserva online" },
];

export default function DashboardShell({
  title,
  description,
  activePath,
  children,
}: {
  title: string;
  description: string;
  activePath: string;
  children: React.ReactNode;
}) {
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
          <Link href="/">Inicio</Link>
          <Link href="/reservar">Reservar cita</Link>
          <Link className="pill-button primary" href="/agenda">Agenda</Link>
        </nav>
      </header>

      <main className="dashboard-layout">
        <aside className="panel-card sidebar">
          <span className="eyebrow">Panel</span>
          <h2 className="mini-title">{title}</h2>
          <p className="muted">{description}</p>
          <nav className="side-links">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={activePath === link.href ? "active" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="content-stack">{children}</section>
      </main>
    </div>
  );
}
