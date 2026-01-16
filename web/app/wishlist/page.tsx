'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getWishlist, removeFromWishlist, type WishlistItem } from '@/lib/wishlist'
import { useToast } from '@/components/ui/ToastProvider'
import Breadcrumbs from '@/components/Breadcrumbs'
import ProductCard from '@/components/ProductCard'

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    loadWishlist()
    
    const handleWishlistUpdate = () => {
      loadWishlist()
    }
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate)
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate)
  }, [])

  const loadWishlist = () => {
    const items = getWishlist()
    setWishlistItems(items)
    setLoading(false)
  }

  const handleRemove = (id: string) => {
    removeFromWishlist(id)
    showToast('Removed from wishlist', 'success')
    loadWishlist()
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wishlist...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Wishlist', href: '/wishlist' },
          ]}
        />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            {wishlistItems.length > 0 && (
              <span className="text-gray-600">{wishlistItems.length} items</span>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <svg
                className="w-24 h-24 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">
                Start adding products you love to your wishlist!
              </p>
              <Link
                href="/shop"
                className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {wishlistItems.map((item) => (
                <div key={item.id} className="relative">
                  <ProductCard
                    id={item.id}
                    productId={item.productId}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 z-30 bg-white p-2 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all"
                    title="Remove from wishlist"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

