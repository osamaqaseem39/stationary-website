'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { adminApiClient } from '@/lib/api'
import Button from '@/components/ui/Button'

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/products', label: 'Products', icon: '📦' },
  { href: '/dashboard/orders', label: 'Orders', icon: '🛒' },
  { href: '/dashboard/inventory', label: 'Inventory', icon: '📋' },
  { href: '/dashboard/users', label: 'Users', icon: '👥' },
  { href: '/dashboard/categories', label: 'Categories', icon: '📁' },
  { href: '/dashboard/brands', label: 'Brands', icon: '🏷️' },
  { href: '/dashboard/variants', label: 'Variants', icon: '🎨' },
]

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl z-10">
        <div className="p-6 border-b border-gray-700/50">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            GBS Admin
          </h1>
          <p className="text-xs text-gray-400 mt-1">Management Portal</p>
        </div>
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
          <Button
            variant="outline"
            fullWidth
            onClick={handleLogout}
            className="text-white border-gray-600 hover:bg-red-600/20 hover:border-red-500 transition-all"
          >
            <span className="mr-2">🚪</span>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </div>
    </main>
  )
}

