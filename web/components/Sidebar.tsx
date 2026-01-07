'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  count?: number
}

interface FilterOption {
  id: string
  name: string
}

interface SidebarProps {
  categories: Category[]
  filterOptions: FilterOption[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  productCount: number
}

export default function Sidebar({
  categories,
  filterOptions,
  selectedCategory,
  onCategoryChange,
  productCount,
}: SidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isProductTypeOpen, setIsProductTypeOpen] = useState(false)

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    )
  }

  return (
    <aside className="w-full md:w-64 lg:w-72 pr-0 md:pr-8 mb-8 md:mb-0">
      {/* Category Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Category</h2>
          <span className="text-sm text-gray-600">{productCount} products</span>
        </div>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onCategoryChange(category.id)}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Filter Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by</h2>
        
        {/* Product Type Dropdown */}
        <div className="mb-4">
          <button
            onClick={() => setIsProductTypeOpen(!isProductTypeOpen)}
            className="w-full text-left px-3 py-2 border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center justify-between"
          >
            <span className="text-sm text-gray-700">Product type</span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isProductTypeOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Filter Options */}
        <div className="space-y-2">
          {filterOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={selectedFilters.includes(option.id)}
                onChange={() => toggleFilter(option.id)}
                className="w-4 h-4 text-pink border-gray-300 rounded focus:ring-pink focus:ring-2"
              />
              <span className="text-sm text-gray-700">{option.name}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}

