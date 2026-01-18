'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import Newsletter from '@/components/Newsletter'
import CategoriesGrid from '@/components/CategoriesGrid'
import Brands from '@/components/Brands'
import { Skeleton } from '@/components/ui'
import { apiClient } from '@/lib/api'

interface Product {
  _id: string
  name: string
  description?: string
  brand?: string
  categoryId?: {
    _id: string
    name: string
  }
  regularPrice?: number
  salePrice?: number
  images?: string[]
  variants?: Array<{
    price: number
    images?: string[]
  }>
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch featured products (page 1)
        const featuredRes = await apiClient.getProducts({ limit: 10, page: 1 })
        if (featuredRes.data?.products) {
          setFeaturedProducts(featuredRes.data.products.slice(0, 10))
        }

        // Fetch trending products (simulated with page 2)
        const trendingRes = await apiClient.getProducts({ limit: 5, page: 2 })
        if (trendingRes.data?.products) {
          setTrendingProducts(trendingRes.data.products.slice(0, 5))
        }
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderProductGrid = (products: Product[]) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5 stagger-children">
        {products.map((product, index) => {
          let displayPrice = 'Price on request'
          if (product.variants?.length) {
            const min = Math.min(...product.variants.map((v) => v.price))
            displayPrice = `From PKR ${min}`
          } else if (product.salePrice) {
            displayPrice = `PKR ${product.salePrice}`
          } else if (product.regularPrice) {
            displayPrice = `PKR ${product.regularPrice}`
          }

          const image = product.images?.[0] || product.variants?.[0]?.images?.[0] || '/images/placeholder.jpg'

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
                price={displayPrice}
                image={image}
                brand={product.brand}
                labels={product.categoryId ? [product.categoryId.name] : []}
              />
            </div>
          )
        })}
      </div>
    )
  }

  const renderSkeletonGrid = (count: number) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm aspect-[9/16]">
            <Skeleton variant="rectangular" className="h-[75%]" />
            <div className="p-2">
              <Skeleton variant="text" width="80%" className="mb-2" />
              <Skeleton variant="text" width="60%" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <main className="min-h-screen page-transition">
      {/* Hero Section */}
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
                style={{ backgroundImage: `url('/images/stationary.jpg')` }}
              ></div>
              <div className="relative h-full flex flex-col justify-end text-white p-8 z-10">
                <div className="text-6xl mb-4">✏️</div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Stationery</h2>
                <p className="text-base md:text-lg mb-6 opacity-90">Premium pens, notebooks & office supplies</p>
                <span className="inline-block px-6 py-3 bg-white text-gray-900 font-bold rounded-full w-fit">Explore Collection</span>
              </div>
            </Link>

            {/* Books Card */}
            <Link
              href="/products?category=books"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 h-[600px] lg:h-[700px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/images/book.jpg')` }}
              ></div>
              <div className="relative h-full flex flex-col justify-end text-white p-8 z-10">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Books</h2>
                <p className="text-base md:text-lg mb-6 opacity-90">Educational books and reading materials</p>
                <span className="inline-block px-6 py-3 bg-white text-gray-900 font-bold rounded-full w-fit">Browse Books</span>
              </div>
            </Link>

            {/* Uniforms Card */}
            <Link
              href="/products?category=uniforms"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 h-[600px] lg:h-[700px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/images/uniform.jpg')` }}
              ></div>
              <div className="relative h-full flex flex-col justify-end text-white p-8 z-10">
                <div className="text-6xl mb-4">👔</div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Uniforms</h2>
                <p className="text-base md:text-lg mb-6 opacity-90">Quality school & work uniforms</p>
                <span className="inline-block px-6 py-3 bg-white text-gray-900 font-bold rounded-full w-fit">View Uniforms</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <CategoriesGrid />
      <Brands />

      {/* Featured Products */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16 animate-fadeInDown">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Featured <span className="text-primary">Products</span>
            </h2>
          </div>

          {loading ? renderSkeletonGrid(10) : featuredProducts.length > 0 ? (
            <>
              {renderProductGrid(featuredProducts)}
              <div className="text-center mt-16">
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-primary transition-all shadow-xl"
                >
                  <span>View All Products</span>
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured products available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 lg:py-32 bg-gray-50 relative overflow-hidden">
        <div className="relative w-full px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              Trending <span className="text-primary">Products</span>
            </h2>
          </div>

          {loading ? renderSkeletonGrid(5) : trendingProducts.length > 0 ? (
            renderProductGrid(trendingProducts)
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No trending products available.</p>
            </div>
          )}
        </div>
      </section>

      <Newsletter />

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 gift-pattern opacity-20"></div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Guaranteed</h3>
              <p className="text-gray-600">Premium products you can trust</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">Quick and secure shipping</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Payment</h3>
              <p className="text-gray-600">Safe and encrypted transactions</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
