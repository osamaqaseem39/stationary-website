import React from 'react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full bg-gray-900 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 uniform-pattern opacity-5"></div>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 stagger-children">
          {/* Brand Section */}
          <div className="lg:col-span-1 animate-fadeInUp">
            <Link href="/" className="inline-block mb-6 group animate-fadeInLeft">
              <span className="text-3xl font-extrabold text-primary group-hover:scale-110 transition-transform duration-300 inline-block">
                GBS Store
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed animate-fadeInUp animation-delay-200">
              Your one-stop shop for premium stationery, unique gifts, and quality uniforms.
            </p>
            <div className="flex space-x-3 animate-fadeInUp animation-delay-400">
              <a
                href="#"
                className="group relative w-12 h-12 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm hover:bg-primary rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl hover:shadow-primary/50"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="group relative w-12 h-12 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm hover:bg-primary rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl hover:shadow-primary/50"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="group relative w-12 h-12 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm hover:bg-secondary rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl hover:shadow-secondary/50"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fadeInUp animation-delay-200">
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <nav className="flex flex-col space-y-3 stagger-children">
              {[
                { href: '/', label: 'Home' },
                { href: '/shop', label: 'Shop' },
                { href: '/products', label: 'Products' },
                { href: '/cart', label: 'Cart' },
                { href: '/account', label: 'Account' },
              ].map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium relative inline-block w-fit animate-fadeInLeft"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer Service */}
          <div className="animate-fadeInUp animation-delay-400">
            <h3 className="text-xl font-bold mb-6 text-white">Customer Service</h3>
            <nav className="flex flex-col space-y-3 stagger-children">
              {[
                { href: '/contact', label: 'Contact Us' },
                { href: '/shipping', label: 'Shipping Info' },
                { href: '/returns', label: 'Returns & Exchanges' },
                { href: '/faq', label: 'FAQ' },
              ].map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium relative inline-block w-fit animate-fadeInLeft"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal & Info */}
          <div className="animate-fadeInUp animation-delay-600">
            <h3 className="text-xl font-bold mb-6 text-white">Legal</h3>
            <nav className="flex flex-col space-y-3 stagger-children">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/cookie-policy', label: 'Cookie Policy' },
              ].map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium relative inline-block w-fit animate-fadeInLeft"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-700/50 animate-fadeInUp animation-delay-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm font-medium">
              © {currentYear} <span className="font-bold text-primary">GBS Store</span>. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm font-medium flex items-center gap-2 group">
              Made with{' '}
              <span className="text-primary transform group-hover:scale-125 transition-transform duration-300 inline-block animate-pulse-glow">
                ❤️
              </span>{' '}
              for quality shopping
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary opacity-20"></div>
    </footer>
  )
}

