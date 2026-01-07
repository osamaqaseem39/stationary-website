'use client'

import Link from 'next/link'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  price: string
  image: string
  labels?: string[]
  buttonText?: string
  isOutOfStock?: boolean
  href?: string
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
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const productHref = href || `/products/${id}`

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isOutOfStock) {
      // Add to cart logic
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item: any) => item.id === id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({ id, name, price, image, quantity: 1 })
      }
      
      localStorage.setItem('cart', JSON.stringify(cart))
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'))
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

          {/* Quick view overlay */}
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <span className="text-white font-medium text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                Quick View
              </span>
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
    </Link>
  )
}

