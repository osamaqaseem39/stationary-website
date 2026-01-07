'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar({ className = '' }: { className?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initial = searchParams?.get('search') || ''
  const [query, setQuery] = useState(initial)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    const target = trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : '/products'
    router.push(target)
  }

  return (
    <form onSubmit={onSubmit} className={`relative w-full max-w-md ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-10 pr-12 py-2.5 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink focus:border-transparent text-sm"
        aria-label="Search products"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </span>
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-4 py-1.5 rounded-full hover:bg-pink transition-colors"
      >
        Search
      </button>
    </form>
  )
}


