'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiClient } from '@/lib/api'

interface Category {
  _id: string
  name: string
}

interface ProductSuggestion {
  _id: string
  name: string
  images?: string[]
  categoryId?: {
    _id: string
    name: string
  }
  brand?: string
  variants?: Array<{
    price: number
  }>
}

export default function SearchBar({ className = '' }: { className?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initial = searchParams?.get('search') || ''
  const initialCategory = searchParams?.get('categoryId') || ''
  const [query, setQuery] = useState(initial)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [categories, setCategories] = useState<Category[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      const result = await apiClient.getCategories()
      if (result.data?.categories) {
        setCategories(result.data.categories)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const trimmed = query.trim()

    if (!trimmed) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsSearching(true)
    const handle = setTimeout(async () => {
      try {
        const result = await apiClient.getProducts({ search: trimmed, limit: 6 })
        if (result.data?.products) {
          setSuggestions(result.data.products)
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      } catch (error) {
        console.error('Search suggestions failed:', error)
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(handle)
  }, [query])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    const params = new URLSearchParams()
    
    if (trimmed) {
      params.append('search', trimmed)
    }
    if (selectedCategory) {
      params.append('categoryId', selectedCategory)
    }
    
    const queryString = params.toString()
    const target = queryString ? `/products?${queryString}` : '/products'
    setShowSuggestions(false)
    router.push(target)
  }

  const selectedCategoryName = categories.find(c => c._id === selectedCategory)?.name || 'All Categories'

  return (
    <form onSubmit={onSubmit} className={`relative w-full max-w-2xl ${className}`}>
      <div className="flex items-center gap-0 w-full">
        {/* Category Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-full px-4 py-2.5 bg-gray-100 border border-gray-300 border-r-0 rounded-l-full text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center gap-2 whitespace-nowrap"
            aria-label="Select category"
          >
            <span className="max-w-[120px] truncate">{selectedCategoryName}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('')
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    !selectedCategory ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category._id)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      selectedCategory === category._id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true)
            }}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            aria-label="Search products"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </span>

          {/* Live search suggestions */}
          {showSuggestions && (isSearching || suggestions.length > 0) && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {isSearching && (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Searching...
                </div>
              )}
              {!isSearching && suggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No products found.
                </div>
              )}
              {!isSearching && suggestions.length > 0 && (
                <ul className="max-h-80 overflow-y-auto">
                  {suggestions.map((product) => {
                    const image =
                      product.images?.[0] || '/images/placeholder.jpg'

                    return (
                      <li key={product._id}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSuggestions(false)
                            router.push(`/products/${product._id}`)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left"
                        >
                          <img
                            src={image}
                            alt={product.name}
                            className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {product.categoryId?.name || product.brand || 'Product'}
                            </p>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                  <li className="border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSuggestions(false)
                        const trimmed = query.trim()
                        const params = new URLSearchParams()
                        if (trimmed) params.append('search', trimmed)
                        if (selectedCategory) params.append('categoryId', selectedCategory)
                        const queryString = params.toString()
                        const target = queryString ? `/products?${queryString}` : '/products'
                        router.push(target)
                      }}
                      className="w-full px-4 py-2.5 text-xs font-medium text-primary hover:bg-primary/5 text-center uppercase tracking-wide"
                    >
                      View all results
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-r-full hover:bg-primary transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </form>
  )
}


