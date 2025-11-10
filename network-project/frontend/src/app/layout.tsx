// Core
import type { Metadata } from "next";

// Libraries
import { Geist, Geist_Mono } from "next/font/google";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import "./globals.css";

const geistSans: NextFontWithVariable = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono: NextFontWithVariable = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Painel principal do sistema",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
