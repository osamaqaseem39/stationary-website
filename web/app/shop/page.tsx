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
  images?: string[]
  variants?: Array<{
    _id: string
    price: number
    quantity?: number
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
        // Load products
        const productsResult = await apiClient.getProducts()
        if (productsResult.data?.products) {
          setProducts(productsResult.data.products.filter((p: Product) => p.isActive !== false))
        }

        // Load categories
        const categoriesResult = await apiClient.getCategories()
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

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => 
        product.categoryId?._id === selectedCategory
      )
    }

    // Sort products
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
    }

    return filtered
  }, [products, selectedCategory, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  )

  // Prepare categories for sidebar
  const sidebarCategories = [
    { id: 'all', name: 'All Products' },
    ...categories.map(cat => ({ id: cat._id, name: cat.name }))
  ]

  const filterOptions = categories.map(cat => ({ id: cat._id, name: cat.name }))

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Banner
            title="All Products"
            description="WELCOME. Abstract design-essentials that will make a statement in your place. Shop prints, postcards, 3D printed magnets, stationery, stickers and more..."
          />

          <div className="flex flex-col md:flex-row gap-8 pb-16">
            {/* Sidebar */}
            <Sidebar
              categories={sidebarCategories}
              filterOptions={filterOptions}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              productCount={filteredProducts.length}
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort Bar with Product Count */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-gray-700">{filteredProducts.length} products</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue"
                >
                  <option value="default">Sort by</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>

              {/* Product Grid - 3 columns */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="text-xl text-gray-600">Loading products...</div>
                </div>
              ) : paginatedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-xl text-gray-600">No products found</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedProducts.map((product) => {
                    const minPrice = product.variants?.length
                      ? Math.min(...product.variants.map(v => v.price))
                      : 0
                    const image = product.images?.[0] || ''
                    const isOutOfStock = product.variants?.every(v => (v.quantity || 0) <= 0) || false

                    return (
                      <ProductCard
                        key={product._id}
                        id={product._id}
                        name={product.name}
                        price={minPrice > 0 ? `From ${CURRENCY_PREFIX}${minPrice}` : 'Price on request'}
                        image={image}
                        labels={product.categoryId ? [product.categoryId.name] : []}
                        isOutOfStock={isOutOfStock}
                        buttonText={isOutOfStock ? 'Out of stock' : 'add to cart'}
                      />
                    )
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 text-sm ${
                        currentPage === page
                          ? 'text-gray-900 font-semibold'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900"
                  >
                    &gt;
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

