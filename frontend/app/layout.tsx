import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from "@/contexts/AuthContext"
import Script from 'next/script'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] });

const googleTagId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || "AW-11526372849";

export const metadata: Metadata = {
  title: 'Ultraprint Recargas | Cartuchos, Toners e Suprimentos de Impressão',
  description: 'Especialistas em recarga de cartuchos e toners. Qualidade garantida, economia de até 70% e entrega rápida em toda região em Betim.',
  keywords: [
    'Recarga de Toner',
    'Venda de Toner',
    'Recarga de cartucho de tinta',
    'Venda de cartucho de tinta',
    'Locação de Impressoras',
    'Venda de tinta Epson',
    'Toner compatível',
    'Recargas de cartuchos Betim',
    'Recargas de toner Betim',
    'Suprimentos de impressão'
  ],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        {/* Google Tag Script */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleTagId}');
          `}
        </Script>
      </head>
      <body className={`font-sans antialiased overflow-x-hidden`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

