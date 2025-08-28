import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wedge & Wiffle - Lawn Golf Drinking Game',
  description: 'A fun lawn golf drinking game for family camp (21+)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
