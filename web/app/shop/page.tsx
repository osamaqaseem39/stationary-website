'use client'

import { useState, useEffect, useMemo } from 'react'
import Banner from '@/components/Banner'
import Sidebar from '@/components/Sidebar'
import ProductCard from '@/components/ProductCard'
import Newsletter from '@/components/Newsletter'
import { apiClient } from '@/lib/api'
import { CURRENCY_PREFIX } from '@/lib/currency'

interface Product {
  _id: string
  name: string
  categoryId?: {
    _id: string
    name: string
  }
  brand?: string
  images?: string[]
  variants?: Array<{
    _id: string
    price: number
    quantity?: number
    images?: string[]
  }>
  isActive?: boolean
  status?: string
}

interface Category {
  _id: string
  name: string
  slug?: string
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('default')
  const productsPerPage = 12

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [productsResult, categoriesResult] = await Promise.all([
          apiClient.getProducts(),
          apiClient.getCategories()
        ])

        if (productsResult.data?.products) {
          setProducts(productsResult.data.products.filter((p: Product) => p.isActive !== false))
        }
        if (categoriesResult.data?.categories) {
          setCategories(categoriesResult.data.categories)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) =>
        product.categoryId?._id === selectedCategory
      )
    }

    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => {
        const priceA = a.variants?.length ? Math.min(...a.variants.map(v => v.price)) : Infinity
        const priceB = b.variants?.length ? Math.min(...b.variants.map(v => v.price)) : Infinity
        return priceA - priceB
      })
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => {
        const priceA = a.variants?.length ? Math.max(...a.variants.map(v => v.price)) : 0
        const priceB = b.variants?.length ? Math.max(...b.variants.map(v => v.price)) : 0
        return priceB - priceA
      })
    } else if (sortBy === 'newest') {
      filtered = [...filtered].reverse() // Mock newest
    }

    return filtered
  }, [products, selectedCategory, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  )

  const sidebarCategories = [
    { id: 'all', name: 'All Products' },
    ...categories.map(cat => ({ id: cat._id, name: cat.name }))
  ]

  const filterOptions = categories.map(cat => ({ id: cat._id, name: cat.name }))

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <Banner
            title="Premium Collection"
            description="Explore our curated selection of high-quality products. From exclusive stationery to premium home essentials, find exactly what you need to make a statement."
          />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-24 pt-8">
            {/* Sidebar - Modernized */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="sticky top-24">
                <Sidebar
                  categories={sidebarCategories}
                  filterOptions={filterOptions}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  productCount={filteredProducts.length}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 px-1">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                    {selectedCategory === 'all' ? 'All Products' : categories.find(c => c._id === selectedCategory)?.name}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">Showing {paginatedProducts.length} of {filteredProducts.length} results</p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-100 rounded-full bg-white text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="default">Sort by: Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>

              {/* Product Grid - Optimized for 9:16 Cards */}
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[9/16] bg-gray-50 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : paginatedProducts.length === 0 ? (
                <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="mb-4 text-4xl">🔍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters or category selection.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-16">
                  {paginatedProducts.map((product) => {
                    const minPrice = product.variants && product.variants.length > 0
                      ? Math.min(...product.variants.map(v => v.price))
                      : 0
                    const image = product.images?.[0] || (product.variants && product.variants[0]?.images?.[0]) || ''
                    const isOutOfStock = product.variants && product.variants.length > 0 ? product.variants.every(v => (v.quantity || 0) <= 0) : false

                    return (
                      <ProductCard
                        key={product._id}
                        id={product._id}
                        productId={product._id}
                        name={product.name}
                        price={minPrice > 0 ? `From ${CURRENCY_PREFIX}${minPrice}` : 'Price on request'}
                        image={image}
                        labels={product.categoryId ? [product.categoryId.name] : []}
                        isOutOfStock={isOutOfStock}
                        brand={product.brand}
                      />
                    )
                  })}
                </div>
              )}

              {/* Pagination - Modernized */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all group"
                  >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-12 h-12 rounded-full font-black text-xs transition-all ${currentPage === page
                          ? 'bg-gray-900 text-white shadow-lg scale-110'
                          : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-all group"
                  >
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Newsletter />
    </div>
  )
}

