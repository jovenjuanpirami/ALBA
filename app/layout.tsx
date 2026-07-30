import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono, Jost } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Alba · Tu primera decisión del día",
  description:
    "Suplemento alimenticio. 450 kcal, 35 g de proteína y 26 nutrientes al 30% de tu día. Sesenta segundos con agua fría.",
  openGraph: {
    title: "Alba · Tu primera decisión del día",
    description:
      "450 kcal, 35 g de proteína y 26 nutrientes al 30% de tu día. Sesenta segundos con agua fría.",
    locale: "es_MX",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f5f2ed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-MX"
      className={`${jost.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-dvh antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
