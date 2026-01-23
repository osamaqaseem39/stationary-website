'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiClient } from '@/lib/api'

interface Category {
  _id: string
  name: string
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

  useEffect(() => {
    const loadCategories = async () => {
      const result = await apiClient.getCategories()
      if (result.data?.categories) {
        setCategories(result.data.categories)
      }
    }
    loadCategories()
  }, [])

  const onSubmit = (e: React.FormEvent) => {
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
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            aria-label="Search products"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </span>
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


