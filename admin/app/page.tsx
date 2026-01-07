'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminApiClient } from '@/lib/api'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (adminApiClient.isAuthenticated()) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

