'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { adminApiClient } from '@/lib/api'
import Button from '@/components/ui/Button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      if (adminApiClient.isAuthenticated()) {
        setIsAuthenticated(true)
      } else {
        router.push('/login')
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    adminApiClient.logout()
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">GBS Admin</h1>
        </div>
        <nav className="mt-8">
          <Link
            href="/dashboard"
            className={`block px-6 py-3 transition ${
              pathname === '/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/products"
            className={`block px-6 py-3 transition ${
              pathname?.startsWith('/dashboard/products') ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Products
          </Link>
          <Link
            href="/dashboard/orders"
            className={`block px-6 py-3 transition ${
              pathname?.startsWith('/dashboard/orders') ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Orders
          </Link>
          <Link
            href="/dashboard/inventory"
            className={`block px-6 py-3 transition ${
              pathname?.startsWith('/dashboard/inventory') ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Inventory
          </Link>
          <Link
            href="/dashboard/users"
            className={`block px-6 py-3 transition ${
              pathname?.startsWith('/dashboard/users') ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Users
          </Link>
          <Link
            href="/dashboard/categories"
            className={`block px-6 py-3 transition ${
              pathname?.startsWith('/dashboard/categories') ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Categories
          </Link>
          <Link
            href="/dashboard/variants"
            className={`block px-6 py-3 transition ${
              pathname?.startsWith('/dashboard/variants') ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Variants
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <Button
            variant="outline"
            fullWidth
            onClick={handleLogout}
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </main>
  )
}

