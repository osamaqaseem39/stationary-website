'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [activeLink, setActiveLink] = useState('shop')

  return (
    <header className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-semibold text-gray-800 tracking-tight">orlion studio</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/work"
              className={`text-sm font-normal transition-colors ${
                activeLink === 'work' ? 'text-pink-light' : 'text-pink-light hover:text-pink'
              }`}
              onClick={() => setActiveLink('work')}
            >
              work
            </Link>
            <Link
              href="/shop"
              className={`text-sm font-normal transition-colors ${
                activeLink === 'shop' ? 'text-pink-dark' : 'text-pink-dark hover:text-pink'
              }`}
              onClick={() => setActiveLink('shop')}
            >
              shop
            </Link>
            <Link
              href="/info"
              className={`text-sm font-normal transition-colors ${
                activeLink === 'info' ? 'text-pink-light' : 'text-pink-light hover:text-pink'
              }`}
              onClick={() => setActiveLink('info')}
            >
              info
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-normal transition-colors ${
                activeLink === 'contact' ? 'text-pink-light' : 'text-pink-light hover:text-pink'
              }`}
              onClick={() => setActiveLink('contact')}
            >
              contact
            </Link>
            <button className="ml-4 relative p-2 hover:opacity-80 transition-opacity">
              <svg
                className="w-6 h-6 text-blue"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              <span className="absolute -top-1 -right-1 bg-blue text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                0
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

