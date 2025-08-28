import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wedge & Wiffle - Lawn Golf Drinking Game',
  description: 'A fun lawn golf drinking game for family camp (21+)',
}

// Force cache invalidation - Build timestamp: 2025-08-28T17:35:00Z
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
