'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useToast } from './ui/ToastProvider'

interface CartItem {
  id: string
  name: string
  price: string
  image: string
  quantity: number
}

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    const load = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setItems(cart)
    }
    load()
    window.addEventListener('cartUpdated', load)
    return () => window.removeEventListener('cartUpdated', load)
  }, [])

  const updateQuantity = (id: string, change: number) => {
    const updated = items.map((it) =>
      it.id === id ? { ...it, quantity: Math.max(1, it.quantity + change) } : it
    )
    setItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('cartUpdated'))
    showToast(change > 0 ? 'Quantity increased' : 'Quantity decreased', 'success')
  }

  const removeItem = (id: string) => {
    const updated = items.filter((it) => it.id !== id)
    setItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('cartUpdated'))
    showToast('Item removed from cart', 'success')
  }

  const subtotal = items.reduce((sum, it) => {
    const price = parseFloat(it.price.replace(/[^0-9.]/g, '')) || 0
    return sum + price * it.quantity
  }, 0)

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={onClose}
              className="inline-block mt-4 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-pink"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-medium">{item.price}</span>
                      <div className="flex items-center border rounded">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-gray-100">-</button>
                        <span className="px-3">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-5">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 hover:scale-[1.01] transition"
              >
                View cart
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full text-center mt-2 text-gray-700 hover:text-gray-900 text-sm"
              >
                Checkout →
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}


