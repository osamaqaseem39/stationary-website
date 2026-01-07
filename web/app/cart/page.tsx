'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button, Card, Loading } from '@/components/ui'
import { useToast } from '@/components/ui/ToastProvider'

interface CartItem {
  id: string
  name: string
  price: string
  image: string
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(cart)
      setLoading(false)
    }

    loadCart()
    window.addEventListener('cartUpdated', loadCart)
    return () => window.removeEventListener('cartUpdated', loadCart)
  }, [])

  const updateQuantity = (id: string, change: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
    showToast(change > 0 ? 'Quantity increased' : 'Quantity decreased', 'success')
  }

  const removeItem = async (id: string) => {
    setRemovingId(id)
    // Small delay for better UX
    setTimeout(() => {
      const updatedCart = cartItems.filter((item) => item.id !== id)
      setCartItems(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('cartUpdated'))
      setRemovingId(null)
      showToast('Item removed from cart', 'success')
    }, 200)
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
    return sum + price * item.quantity
  }, 0)

  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" text="Loading your cart..." />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <Card className="p-12 text-center" padding="none">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-xl mb-2 font-semibold">Your cart is empty</p>
            <p className="text-gray-500 mb-8">Start adding some products to your cart!</p>
            <Button asChild href="/shop">
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  hover
                  className={`transition-all ${removingId === item.id ? 'opacity-50 scale-95' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <Link href={`/products/${item.id}`} className="flex-shrink-0">
                      <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                              className="w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <Link href={`/products/${item.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-pink transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-xl font-bold text-gray-900">{item.price}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={removingId === item.id}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Quantity:</span>
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors font-semibold text-gray-700"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="px-4 py-2 min-w-[3rem] text-center font-semibold bg-gray-50">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-4 py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors font-semibold text-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24" padding="lg">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-bold">Free</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {subtotal < 100 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800 font-medium">
                        Add ₹{(100 - subtotal).toFixed(2)} more for free shipping! 🎉
                      </p>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-xl">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button fullWidth size="lg" className="mb-4">
                  Proceed to Checkout
                </Button>
                
                <Link
                  href="/shop"
                  className="block text-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  Continue Shopping →
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

