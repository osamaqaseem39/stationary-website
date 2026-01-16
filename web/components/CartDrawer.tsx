'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
  const [drawerWidth, setDrawerWidth] = useState('85%')
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

  // Set responsive drawer width
  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 640) {
        setDrawerWidth('85%')
      } else if (window.innerWidth < 1024) {
        setDrawerWidth('400px')
      } else {
        setDrawerWidth('420px')
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  // Always render drawer for smooth transitions, control visibility with styles
  const drawerContent = (
    <>
      {/* Backdrop with fade animation */}
      <div
        className="fixed inset-0 bg-black/30"
        style={{ 
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          pointerEvents: isOpen ? 'auto' : 'none',
          visibility: isOpen ? 'visible' : 'hidden'
        }}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      
      {/* Panel - Fixed width constraints */}
      <aside
        className="fixed right-0 top-0 h-full shadow-2xl overflow-hidden"
        style={{
          zIndex: 9999,
          width: drawerWidth,
          maxWidth: '420px',
          transform: isOpen 
            ? 'translateX(0) scale(1)' 
            : 'translateX(100%) scale(0.95)',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: isOpen 
            ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out, visibility 0s linear 0s'
            : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out, visibility 0s linear 0.4s',
          isolation: 'isolate',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          backgroundColor: '#ffffff',
          willChange: 'transform, opacity',
          transformOrigin: 'right center'
        }}
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg 
              className="w-5 h-5 text-gray-600" 
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
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
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
            <p className="text-gray-600 text-lg mb-2 font-medium">Your cart is empty</p>
            <p className="text-gray-500 text-sm mb-6">Start adding items to your cart!</p>
            <Link
              href="/shop"
              onClick={onClose}
              className="inline-block px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-primary transition-colors"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <Link 
                    href={`/products/${item.id}`}
                    onClick={onClose}
                    className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <Link 
                        href={`/products/${item.id}`}
                        onClick={onClose}
                        className="font-semibold text-sm text-gray-900 hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-semibold text-gray-900">{item.price}</span>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-1.5 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-3 py-1.5 min-w-[2.5rem] text-center font-semibold bg-gray-50 text-gray-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1.5 hover:bg-gray-100 active:bg-gray-200 transition-colors font-semibold text-gray-700"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer with Summary */}
            <div className="border-t border-gray-200 bg-white p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="font-bold text-lg text-gray-900">PKR {subtotal.toFixed(2)}</span>
              </div>
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-primary transition-colors"
              >
                View cart
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full text-center text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Checkout →
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  )

  return typeof document !== 'undefined' 
    ? createPortal(drawerContent, document.body)
    : null
}
