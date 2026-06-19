import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Kanit } from 'next/font/google'
import './globals.css'

const kanit = Kanit({
  variable: '--font-kanit',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Fleet — Bus Revenue & Operations',
  description: 'A premium, dark dashboard for bus earnings, live fleet tracking and management',
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

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0C0C0C',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${kanit.variable} dark`}>
      <body className="font-sans antialiased" style={{ background: '#0C0C0C' }}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
