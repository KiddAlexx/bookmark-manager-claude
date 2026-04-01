import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppInit } from "@/components/AppInit";
import "./globals.css";

const manrope = localFont({
  src: "../../assets/fonts/Manrope/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});

export const metadata: Metadata = {
  title: "Bookmark Manager",
  description: "Save, organise, and revisit your favourite links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
          <AppInit />
          {children}
        </body>
    </html>
  );
}
