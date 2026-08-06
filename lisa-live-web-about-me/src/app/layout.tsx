import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Lisa AI - Autonomous Outbound AI Voice Agent | Official Demo & About Web",
  description: "Experience Lisa AI: Next-generation voice AI agent for automated cold calling, lead qualification, and 24/7 calendar appointment booking.",
  keywords: ["AI cold calling", "Voice AI agent", "Outbound automation", "Lisa AI", "Lead qualification", "SignalWire Vapi voice"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
