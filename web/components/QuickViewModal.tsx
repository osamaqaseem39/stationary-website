'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Modal from './ui/Modal'
import { apiClient } from '@/lib/api'
import { useToast } from './ui/ToastProvider'
import { formatCurrency } from '@/lib/currency'

interface QuickViewModalProps {
  productId: string
  isOpen: boolean
  onClose: () => void
}

interface Variant {
  _id: string
  sku: string
  price: number
  attributes: Record<string, any>
  inventory?: number
  images?: string[]
}

interface Product {
  _id: string
  name: string
  description?: string
  shortDescription?: string
  categoryId?: {
    _id: string
    name: string
  }
  brand?: string
  isBundle?: boolean
  bundleItems?: Array<{
    productId: string
    quantity: number
    name: string
  }>
}

export default function QuickViewModal({
  productId,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const { showToast } = useToast()

  useEffect(() => {
    if (isOpen && productId) {
      loadProduct()
    }
  }, [isOpen, productId])

  const loadProduct = async () => {
    setLoading(true)
    try {
      const result = await apiClient.getProduct(productId)
      if (result.data) {
        setProduct(result.data.product)
        const variantList = result.data.variants || []
        setVariants(variantList)
        if (variantList.length > 0) {
          setSelectedVariant(variantList[0])
          setSelectedImage(variantList[0]?.images?.[0] || '')
        }
      }
    } catch (error) {
      console.error('Failed to load product:', error)
      showToast('Failed to load product', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const cartItem = {
      id: `${product._id}-${selectedVariant._id}`,
      productId: product._id,
      variantId: selectedVariant._id,
      name: product.name,
      price: formatCurrency(selectedVariant.price),
      image: selectedImage,
      quantity,
      variant: selectedVariant,
    }

    const existingIndex = cart.findIndex((item: any) => item.id === cartItem.id)
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push(cartItem)
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    showToast('Added to cart!', 'success')
  }

  if (!product) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="flex items-center justify-center py-12">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product...</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">Product not found</p>
            </div>
          )}
        </div>
      </Modal>
    )
  }

  const displayImage = selectedImage || variants[0]?.images?.[0] || ''
  const price = selectedVariant?.price || variants[0]?.price || 0

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" showCloseButton>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-20 h-20"
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
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
            {product.brand && (
              <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
            )}
            {product.categoryId && (
              <p className="text-sm text-gray-600 mb-4">
                Category: {product.categoryId.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(price)}
            </span>
          </div>

          {product.shortDescription && (
            <div>
              <p className="text-gray-700 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>
          )}

          {/* Variants */}
          {variants.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Variant
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => {
                      setSelectedVariant(variant)
                      setSelectedImage(variant.images?.[0] || '')
                    }}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedVariant?._id === variant._id
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-900'
                    }`}
                  >
                    {formatCurrency(variant.price)}
                    {variant.sku && ` - ${variant.sku}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bundle Items */}
          {product.isBundle && product.bundleItems && product.bundleItems.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">This set includes:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {product.bundleItems.map((item, index) => (
                  <li key={index}>
                    {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          {variants.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
                >
                  Add to Cart
                </button>
                <Link
                  href={`/products/${productId}`}
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-900 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

