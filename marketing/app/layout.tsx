import type { Metadata } from "next";
import { Geist_Mono, Rubik, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SycamoreBorder, LichenBorder, LichenGaps } from "@/components";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "This Coastal Town",
  description: "Reimagine This Coastal Town - A series of events exploring art, culture, and community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${geistMono.variable} ${rubik.variable} antialiased`}
      >
        {/* <SycamoreBorder /> */}
        <LichenBorder />
        {/* <LichenGaps /> - replaced with container-based lichen */}
        {children}
      </body>
    </html>
  );
}
