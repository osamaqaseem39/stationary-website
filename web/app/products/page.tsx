'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  description: string
  categoryId: {
    _id: string
    name: string
  }
  brand?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching products:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    )
  }

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
        <h1 className="text-4xl font-bold mb-8">All Products</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
              >
                <div className="h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {product.categoryId?.name || 'Uncategorized'}
                </p>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {product.description || 'No description available'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

