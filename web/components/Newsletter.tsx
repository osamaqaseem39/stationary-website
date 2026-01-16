'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <section className="relative w-full bg-white py-20 lg:py-28 px-4 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute inset-0 gift-pattern opacity-10"></div>
      
      <div className="relative max-w-4xl mx-auto text-center z-10 animate-fadeInUp">
        <div className="mb-6 animate-fadeInDown">
          <div className="inline-block mb-4">
            <svg className="w-16 h-16 text-primary animate-float mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Join the <span className="text-primary">Club</span>
          </h2>
        </div>
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeInUp animation-delay-200">
          Join my newsletter and get <span className="font-bold text-primary">10% discount</span> for your first order, access to
          special announcements and exclusive content.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto items-center animate-fadeInUp animation-delay-400">
          <div className="relative flex-1 w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email here *"
              required
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 placeholder:text-gray-400"
            />
            <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
          <button
            type="submit"
            className="group relative px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all duration-300 whitespace-nowrap shadow-xl hover:shadow-2xl hover:shadow-primary/50 hover:scale-110 btn-hover-effect overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Sign Up
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </form>
        
        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 items-center animate-fadeInUp animation-delay-600">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">No spam, unsubscribe anytime</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Secure & Private</span>
          </div>
        </div>
      </div>
    </section>
  )
}

