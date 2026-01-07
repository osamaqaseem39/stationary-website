import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'GBS Store - Modern Stationery, Gifts & Uniforms',
  description: 'Your one-stop shop for premium stationery, unique gifts, and quality uniforms. Discover beautifully designed products for every occasion.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
