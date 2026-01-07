'use client'

import { useEffect, useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { apiClient } from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'

interface Product {
  _id: string
  name: string
  description: string
  categoryId: {
    _id: string
    name: string
  }
  brand?: string
  variants?: Array<{
    price: number
    images?: string[]
  }>
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('relevance')
  const searchParams = useSearchParams()
  const search = searchParams?.get('search') || ''

  useEffect(() => {
    setLoading(true)
    apiClient.getProducts(search ? { search } : undefined).then((result) => {
      if (result.data?.products) {
        setProducts(result.data.products)
      }
      setLoading(false)
    })
  }, [search])

  const sortedProducts = useMemo(() => {
    const list = [...products]
    if (sortBy === 'price-low') {
      list.sort((a, b) => {
        const pa = a.variants?.length ? Math.min(...a.variants.map((v) => v.price)) : Number.MAX_SAFE_INTEGER
        const pb = b.variants?.length ? Math.min(...b.variants.map((v) => v.price)) : Number.MAX_SAFE_INTEGER
        return pa - pb
      })
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => {
        const pa = a.variants?.length ? Math.min(...a.variants.map((v) => v.price)) : 0
        const pb = b.variants?.length ? Math.min(...b.variants.map((v) => v.price)) : 0
        return pb - pa
      })
    }
    return list
  }, [products, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-gray-600">
              {search ? (
                <span>
                  Showing results for <span className="font-semibold text-gray-900">“{search}”</span>
                </span>
              ) : (
                'Discover our complete collection of premium products'
              )}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600">Sort:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {sortedProducts.map((product) => {
              const minPrice = product.variants?.length
                ? Math.min(...product.variants.map((v) => v.price))
                : 0
              const image = product.variants?.[0]?.images?.[0] || ''
              
              return (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={minPrice > 0 ? `From ₹${minPrice}` : 'Price on request'}
                  image={image}
                  labels={product.categoryId ? [product.categoryId.name] : []}
                />
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

