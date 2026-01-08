'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import Newsletter from '@/components/Newsletter'
import { Loading, Skeleton } from '@/components/ui'
import { apiClient } from '@/lib/api'

interface Product {
  _id: string
  name: string
  description?: string
  categoryId?: {
    _id: string
    name: string
  }
  variants?: Array<{
    price: number
    images?: string[]
  }>
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch featured products
    setLoading(true)
    apiClient.getProducts({ limit: 6 })
      .then((result) => {
        if (result.data?.products) {
          setFeaturedProducts(result.data.products.slice(0, 6))
        }
      })
      .catch((error) => {
        console.error('Failed to load products:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const categories = [
    {
      name: 'Stationery',
      description: 'Premium pens, notebooks & office supplies',
      href: '/products?category=stationery',
      icon: '✏️',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      name: 'Gifts',
      description: 'Unique gifts for every occasion',
      href: '/products?category=gifts',
      icon: '🎁',
      gradient: 'from-pink-400 to-pink-600',
    },
    {
      name: 'Uniforms',
      description: 'Quality school & work uniforms',
      href: '/products?category=uniforms',
      icon: '👔',
      gradient: 'from-purple-400 to-purple-600',
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink via-blue to-purple-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Welcome to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                GBS Store
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Your one-stop shop for premium Stationery, unique Gifts & quality Uniforms
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-transform shadow-xl inline-block"
              >
                Shop Now
              </Link>
              <Link
                href="/products"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 hover:scale-105 transition-transform inline-block"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our curated collections designed to meet all your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={category.href}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`h-48 bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
                  <span className="text-6xl transform group-hover:scale-125 transition-transform duration-300">
                    {category.icon}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-pink transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked favorites from our collection
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <Skeleton variant="rectangular" height={300} />
                  <div className="p-5">
                    <Skeleton variant="text" width="80%" className="mb-2" />
                    <Skeleton variant="text" width="60%" className="mb-4" />
                    <Skeleton variant="rectangular" height={40} />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {featuredProducts.map((product) => {
                  const minPrice = product.variants?.length
                    ? Math.min(...product.variants.map((v) => v.price))
                    : 0
                  const image = product.variants?.[0]?.images?.[0] || ''
                  
                  return (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      productId={product._id}
                      name={product.name}
                      price={minPrice > 0 ? `From PKR ${minPrice}` : 'Price on request'}
                      image={image}
                      labels={product.categoryId ? [product.categoryId.name] : []}
                    />
                  )
                })}
              </div>
              
              <div className="text-center mt-12">
                <Link
                  href="/shop"
                  className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 hover:scale-105 transition-transform"
                >
                  View All Products
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Premium products you can trust</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and secure shipping</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Safe and encrypted transactions</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
