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
    <main className="min-h-screen page-transition">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink via-blue to-purple-500 overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated background blobs */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Decorative elements for niche */}
        <div className="absolute inset-0 stationery-pattern opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight animate-fadeInDown">
              Welcome to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-pink-200 animate-pulse-glow inline-block">
                GBS Store
              </span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-white/95 mb-12 max-w-3xl mx-auto font-light animate-fadeInUp animation-delay-200">
              Your one-stop shop for premium <span className="font-semibold">Stationery</span>, unique <span className="font-semibold">Gifts</span> & quality <span className="font-semibold">Uniforms</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeInUp animation-delay-400">
              <Link
                href="/shop"
                className="group relative bg-white text-gray-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-pink/50 btn-hover-effect overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Shop Now
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/products"
                className="group relative bg-white/15 backdrop-blur-md text-white border-2 border-white/50 px-10 py-5 rounded-full font-bold text-lg hover:bg-white/25 hover:border-white hover:scale-110 transition-all duration-300 shadow-xl glass overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Browse Products
                  <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </span>
              </Link>
            </div>
            
            {/* Floating decorative icons */}
            <div className="mt-16 flex justify-center gap-8 animate-float">
              <div className="text-4xl opacity-80">✏️</div>
              <div className="text-4xl opacity-80 animation-delay-200">🎁</div>
              <div className="text-4xl opacity-80 animation-delay-400">👔</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 uniform-pattern opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16 animate-fadeInDown">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Shop by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover our curated collections designed to meet all your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 stagger-children">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover-lift card-hover animate-fadeInUp"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Category icon container with animated gradient */}
                <div className={`relative h-56 bg-gradient-to-br ${category.gradient} flex items-center justify-center overflow-hidden`}>
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.3)_1px,_transparent_1px)] bg-[length:30px_30px]"></div>
                  </div>
                  
                  {/* Icon with float animation */}
                  <span className="relative text-7xl transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 animate-float">
                    {category.icon}
                  </span>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500"></div>
                </div>
                
                <div className="p-8 relative z-10">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-pink transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{category.description}</p>
                  
                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center text-pink opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                    <span className="text-sm font-semibold">Explore Collection</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16 animate-fadeInDown">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Featured <span className="gradient-text">Products</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 stagger-children">
                {featuredProducts.map((product, index) => {
                  const minPrice = product.variants?.length
                    ? Math.min(...product.variants.map((v) => v.price))
                    : 0
                  const image = product.variants?.[0]?.images?.[0] || ''
                  
                  return (
                    <div
                      key={product._id}
                      className="animate-fadeInUp"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ProductCard
                        id={product._id}
                        productId={product._id}
                        name={product.name}
                        price={minPrice > 0 ? `From PKR ${minPrice}` : 'Price on request'}
                        image={image}
                        labels={product.categoryId ? [product.categoryId.name] : []}
                      />
                    </div>
                  )
                })}
              </div>
              
              <div className="text-center mt-16 animate-fadeInUp animation-delay-600">
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-10 py-5 rounded-full font-bold text-lg hover:from-pink hover:to-blue hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-pink/50 btn-hover-effect overflow-hidden"
                >
                  <span className="relative z-10">View All Products</span>
                  <svg className="w-5 h-5 relative z-10 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
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
      <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 gift-pattern opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 stagger-children">
            <div className="group text-center animate-fadeInUp">
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-blue/50">
                <svg className="w-10 h-10 text-blue transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute inset-0 rounded-2xl bg-blue-200 opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse-glow"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue transition-colors">Quality Guaranteed</h3>
              <p className="text-gray-600 leading-relaxed">Premium products you can trust</p>
            </div>
            
            <div className="group text-center animate-fadeInUp animation-delay-200">
              <div className="relative w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-pink/50">
                <svg className="w-10 h-10 text-pink transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="absolute inset-0 rounded-2xl bg-pink-200 opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse-glow"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-pink transition-colors">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Quick and secure shipping</p>
            </div>
            
            <div className="group text-center animate-fadeInUp animation-delay-400">
              <div className="relative w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-purple/50">
                <svg className="w-10 h-10 text-purple-600 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="absolute inset-0 rounded-2xl bg-purple-200 opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-pulse-glow"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">Secure Payment</h3>
              <p className="text-gray-600 leading-relaxed">Safe and encrypted transactions</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
