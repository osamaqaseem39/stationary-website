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


  return (
    <main className="min-h-screen page-transition">
      {/* Hero Section - 3 Cards */}
      <section className="relative overflow-hidden py-8 lg:py-12 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
            {/* Stationery Card */}
            <Link
              href="/products?category=stationery"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 h-[600px] lg:h-[700px]"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('/images/stationary.jpg')`,
                }}
              ></div>
              <div className="relative h-full flex flex-col justify-end text-white p-8 z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-500">✏️</div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3 transform group-hover:translate-y-[-5px] transition-transform duration-500">
                  Stationery
                </h2>
                <p className="text-base md:text-lg mb-6 opacity-90">
                  Premium pens, notebooks & office supplies
                </p>
                <span className="inline-block px-6 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform group-hover:scale-110 w-fit">
                  Explore Collection
                </span>
              </div>
            </Link>

            {/* Books Card */}
            <Link
              href="/products?category=books"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 h-[600px] lg:h-[700px]"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('/images/book.jpg')`,
                }}
              ></div>
              <div className="relative h-full flex flex-col justify-end text-white p-8 z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-500">📚</div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3 transform group-hover:translate-y-[-5px] transition-transform duration-500">
                  Books
                </h2>
                <p className="text-base md:text-lg mb-6 opacity-90">
                  Educational books and reading materials
                </p>
                <span className="inline-block px-6 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform group-hover:scale-110 w-fit">
                  Browse Books
                </span>
              </div>
            </Link>

            {/* Uniforms Card */}
            <Link
              href="/products?category=uniforms"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 h-[600px] lg:h-[700px]"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('/images/uniform.jpg')`,
                }}
              ></div>
              <div className="relative h-full flex flex-col justify-end text-white p-8 z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-500">👔</div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3 transform group-hover:translate-y-[-5px] transition-transform duration-500">
                  Uniforms
                </h2>
                <p className="text-base md:text-lg mb-6 opacity-90">
                  Quality school & work uniforms
                </p>
                <span className="inline-block px-6 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform group-hover:scale-110 w-fit">
                  View Uniforms
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16 animate-fadeInDown">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Featured <span className="text-primary">Products</span>
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
                  className="group inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-primary hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/50 btn-hover-effect overflow-hidden"
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
      <section className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 gift-pattern opacity-20"></div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 stagger-children">
            <div className="group text-center animate-fadeInUp">
              <div className="relative w-20 h-20 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-secondary/50">
                <svg className="w-10 h-10 text-secondary transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute inset-0 rounded-2xl bg-secondary/30 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-secondary transition-colors">Quality Guaranteed</h3>
              <p className="text-gray-600 leading-relaxed">Premium products you can trust</p>
            </div>
            
            <div className="group text-center animate-fadeInUp animation-delay-200">
              <div className="relative w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/50">
                <svg className="w-10 h-10 text-primary transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="absolute inset-0 rounded-2xl bg-primary/30 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Quick and secure shipping</p>
            </div>
            
            <div className="group text-center animate-fadeInUp animation-delay-400">
              <div className="relative w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-purple/50">
                <svg className="w-10 h-10 text-purple-600 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="absolute inset-0 rounded-2xl bg-purple-200 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
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
