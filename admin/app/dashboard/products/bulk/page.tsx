'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminApiClient } from '@/lib/api'

interface Category {
  _id: string
  name: string
}

interface ProductRow {
  id: string
  name: string
  categoryId: string
  sku: string
  regularPrice: string
  salePrice: string
  stockQuantity: string
  brand: string
  status: 'active' | 'draft' | 'archived'
}

export default function BulkProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [commonSettings, setCommonSettings] = useState({
    categoryId: '',
    brand: '',
    status: 'active' as 'active' | 'draft' | 'archived',
    stockStatus: 'instock' as 'instock' | 'outofstock' | 'onbackorder',
    manageStock: true,
    requiresShipping: true,
  })
  
  const [products, setProducts] = useState<ProductRow[]>([
    {
      id: Date.now().toString(),
      name: '',
      categoryId: '',
      sku: '',
      regularPrice: '',
      salePrice: '',
      stockQuantity: '',
      brand: '',
      status: 'active',
    }
  ])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const result = await adminApiClient.getCategories()
      if (result.data) {
        setCategories(result.data.categories || [])
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const addProductRow = () => {
    setProducts([...products, {
      id: Date.now().toString(),
      name: '',
      categoryId: commonSettings.categoryId,
      sku: '',
      regularPrice: '',
      salePrice: '',
      stockQuantity: '',
      brand: commonSettings.brand,
      status: commonSettings.status,
    }])
  }

  const removeProductRow = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const updateProduct = (id: string, field: keyof ProductRow, value: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const applyCommonSettings = () => {
    setProducts(products.map(p => ({
      ...p,
      categoryId: commonSettings.categoryId || p.categoryId,
      brand: commonSettings.brand || p.brand,
      status: commonSettings.status,
    })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    const invalidProducts = products.filter(p => !p.name || !p.categoryId)
    if (invalidProducts.length > 0) {
      alert(`Please fill in name and category for all products. ${invalidProducts.length} product(s) missing required fields.`)
      return
    }

    setLoading(true)
    const results = { success: 0, failed: 0, errors: [] as string[] }

    try {
      // Create products sequentially
      for (const product of products) {
        try {
          const payload: any = {
            name: product.name,
            categoryId: product.categoryId || commonSettings.categoryId,
            brand: product.brand || commonSettings.brand,
            status: product.status || commonSettings.status,
            sku: product.sku || undefined,
            regularPrice: product.regularPrice ? parseFloat(product.regularPrice) : undefined,
            salePrice: product.salePrice ? parseFloat(product.salePrice) : undefined,
            stockQuantity: product.stockQuantity ? parseInt(product.stockQuantity) : undefined,
            stockStatus: commonSettings.stockStatus,
            manageStock: commonSettings.manageStock,
            requiresShipping: commonSettings.requiresShipping,
            isActive: true,
          }

          const result = await adminApiClient.createProduct(payload)
          if (result.data) {
            results.success++
          } else {
            results.failed++
            results.errors.push(`${product.name || 'Unknown'}: ${result.error || 'Failed'}`)
          }
        } catch (error: any) {
          results.failed++
          results.errors.push(`${product.name || 'Unknown'}: ${error.message || 'Failed'}`)
        }
      }

      // Show results
      if (results.failed === 0) {
        alert(`Successfully created ${results.success} product(s)!`)
        router.push('/dashboard/products')
      } else {
        const errorMsg = results.errors.length > 0 
          ? `\n\nErrors:\n${results.errors.slice(0, 5).join('\n')}${results.errors.length > 5 ? `\n...and ${results.errors.length - 5} more` : ''}`
          : ''
        alert(`Created ${results.success} product(s). ${results.failed} failed.${errorMsg}`)
        if (results.success > 0) {
          router.push('/dashboard/products')
        }
      }
    } catch (error: any) {
      console.error('Bulk create error:', error)
      alert('Failed to create products: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard/products"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Create Products</h1>
          <p className="mt-2 text-gray-600">
            Create multiple products at once. Fill in the common settings below, then add product details in the table.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Common Settings */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Common Settings</h2>
            <p className="text-sm text-gray-600 mb-4">
              These settings will be applied to all products. You can override them for individual products.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Category *
                </label>
                <select
                  value={commonSettings.categoryId}
                  onChange={(e) => setCommonSettings({ ...commonSettings, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Brand
                </label>
                <input
                  type="text"
                  value={commonSettings.brand}
                  onChange={(e) => setCommonSettings({ ...commonSettings, brand: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Status
                </label>
                <select
                  value={commonSettings.status}
                  onChange={(e) => setCommonSettings({ ...commonSettings, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Status
                </label>
                <select
                  value={commonSettings.stockStatus}
                  onChange={(e) => setCommonSettings({ ...commonSettings, stockStatus: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="instock">In Stock</option>
                  <option value="outofstock">Out of Stock</option>
                  <option value="onbackorder">On Backorder</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={commonSettings.manageStock}
                    onChange={(e) => setCommonSettings({ ...commonSettings, manageStock: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Manage Stock</span>
                </label>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={commonSettings.requiresShipping}
                    onChange={(e) => setCommonSettings({ ...commonSettings, requiresShipping: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Requires Shipping</span>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={applyCommonSettings}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Apply Common Settings to All Products
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Products</h2>
              <button
                type="button"
                onClick={addProductRow}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name *
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category *
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Regular Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sale Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Product name"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={product.categoryId}
                          onChange={(e) => updateProduct(product.id, 'categoryId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select...</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={product.sku}
                          onChange={(e) => updateProduct(product.id, 'sku', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="SKU"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={product.brand}
                          onChange={(e) => updateProduct(product.id, 'brand', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Brand"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          step="0.01"
                          value={product.regularPrice}
                          onChange={(e) => updateProduct(product.id, 'regularPrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          step="0.01"
                          value={product.salePrice}
                          onChange={(e) => updateProduct(product.id, 'salePrice', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={product.stockQuantity}
                          onChange={(e) => updateProduct(product.id, 'stockQuantity', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={product.status}
                          onChange={(e) => updateProduct(product.id, 'status', e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProductRow(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/products"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? `Creating ${products.length} products...` : `Create ${products.length} Product(s)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

