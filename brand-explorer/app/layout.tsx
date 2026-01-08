import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Furtherfield Brand Explorer",
  description: "Design tokens and component library explorer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
