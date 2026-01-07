'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { adminApiClient } from '@/lib/api'

interface Product {
  _id: string
  name: string
}

export default function EditVariantPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [variant, setVariant] = useState<any>(null)
  const [formData, setFormData] = useState({
    productId: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    size: '',
    color: '',
    gender: '',
    isActive: true,
  })

  useEffect(() => {
    if (id) {
      loadVariant()
      loadProducts()
    }
  }, [id])

  const loadVariant = async () => {
    try {
      // Note: You may need to add a getVariant endpoint
      // For now, we'll load from variants list
      const result = await adminApiClient.getVariants()
      if (result.data) {
        const found = result.data.variants?.find((v: any) => v._id === id)
        if (found) {
          setVariant(found)
          const attrs = found.attributes || {}
          setFormData({
            productId: found.productId?._id || found.productId || '',
            sku: found.sku || '',
            price: found.price?.toString() || '',
            compareAtPrice: found.compareAtPrice?.toString() || '',
            size: attrs.size || '',
            color: attrs.color || '',
            gender: attrs.gender || '',
            isActive: found.isActive !== false,
          })
        }
      }
    } catch (error) {
      console.error('Failed to load variant:', error)
    }
  }

  const loadProducts = async () => {
    try {
      const result = await adminApiClient.getProducts({ limit: 1000 })
      if (result.data) {
        setProducts(result.data.products || [])
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.productId || !formData.sku || !formData.price) {
      alert('Product, SKU, and Price are required')
      return
    }

    try {
      setLoading(true)
      const attributes: any = {}
      if (formData.size) attributes.size = formData.size
      if (formData.color) attributes.color = formData.color
      if (formData.gender) attributes.gender = formData.gender

      const payload = {
        productId: formData.productId,
        sku: formData.sku,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        attributes,
        isActive: formData.isActive,
      }

      const result = await adminApiClient.updateVariant(id, payload)
      if (result.error) {
        alert(result.error)
      } else {
        router.push('/dashboard/variants')
      }
    } catch (error) {
      console.error('Failed to update variant:', error)
      alert('Failed to update variant')
    } finally {
      setLoading(false)
    }
  }

  if (!variant) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="ml-64 p-8">
          <div className="max-w-3xl">Loading...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">GBS Admin</h1>
        </div>
        <nav className="mt-8">
          <Link href="/dashboard" className="block px-6 py-3 hover:bg-gray-700 transition">
            Dashboard
          </Link>
          <Link href="/dashboard/products" className="block px-6 py-3 hover:bg-gray-700 transition">
            Products
          </Link>
          <Link href="/dashboard/orders" className="block px-6 py-3 hover:bg-gray-700 transition">
            Orders
          </Link>
          <Link href="/dashboard/inventory" className="block px-6 py-3 hover:bg-gray-700 transition">
            Inventory
          </Link>
          <Link href="/dashboard/users" className="block px-6 py-3 hover:bg-gray-700 transition">
            Users
          </Link>
          <Link href="/dashboard/categories" className="block px-6 py-3 hover:bg-gray-700 transition">
            Categories
          </Link>
          <Link href="/dashboard/variants" className="block px-6 py-3 bg-gray-700">
            Variants
          </Link>
        </nav>
      </aside>

      <div className="ml-64 p-8">
        <div className="max-w-3xl">
          <div className="mb-6">
            <Link
              href="/dashboard/variants"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to Variants
            </Link>
            <h1 className="text-4xl font-bold">Edit Variant</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product *
              </label>
              <select
                required
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare At Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Variant'}
              </button>
              <Link
                href="/dashboard/variants"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

