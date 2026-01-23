'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { apiClient } from '@/lib/api'
import Breadcrumbs from '@/components/Breadcrumbs'
import { useToast } from '@/components/ui/ToastProvider'
import ProductCard from '@/components/ProductCard'
import { CURRENCY_PREFIX } from '@/lib/currency'

interface Variant {
  _id: string
  sku: string
  price: number
  attributes: Record<string, any>
  inventory?: number
  available?: number
  images?: string[]
}

interface Product {
  _id: string
  name: string
  shortDescription?: string
  description?: string
  brand?: string
  brandId?: {
    _id: string
    name: string
    slug?: string
  }
  categoryId?: {
    _id: string
    name: string
    slug?: string
  }
  images?: string[]
  regularPrice?: number
  salePrice?: number
  stockStatus?: string
  isActive?: boolean
  isBundle?: boolean
  bundleItems?: Array<{
    productId: string
    quantity: number
    name: string
  }>
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<any[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        try {
          const result = await apiClient.getProduct(productId)
          if (result.data) {
            const p = result.data.product
            setProduct(p)
            const variantList = result.data.variants || []
            setVariants(variantList)

            if (variantList.length > 0) {
              setSelectedVariant(variantList[0])
              setSelectedImage(variantList[0]?.images?.[0] || p?.images?.[0] || '')
            } else {
              setSelectedImage(p?.images?.[0] || '')
            }

            // Load related products
            const categoryId = p?.categoryId?._id
            if (categoryId) {
              const rel = await apiClient.getProducts({ categoryId, limit: 10 })
              if (rel.data?.products) {
                setRelated(rel.data.products.filter((prod: any) => prod._id !== productId))
              }
            }
          }
        } catch (error) {
          console.error('Failed to load product:', error)
        } finally {
          setLoading(false)
        }
      }
      loadProduct()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return

    let price = 0
    if (selectedVariant) {
      price = selectedVariant.price
    } else if (product.salePrice) {
      price = product.salePrice
    } else if (product.regularPrice) {
      price = product.regularPrice
    }

    const image = selectedImage || (product.images?.[0] || '')

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const cartItem = {
      id: selectedVariant ? `${product._id}-${selectedVariant._id}` : product._id,
      productId: product._id,
      variantId: selectedVariant?._id,
      name: product.name,
      price: `${CURRENCY_PREFIX}${price}`,
      image: image,
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
    showToast('Added to cart successfully!', 'success')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading premium product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">We couldn't find the product you're looking for. It might have been removed or the link is incorrect.</p>
          <Link href="/shop" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-primary transition-all">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const allImages = [
    ...(product.images || []),
    ...variants.flatMap((v) => v.images || [])
  ].filter((img, index, self) => img && self.indexOf(img) === index)

  const displayImages = allImages.length > 0 ? allImages : ['/images/placeholder.jpg']

  // Price Display Logic
  let displayPrice = 0
  if (selectedVariant) {
    displayPrice = selectedVariant.price
  } else if (product.salePrice) {
    displayPrice = product.salePrice
  } else if (product.regularPrice) {
    displayPrice = product.regularPrice
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop' },
              { label: product.categoryId?.name || 'Category', href: `/shop?category=${product.categoryId?._id}` },
              { label: product.name },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Product Images - Sticky on Large Screens */}
          <div className="lg:col-span-7">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              {displayImages.length > 1 && (
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[600px] no-scrollbar py-1">
                  {displayImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border transition-all ${selectedImage === img
                        ? 'border-gray-900 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 w-full max-w-[600px] mx-auto">
                <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden group border border-gray-200 max-w-full">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {product.categoryId && (
                  <Link
                    href={`/shop?category=${product.categoryId._id}`}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    {product.categoryId.name}
                  </Link>
                )}
                {product.brand || product.brandId?.name ? (
                  <span className="text-xs text-gray-500">
                    {product.brand || product.brandId?.name}
                  </span>
                ) : null}
              </div>

              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">(24 Reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-semibold text-gray-900">
                  {displayPrice > 0 ? `${CURRENCY_PREFIX}${displayPrice}` : 'Price on request'}
                </span>
                {selectedVariant && selectedVariant.available !== undefined && selectedVariant.available < 5 && selectedVariant.available > 0 && (
                  <span className="text-sm text-red-600 font-medium">
                    Only {selectedVariant.available} left
                  </span>
                )}
                {!selectedVariant && product.stockStatus === 'outofstock' && (
                  <span className="text-sm text-red-600 font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Description Preview */}
            <div className="text-gray-600 leading-relaxed text-sm line-clamp-3">
              {product.description}
            </div>

            {/* Variant Selector */}
            {variants.length > 1 && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Select Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => {
                        setSelectedVariant(variant)
                        if (variant.images?.[0]) {
                          setSelectedImage(variant.images[0])
                        }
                      }}
                      disabled={(variant.available || 0) === 0}
                      className={`flex flex-col p-3 rounded-lg border text-left transition-all ${selectedVariant?._id === variant._id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                        } ${(variant.available || 0) === 0 ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                    >
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {Object.entries(variant.attributes)
                          .map(([key, value]) => `${value}`)
                          .join(' / ') || `SKU: ${variant.sku}`}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {CURRENCY_PREFIX}{variant.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Quantity */}
                <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1 border border-gray-200 min-w-[120px] justify-between">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-white text-gray-600 transition-all text-sm font-medium"
                  >
                    −
                  </button>
                  <span className="text-sm font-medium text-gray-900 w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant?.available || 99, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-white text-gray-600 transition-all text-sm font-medium"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || (selectedVariant.available || 0) === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${!selectedVariant || (selectedVariant.available || 0) === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {!selectedVariant || (selectedVariant.available || 0) === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>

              {/* Other Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Wishlist
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>

            {/* Features/Info Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-1.5 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-xs text-gray-500">Fast Shipping</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-1.5 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A3.301 3.301 0 0015.5 1h-7a3.301 3.301 0 00-3.317 2.984C5.101 4.908 5 5.946 5 7v2a1 1 0 001 1h12a1 1 0 001-1V7c0-1.054-.101-2.092-.182-3.016z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-500">100% Genuine</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-1.5 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-500">Secure Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="border-b border-gray-200 flex gap-6 mb-6 overflow-x-auto no-scrollbar">
            <button className="pb-3 border-b-2 border-gray-900 text-gray-900 font-medium text-sm whitespace-nowrap">Description</button>
            <button className="pb-3 text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors whitespace-nowrap">Specifications</button>
            <button className="pb-3 text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors whitespace-nowrap">Reviews (24)</button>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed p-6 rounded-lg bg-gray-50">
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Recommended for You
              </h2>
              <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {related.map((p) => {
                const minPrice = p.variants?.length
                  ? Math.min(...p.variants.map((v: any) => v.price))
                  : 0
                const image = p.images?.[0] || p.variants?.[0]?.images?.[0] || '/images/placeholder.jpg'

                return (
                  <ProductCard
                    key={p._id}
                    id={p._id}
                    productId={p._id}
                    name={p.name}
                    price={minPrice > 0 ? `From ${CURRENCY_PREFIX}${minPrice}` : 'Price on request'}
                    image={image}
                    brand={p.brand}
                    labels={p.categoryId ? [p.categoryId.name] : []}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

