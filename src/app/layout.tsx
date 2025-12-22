import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import InteractiveBackground from "@/components/InteractiveBackground";
import { DetectionProvider } from "@/context/DetectionContext";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

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
      <body className={`${jakarta.variable} antialiased font-sans`}>
        <DetectionProvider>
          <InteractiveBackground />
          <CustomCursor />
          <Navigation />
          {children}
        </DetectionProvider>
      </body>
    </html>
  );
}
