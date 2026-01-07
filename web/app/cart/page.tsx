'use client'

import Link from 'next/link'

export default function CartPage() {
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
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Link
            href="/products"
            className="bg-pink text-white px-6 py-3 rounded-lg hover:bg-pink-dark transition inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}

