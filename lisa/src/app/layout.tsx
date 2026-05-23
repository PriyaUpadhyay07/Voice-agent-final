import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lisa AI — Bulk Calling Dashboard",
  description: "Automate bulk AI voice cold calling with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
