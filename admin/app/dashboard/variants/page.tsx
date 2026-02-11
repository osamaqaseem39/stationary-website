'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminApiClient } from '@/lib/api'

interface Variant {
  _id: string
  sku: string
  productId: {
    _id: string
    name: string
  }
  price: number
  compareAtPrice?: number
  attributes: any
  isActive: boolean
}

export default function VariantsPage() {
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)
  const [productFilter, setProductFilter] = useState('')

  useEffect(() => {
    loadVariants()
  }, [productFilter])

  const loadVariants = async () => {
    try {
      setLoading(true)
      const result = await adminApiClient.getVariants(productFilter || undefined)
      if (result.data) {
        setVariants(result.data.variants || [])
      }
    } catch (error) {
      console.error('Failed to load variants:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">Product Variants</h1>
            <Link
              href="/dashboard/variants/new"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Variant
            </Link>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Filter by Product ID..."
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <div className="bg-white p-6 rounded-lg shadow">Loading...</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compare At Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attributes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {variants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No variants found
                      </td>
                    </tr>
                  ) : (
                    variants.map((variant) => (
                      <tr key={variant._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {variant.productId?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          PKR {variant.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.compareAtPrice ? `PKR ${variant.compareAtPrice.toFixed(2)}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {variant.attributes && typeof variant.attributes === 'object'
                            ? Object.entries(variant.attributes)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              variant.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {variant.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/dashboard/variants/${variant._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

