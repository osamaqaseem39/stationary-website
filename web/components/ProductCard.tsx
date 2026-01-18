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
  rating = 4.8, // Slightly higher default for "premium" feel
  reviewCount = 24
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-0.5 text-secondary">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
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
          className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 aspect-[9/16] flex flex-col h-full group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container - Aspect 3:4 */}
          <div className="relative aspect-[3/4] bg-gray-50/50 overflow-hidden flex-shrink-0">
            {image ? (
              <>
                <div
                  className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-110 p-6"
                  style={{ backgroundImage: `url(${image})` }}
                />

                {/* Gradient Overlay for Actions */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                {/* Actions - Animated on Hover */}
                <div className={`absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-20 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <button
                    onClick={handleQuickView}
                    className="p-3 rounded-full bg-white text-gray-900 hover:bg-primary hover:text-white transition-all shadow-xl hover:scale-110"
                    title="Quick View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`p-3 rounded-full transition-all shadow-xl hover:scale-110 ${isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-900 hover:bg-primary hover:text-white'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-full shadow-xl transition-all hover:scale-110 ${inWishlist
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-900 hover:text-red-500'
                      }`}
                  >
                    <svg className={`w-5 h-5 ${inWishlist ? 'fill-current' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Badges - Premium Look */}
                {labels.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {labels.map((label, index) => {
                      const labelLower = label.toLowerCase()
                      let bgClass = 'bg-gray-900/80'
                      if (labelLower.includes('sale')) bgClass = 'bg-red-500/90'
                      else if (labelLower.includes('new')) bgClass = 'bg-primary/90'

                      return (
                        <span key={index} className={`${bgClass} backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm uppercase tracking-[0.1em]`}>
                          {label}
                        </span>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
                <span className="bg-gray-900 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Product Details - Premium Typography */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                {brand && (
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                    {brand}
                  </div>
                )}
                {renderStars(rating)}
              </div>

              <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 h-10 group-hover:text-primary transition-colors uppercase tracking-tight">
                {name}
              </h3>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting From</span>
                <div className="text-lg font-black text-gray-900 tracking-tight">{price}</div>
              </div>

              <div className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-primary transition-colors">
                View Details →
              </div>
            </div>
          </div>
        </div>
      </Link>

      <QuickViewModal
        productId={displayProductId}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  )
}

