import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "Stoqly — Supplier Ordering for Kigali",
  description: "Track suppliers, products and prices for your restaurant or bar in Kigali, Rwanda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          {children}
        </div>
      </body>
    </html>
  );
}