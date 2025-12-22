import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import InteractiveBackground from "@/components/InteractiveBackground";
import FluidBackground from "@/components/FluidBackground";
import { DetectionProvider } from "@/context/DetectionContext";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Project K | Hybrid Traffic Intelligence",
  description: "India's most advanced hybrid edge-cloud traffic intelligence system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${space.variable} antialiased font-sans`}>
        <DetectionProvider>
          <InteractiveBackground />
          <FluidBackground />
          <CustomCursor />
          <Navigation />
          {children}
        </DetectionProvider>
      </body>
    </html>
  );
}
