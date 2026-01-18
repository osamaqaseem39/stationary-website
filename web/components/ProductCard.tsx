'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
import QuickViewModal from './QuickViewModal'
import { addToWishlist, removeFromWishlist, isInWishlist, type WishlistItem } from '@/lib/wishlist'

interface ProductCardProps {
  id: string
  name: string
  price: string
  image: string
  brand?: string
  labels?: string[]
  buttonText?: string
  isOutOfStock?: boolean
  href?: string
  productId?: string // For wishlist and quick view
  rating?: number
  reviewCount?: number
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  brand,
  labels = [],
  buttonText = 'Add',
  isOutOfStock = false,
  href,
  productId,
  rating = 4.5, // Default mock rating
  reviewCount = 12 // Default mock count
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)
  const productHref = href || `/products/${id}`
  const displayProductId = productId || id
  const { showToast } = useToast()

  useEffect(() => {
    setInWishlist(isInWishlist(displayProductId))

    const handleWishlistUpdate = () => {
      setInWishlist(isInWishlist(displayProductId))
    }

    window.addEventListener('wishlistUpdated', handleWishlistUpdate)
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate)
  }, [displayProductId])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isOutOfStock) {
      // Add to cart logic
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item: any) => item.id === id)

      if (existingItem) {
        existingItem.quantity += 1
        showToast(`${name} quantity updated`, 'success')
      } else {
        cart.push({ id, name, price, image, quantity: 1 })
        showToast(`${name} added to cart`, 'success')
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'))
    } else {
      showToast('This product is out of stock', 'warning')
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const wishlistItem: WishlistItem = {
      id: displayProductId,
      name,
      price,
      image,
      productId: displayProductId,
    }

    if (inWishlist) {
      removeFromWishlist(displayProductId)
      showToast('Removed from wishlist', 'success')
    } else {
      if (addToWishlist(wishlistItem)) {
        showToast('Added to wishlist', 'success')
      } else {
        showToast('Already in wishlist', 'info')
      }
    }
  }

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-0.5 text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <>
      <Link href={productHref} className="block group h-full">
        <div
          className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 aspect-[9/16] flex flex-col h-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container - Aspect 3:4 */}
          <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden flex-shrink-0 p-2">
            {image ? (
              <>
                <div
                  className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${image})` }}
                />

                {/* Actions - Top Right (Wishlist & Quick View) */}
                <div className={`absolute top-1.5 right-1.5 flex flex-col gap-1.5 z-20 transition-all duration-300 ${!isHovered && !inWishlist ? 'lg:opacity-0 lg:translate-x-2' : 'opacity-100 translate-x-0'}`}>
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-1.5 rounded-full shadow-sm transition-all duration-300 ${inWishlist
                      ? 'bg-red-50 text-red-500 hover:bg-red-100'
                      : 'bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-white hover:text-red-500 hover:shadow-md'
                      }`}
                    title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <svg className={`w-4 h-4 ${inWishlist ? 'fill-current' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleQuickView}
                    className="p-1.5 rounded-full shadow-sm bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-gray-900 hover:text-white transition-all duration-300"
                    title="Quick View"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>

                {/* Badges */}
                {labels.length > 0 && (
                  <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
                    {labels.map((label, index) => {
                      const labelLower = label.toLowerCase()
                      let bgClass = 'bg-gray-900'
                      if (labelLower.includes('sale')) bgClass = 'bg-red-500'
                      else if (labelLower.includes('new')) bgClass = 'bg-blue-600'

                      return (
                        <span key={index} className={`${bgClass} text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider`}>
                          {label}
                        </span>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Product Details - Fills the rest of 9:16 */}
          <div className="p-3 flex-1 flex flex-col justify-between overflow-hidden">
            <div>
              {brand && (
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                  {brand}
                </div>
              )}
              <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 h-10 group-hover:text-primary transition-colors mb-1.5 uppercase">
                {name}
              </h3>

              <div className="flex items-center gap-1.5 mb-1">
                {renderStars(rating)}
                <span className="text-[10px] text-gray-400">({reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="text-base font-bold text-gray-900">{price}</div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`p-2 rounded-full transition-all duration-300 ${isOutOfStock
                  ? 'bg-gray-50 text-gray-200'
                  : 'bg-gray-50 text-gray-900 hover:bg-primary hover:text-white hover:shadow-md'
                  }`}
                title={buttonText}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal
        productId={displayProductId}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  )
}

