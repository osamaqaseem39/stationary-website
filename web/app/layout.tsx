import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GBS E-commerce - Stationery, Gifts & Uniforms',
  description: 'Your one-stop shop for stationery, gifts, and uniforms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
