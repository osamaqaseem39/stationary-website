'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import SearchBar from './SearchBar'
import CartDrawer from './CartDrawer'
import { getWishlistCount } from '@/lib/wishlist'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Load cart count from localStorage or API
    const loadCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0))
    }

    // Load wishlist count
    const loadWishlistCount = () => {
      setWishlistCount(getWishlistCount())
    }

    loadCartCount()
    loadWishlistCount()

    // Listen for cart and wishlist updates
    window.addEventListener('cartUpdated', loadCartCount)
    window.addEventListener('storage', loadCartCount)
    window.addEventListener('wishlistUpdated', loadWishlistCount)

    return () => {
      window.removeEventListener('cartUpdated', loadCartCount)
      window.removeEventListener('storage', loadCartCount)
      window.removeEventListener('wishlistUpdated', loadWishlistCount)
    }
  }, [])

  const navigation = [
    { name: 'Home', href: '/', active: pathname === '/' },
    { name: 'Shop', href: '/shop', active: pathname === '/shop' },
    { name: 'Account', href: '/account', active: pathname === '/account' },
  ]

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-md shadow-gray-100/50 transition-all duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group animate-fadeInLeft">
            <span className="text-2xl lg:text-3xl font-extrabold text-primary group-hover:scale-110 transition-transform duration-300 relative">
              GBS Store
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:block flex-1">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 animate-fadeInDown">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold transition-all duration-300 relative group ${item.active
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="relative z-10">{item.name}</span>
                {item.active ? (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary animate-scaleIn"></span>
                ) : (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                )}
                <span className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
              </Link>
            ))}

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-3 hover:bg-primary/10 rounded-full transition-all duration-300 group hover:scale-110 animate-fadeInRight animation-delay-200"
              aria-label="View wishlist"
            >
              <svg
                className="w-6 h-6 text-gray-700 group-hover:text-primary transition-all duration-300 transform group-hover:scale-110"
                fill={wishlistCount > 0 ? 'currentColor' : 'none'}
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
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg animate-scaleIn">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
              <span className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/20 transition-all duration-300 -z-10"></span>
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 hover:bg-secondary/10 rounded-full transition-all duration-300 group hover:scale-110 animate-fadeInRight animation-delay-400"
              aria-label="Open cart"
            >
              <svg
                className="w-6 h-6 text-gray-700 group-hover:text-secondary transition-all duration-300 transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg animate-scaleIn">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
              <span className="absolute inset-0 rounded-full bg-secondary/0 group-hover:bg-secondary/20 transition-all duration-300 -z-10"></span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 animate-fadeInDown bg-white/95 backdrop-blur-md">
            <div className="mb-4 animate-fadeInUp animation-delay-200">
              <SearchBar />
            </div>
            <nav className="flex flex-col space-y-3 stagger-children">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-semibold px-4 py-2 rounded-lg transition-all duration-300 animate-fadeInLeft ${item.active
                      ? 'text-gray-900 bg-primary/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between text-base font-medium text-gray-600 hover:text-gray-900"
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}

