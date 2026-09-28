import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "Impulso | Financiación para tu negocio",
  description: "Prototipo: encuentra una opción de crédito formal para tu negocio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${jakarta.variable} bg-slate-50 font-sans text-slate-900 antialiased`}>
        <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-white shadow-sm">{children}</div>
      </body>
    </html>
  );
}
