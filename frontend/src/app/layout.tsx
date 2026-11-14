import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BREATHE | Earth Information Jukebox – NASA Space Apps Challenge 2026",
  description:
    "Hear what the atmosphere is telling us. An interactive Earth science sonification experience transforming NASA Earth observations into sound.",
  keywords: [
    "NASA Space Apps 2026",
    "Earth Information Center",
    "Aerosol Optical Depth",
    "Sonification",
    "Web Audio API",
    "Climate Science",
    "Earth Observations",
  ],
  authors: [{ name: "BREATHE Hackathon Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-space-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-space-950">
        {children}
      </body>
    </html>
  );
}
