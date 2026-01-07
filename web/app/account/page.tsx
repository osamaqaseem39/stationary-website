'use client'

import Link from 'next/link'

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-pink">
              GBS Store
            </Link>
            <nav className="flex gap-6">
              <Link href="/products" className="text-gray-700 hover:text-pink">
                Products
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-pink">
                Cart
              </Link>
              <Link href="/account" className="text-gray-700 hover:text-pink">
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            <p className="text-gray-600">View your order history</p>
            <Link
              href="/account/orders"
              className="text-blue hover:underline mt-4 inline-block"
            >
              View Orders →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Addresses</h2>
            <p className="text-gray-600">Manage your shipping addresses</p>
            <Link
              href="/account/addresses"
              className="text-blue hover:underline mt-4 inline-block"
            >
              Manage Addresses →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

