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
  labels?: string[]
  buttonText?: string
  isOutOfStock?: boolean
  href?: string
  productId?: string // For wishlist and quick view
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  labels = [],
  buttonText = 'add to cart',
  isOutOfStock = false,
  href,
  productId,
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
        showToast(`${name} quantity updated in cart`, 'success')
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

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const url = `${window.location.origin}${productHref}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name} - ${price}`,
          url: url,
        })
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled', err)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        showToast('Link copied to clipboard!', 'success')
      } catch (err) {
        showToast('Failed to copy link', 'error')
      }
    }
  }

  return (
    <Link href={productHref}>
      <div
        className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover-lift cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {image ? (
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
              <svg
                className="w-20 h-20 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Overlay on hover */}
          {isHovered && !isOutOfStock && (
            <div className="absolute inset-0 bg-black/5 transition-opacity duration-300"></div>
          )}

          {/* Labels */}
          {labels.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              {labels.map((label, index) => {
                const labelLower = label.toLowerCase()
                let labelClass = 'bg-blue-500 text-white'
                
                if (labelLower.includes('limited') || labelLower.includes('edition')) {
                  labelClass = 'bg-purple-600 text-white'
                } else if (labelLower.includes('new')) {
                  labelClass = 'bg-green-500 text-white'
                } else if (labelLower.includes('sale')) {
                  labelClass = 'bg-red-500 text-white'
                } else if (labelLower.includes('stock') || labelLower.includes('out')) {
                  labelClass = 'bg-gray-600 text-white'
                }
                
                return (
                  <span
                    key={index}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-lg ${labelClass} animate-fadeIn`}
                  >
                    {label}
                  </span>
                )
              })}
            </div>
          )}

          {/* Action buttons on hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center gap-2">
              <button
                onClick={handleQuickView}
                className="bg-white text-gray-900 p-3 rounded-full hover:bg-pink hover:text-white transition-all transform hover:scale-110 shadow-lg"
                title="Quick View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-full transition-all transform hover:scale-110 shadow-lg ${
                  inWishlist
                    ? 'bg-pink text-white'
                    : 'bg-white text-gray-900 hover:bg-pink hover:text-white'
                }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <svg
                  className="w-5 h-5"
                  fill={inWishlist ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              <button
                onClick={handleShare}
                className="bg-white text-gray-900 p-3 rounded-full hover:bg-pink hover:text-white transition-all transform hover:scale-110 shadow-lg"
                title="Share"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-pink transition-colors">
            {name}
          </h3>
          <p className="text-lg font-bold text-gray-900 mb-4">{price}</p>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-pink hover:scale-105 shadow-md hover:shadow-lg'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : buttonText}
          </button>
        </div>
      </div>
      
      {/* Quick View Modal */}
      <QuickViewModal
        productId={displayProductId}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </Link>
  )
}

