import Link from "next/link";

const links = [
  { href: "/agenda", label: "Agenda" },
  { href: "/clientas", label: "Clientas" },
  { href: "/caja", label: "Caja" },
  { href: "/configuracion", label: "Servicios" },
  { href: "/reservar", label: "Reservas online" }
];

export function DashboardShell({
  title,
  description,
  activePath,
  children
}: Readonly<{
  title: string;
  description: string;
  activePath: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">N</div>
          <div className="brand-copy">
            <strong>NailsOS</strong>
            <span>Salon manager para manos y pies</span>
          </div>
        </div>
        <nav className="nav-links">
          <Link href="/">Inicio</Link>
          <Link href="/reservar">Reserva online</Link>
          <Link className="pill-button primary" href="/agenda">
            Abrir agenda
          </Link>
        </nav>
      </header>

      <main className="dashboard-layout">
        <aside className="panel-card sidebar">
          <span className="eyebrow">Operacion diaria</span>
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

