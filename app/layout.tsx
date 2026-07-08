import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Confirma Presenca",
  description: "Validador de presença digital para eventos"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
