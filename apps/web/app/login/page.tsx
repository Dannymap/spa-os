"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/agenda";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))", marginBottom: 16 }}>
            <span style={{ fontSize: 28 }}>🌸</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 32, color: "var(--color-deep)", margin: 0, letterSpacing: "-0.5px" }}>Rose Nails</h1>
          <p style={{ color: "var(--color-muted)", fontSize: 15, marginTop: 6 }}>Panel de administración</p>
        </div>

        {/* Card */}
        <div style={{ background: "var(--color-card)", borderRadius: 24, padding: "36px 32px", boxShadow: "0 8px 40px rgba(139,58,82,0.12)", border: "1px solid var(--color-line)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, margin: "0 0 24px", color: "var(--color-text)" }}>Iniciar sesión</h2>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 13, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rosenails.com"
                style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid var(--color-line)", background: "#fdf8f6", fontSize: 15, color: "var(--color-text)", boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 6, fontSize: 13, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Contraseña</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid var(--color-line)", background: "#fdf8f6", fontSize: 15, color: "var(--color-text)", boxSizing: "border-box", outline: "none" }}
              />
            </div>
            {error && (
              <div style={{ background: "#fff0f0", border: "1px solid #f5c6cb", borderRadius: 10, padding: "10px 14px", color: "#c0392b", fontSize: 14 }}>
                {error}
              </div>
            )}
            <button
              type="submit" disabled={loading}
              style={{ background: "linear-gradient(135deg, var(--color-accent), var(--color-deep))", color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontWeight: 700, fontSize: 16, cursor: "pointer", opacity: loading ? 0.7 : 1, marginTop: 8, fontFamily: "var(--font-body)", letterSpacing: "0.02em" }}
            >
              {loading ? "Entrando..." : "Entrar al panel"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--color-muted)" }}>
          <a href="/" style={{ color: "var(--color-accent)" }}>← Volver al inicio</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
