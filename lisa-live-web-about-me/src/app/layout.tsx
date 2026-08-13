import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Lisa AI - You bring the leads & script, AI handles everything else",
  description: "Autonomous outbound AI calling agent. Setup in 24 hrs, 24/7 calls, TCPA guidance, full transcript visibility.",
  keywords: ["AI cold calling", "Voice AI agent", "Outbound automation", "Lisa AI", "Lead qualification", "Business loans AI caller"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}


