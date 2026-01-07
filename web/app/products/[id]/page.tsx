'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Variant {
  _id: string
  sku: string
  price: number
  attributes: Record<string, any>
  inventory?: number
  available?: number
}

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

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productId) {
      fetch(`http://localhost:5000/api/products/${productId}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data.product)
          setVariants(data.variants || [])
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching product:', err)
          setLoading(false)
        })
    }
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Product not found</div>
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
        <Link href="/products" className="text-blue mb-4 inline-block hover:underline">
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="h-96 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-8xl">📦</span>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.categoryId?.name}</p>
            {product.brand && (
              <p className="text-gray-500 mb-6">Brand: {product.brand}</p>
            )}
            <p className="text-lg mb-8">{product.description || 'No description available'}</p>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Available Options</h2>
                <div className="space-y-4">
                  {variants.map((variant) => (
                    <div
                      key={variant._id}
                      className="border rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">SKU: {variant.sku}</p>
                        {Object.keys(variant.attributes || {}).length > 0 && (
                          <p className="text-sm text-gray-600">
                            {Object.entries(variant.attributes).map(([key, value]) => (
                              <span key={key} className="mr-4">
                                {key}: {String(value)}
                              </span>
                            ))}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Stock: {variant.available || 0} available
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">₹{variant.price}</p>
                        <button
                          className="mt-2 bg-pink text-white px-6 py-2 rounded hover:bg-pink-dark transition"
                          disabled={(variant.available || 0) === 0}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

