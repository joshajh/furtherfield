import './globals.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Geist_Mono, Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | This Coastal Town Playbook',
    default: 'This Coastal Town Playbook',
  },
  description: 'A time-travel playbook for inspiring coastal communities',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${geistMono.variable} ${playfairDisplay.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          theme={{
            enabled: true,
            defaultTheme: 'dark',
            enableSystem: false,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
