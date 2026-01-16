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
    <Link href={productHref} className="block animate-fadeInUp">
      <div
        className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover-lift cursor-pointer card-hover border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {image ? (
            <>
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
                style={{
                  backgroundImage: `url(${image})`,
                }}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 group-hover:bg-gray-200 transition-all duration-500">
              <svg
                className="w-20 h-20 opacity-50 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
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
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-white/20"></div>

          {/* Overlay on hover */}
          {isHovered && !isOutOfStock && (
            <div className="absolute inset-0 bg-black/5 transition-opacity duration-300"></div>
          )}

          {/* Labels */}
          {labels.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              {labels.map((label, index) => {
                const labelLower = label.toLowerCase()
                let labelClass = 'bg-primary text-white'
                
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
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 flex items-center justify-center gap-3 animate-fadeInUp">
              <button
                onClick={handleQuickView}
                className="bg-white/95 backdrop-blur-sm text-gray-900 p-3.5 rounded-full hover:bg-secondary hover:text-white transition-all duration-300 transform hover:scale-125 hover:rotate-12 shadow-xl hover:shadow-2xl hover:shadow-secondary/50 animate-scaleIn"
                style={{ animationDelay: '0.1s' }}
                title="Quick View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`p-3.5 rounded-full transition-all duration-300 transform hover:scale-125 shadow-xl hover:shadow-2xl animate-scaleIn ${
                  inWishlist
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-primary hover:text-white'
                }`}
                style={{ animationDelay: '0.2s' }}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <svg
                  className={`w-5 h-5 transform transition-transform duration-300 ${inWishlist ? 'animate-pulse-glow' : ''}`}
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
                className="bg-white/95 backdrop-blur-sm text-gray-900 p-3.5 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-125 hover:rotate-12 shadow-xl hover:shadow-2xl hover:shadow-purple/50 animate-scaleIn"
                style={{ animationDelay: '0.3s' }}
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
        <div className="p-6 bg-white group-hover:bg-gray-50 transition-all duration-500">
          <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-300 group-hover:translate-x-1 transform">
            {name}
          </h3>
          <p className="text-xl font-extrabold text-gray-900 mb-5 group-hover:text-primary transition-all duration-300">
            {price}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`relative w-full py-3.5 px-5 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden btn-hover-effect ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-primary hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-primary/50'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isOutOfStock ? 'Out of Stock' : buttonText}
              {!isOutOfStock && (
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </span>
          </button>
        </div>
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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

