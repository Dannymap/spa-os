import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NailsOS",
  description: "Agenda, reservas y gestion de clientas para salones de unas."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
