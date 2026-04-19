"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/agenda", label: "Agenda", icon: "📅" },
  { href: "/clientas", label: "Clientas", icon: "👤" },
  { href: "/caja", label: "Caja", icon: "💰" },
  { href: "/gastos", label: "Gastos", icon: "📋" },
  { href: "/balance", label: "Balance", icon: "📊" },
  { href: "/configuracion", label: "Servicios", icon: "⚙️" },
  { href: "/reservar", label: "Reserva online", icon: "🌐" },
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
  const pathname = usePathname();
  const active = activePath || pathname;

  return (
    <div style={{ fontFamily: "var(--font-body)", minHeight: "100vh", background: "var(--color-bg)" }}>

      {/* ── Top bar ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(253,248,245,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-line)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
              display: "grid", placeItems: "center", fontSize: 16,
            }}>🌸</div>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 18, color: "var(--color-deep)", fontWeight: 700, letterSpacing: "-0.3px" }}>
              Rose Nails
            </span>
          </Link>
          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" style={{ fontSize: 13, color: "var(--color-muted)", padding: "7px 14px", borderRadius: 999, border: "1px solid var(--color-line)", background: "white" }}>
              ← Inicio
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              style={{
                fontSize: 13, color: "#fff", padding: "7px 16px", borderRadius: 999,
                border: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600,
                background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 48px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>

        {/* ── Sidebar ── */}
        <aside style={{
          position: "sticky", top: 86, height: "fit-content",
          background: "var(--color-card)", borderRadius: 20,
          border: "1px solid var(--color-line)", padding: "20px 14px",
          boxShadow: "0 2px 12px rgba(139,58,82,0.06)",
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-accent)", margin: "0 6px 14px" }}>
            Panel
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map((link) => {
              const isActive = active === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "10px 12px", borderRadius: 12,
                    border: `1px solid ${isActive ? "rgba(201,133,106,0.3)" : "transparent"}`,
                    background: isActive ? "var(--color-accent-soft)" : "transparent",
                    color: isActive ? "var(--color-deep)" : "var(--color-muted)",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 14, display: "flex", alignItems: "center", gap: 9,
                    textDecoration: "none", transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, color: "var(--color-deep)", margin: "0 0 4px" }}>
              {title}
            </h1>
            <p style={{ color: "var(--color-muted)", fontSize: 14, margin: 0 }}>{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
