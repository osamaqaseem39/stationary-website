'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [activeLink, setActiveLink] = useState('shop')

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">orlion</span>
                <div className="w-8 h-8 bg-blue-light rounded"></div>
              </div>
              <span className="text-sm text-gray-600">studio</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/work"
              className={`text-sm font-medium transition-colors ${
                activeLink === 'work' ? 'text-pink' : 'text-gray-700 hover:text-pink'
              }`}
              onClick={() => setActiveLink('work')}
            >
              work
            </Link>
            <Link
              href="/shop"
              className={`text-sm font-medium transition-colors ${
                activeLink === 'shop' ? 'text-pink' : 'text-gray-700 hover:text-pink'
              }`}
              onClick={() => setActiveLink('shop')}
            >
              shop
            </Link>
            <Link
              href="/info"
              className={`text-sm font-medium transition-colors ${
                activeLink === 'info' ? 'text-pink' : 'text-gray-700 hover:text-pink'
              }`}
              onClick={() => setActiveLink('info')}
            >
              info
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors ${
                activeLink === 'contact' ? 'text-pink' : 'text-gray-700 hover:text-pink'
              }`}
              onClick={() => setActiveLink('contact')}
            >
              contact
            </Link>
            <button className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg
                className="w-6 h-6 text-gray-700"
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
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

