import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpaOS — Tu spa de manos, pies y más",
  description: "Reserva citas online, gestiona fichas de clientas y controla tus finanzas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
