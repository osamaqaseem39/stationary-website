'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { apiClient } from '@/lib/api'
import Breadcrumbs from '@/components/Breadcrumbs'
import { useToast } from '@/components/ui/ToastProvider'

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
  description: string
  categoryId: {
    _id: string
    name: string
  }
  brand?: string
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
  const [related, setRelated] = useState<Product[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    if (productId) {
      apiClient.getProduct(productId).then((result) => {
        if (result.data) {
          setProduct(result.data.product)
          const variantList = result.data.variants || []
          setVariants(variantList)
          if (variantList.length > 0) {
            setSelectedVariant(variantList[0])
            setSelectedImage(variantList[0]?.images?.[0] || '')
          }
          setLoading(false)

          // Load related products by category
          const categoryId = result.data.product?.categoryId?._id
          if (categoryId) {
            apiClient.getProducts({ categoryId, limit: 4 }).then((rel) => {
              if (rel.data?.products) {
                setRelated(rel.data.products.filter((p: any) => p._id !== productId))
              }
            })
          }
        }
      })
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const cartItem = {
      id: `${product._id}-${selectedVariant._id}`,
      productId: product._id,
      variantId: selectedVariant._id,
      name: product.name,
      price: `PKR ${selectedVariant.price}`,
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
    
    // Show success message
    showToast('Added to cart!', 'success')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link href="/products" className="text-blue hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const allImages = variants
    .flatMap((v) => v.images || [])
    .filter(Boolean)
  const displayImages = allImages.length > 0 ? allImages : ['']

  return (
    <main className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: product.categoryId?.name || 'Products', href: '/products' },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg p-8 aspect-square overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-32 h-32 text-gray-400"
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

            {/* Thumbnail Images */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayImages.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-pink shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.categoryId && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  {product.categoryId.name}
                </span>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-lg text-gray-600 mb-6">Brand: {product.brand}</p>
              )}
            </div>

            {selectedVariant && (
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    PKR {selectedVariant.price}
                  </span>
                  {selectedVariant.available !== undefined && (
                    <span
                      className={`text-sm font-medium ${
                        selectedVariant.available > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {selectedVariant.available > 0
                        ? `${selectedVariant.available} in stock`
                        : 'Out of stock'}
                    </span>
                  )}
                </div>

                {/* Variant Selection */}
                {variants.length > 1 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Option:
                    </label>
                    <div className="space-y-3">
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
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedVariant?._id === variant._id
                              ? 'border-pink bg-pink-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${
                            (variant.available || 0) === 0
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">SKU: {variant.sku}</p>
                              {Object.keys(variant.attributes || {}).length > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {Object.entries(variant.attributes)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(', ')}
                                </p>
                              )}
                            </div>
                            <span className="font-bold">PKR {variant.price}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 min-w-[4rem] text-center font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(
                            selectedVariant.available || 99,
                            quantity + 1
                          )
                        )
                      }
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={(selectedVariant.available || 0) === 0}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                    (selectedVariant.available || 0) === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-pink hover:scale-105 shadow-lg'
                  }`}
                >
                  {(selectedVariant.available || 0) === 0
                    ? 'Out of Stock'
                    : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Product Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Product Features
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Premium Quality Materials
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Fast & Secure Shipping
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  30-Day Return Policy
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
            <p className="text-gray-600">No reviews yet. Be the first to review this product.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Write a review</h3>
            <div className="space-y-3">
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Your name" />
              <textarea className="w-full border rounded px-3 py-2 text-sm" rows={4} placeholder="Your review" />
              <button className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-semibold hover:bg-pink transition">
                Submit review
              </button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.slice(0, 4).map((p: any) => {
                const minPrice = p.variants?.length
                  ? Math.min(...p.variants.map((v: any) => v.price))
                  : 0
                const image = p.variants?.[0]?.images?.[0] || ''
                return (
                  <Link key={p._id} href={`/products/${p._id}`} className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
                    <div className="aspect-square bg-gray-100">
                      {image ? <img src={image} alt={p.name} className="w-full h-full object-cover" /> : null}
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-semibold line-clamp-2 min-h-[2.25rem]">{p.name}</div>
                      <div className="mt-2 text-gray-900 font-bold">
                        {minPrice > 0 ? `From PKR ${minPrice}` : 'Price on request'}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

