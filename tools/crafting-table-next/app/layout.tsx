import type { Metadata } from 'next'
import { Inter, Instrument_Serif, Instrument_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
})

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Crafting Table - Furtherfield',
  description: 'Modular micro-apps for generative visual identity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${instrumentSerif.variable} ${instrumentSans.variable}`}>{children}</body>
    </html>
  )
}
