'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
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
  productId?: string
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
  buttonText = 'Add to cart',
  isOutOfStock = false,
  href,
  productId,
}: ProductCardProps) {
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

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      {/* Image Container */}
      <Link href={productHref} className="relative bg-gray-50/50 overflow-hidden flex-shrink-0">
        {image ? (
          <>
            <div
              className="w-full aspect-square bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105 p-6"
              style={{ backgroundImage: `url(${image})` }}
            />

            {/* Wishlist Icon - Top Right */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all hover:scale-110 z-10 ${inWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:text-red-500'
                }`}
            >
              <svg
                className={`w-4 h-4 ${inWishlist ? 'fill-current' : 'fill-none stroke-current stroke-2'}`}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Badges - Top Left */}
            {labels.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {labels.map((label, index) => {
                  const labelLower = label.toLowerCase()
                  let bgClass = 'bg-gray-900/80'
                  if (labelLower.includes('sale')) bgClass = 'bg-red-500/90'
                  else if (labelLower.includes('new')) bgClass = 'bg-primary/90'

                  return (
                    <span
                      key={index}
                      className={`${bgClass} backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm`}
                    >
                      {label}
                    </span>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <div className="w-full aspect-square flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={productHref} className="flex-1">
          {/* Price - Prominent */}
          <div className="text-2xl font-bold text-gray-900 mb-2">{price}</div>

          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-2">
            {name}
          </h3>

          {/* Brand */}
          {brand && (
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
              {brand}
            </div>
          )}
        </Link>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2.5 rounded-md font-semibold text-sm transition-all ${isOutOfStock
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
            }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}

