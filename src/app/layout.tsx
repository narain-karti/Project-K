import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import { DetectionProvider } from "@/context/DetectionContext";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

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
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <DetectionProvider>
          <CustomCursor />
          <Navigation />
          {children}
        </DetectionProvider>
      </body>
    </html>
  );
}
