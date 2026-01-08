'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminApiClient } from '@/lib/api'
import { uploadImage, uploadImages } from '@/lib/upload'

interface Category {
  _id: string
  name: string
}

interface Product {
  _id: string
  name: string
  sku?: string
  regularPrice?: number
  images?: string[]
}

interface BundleItem {
  productId: string
  quantity: number
  name: string
}

export default function CreateProductSetPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [formData, setFormData] = useState({
    // Set/Bundle Information
    name: '',
    shortDescription: '',
    description: '',
    categoryId: '',
    brand: '',
    status: 'active' as 'active' | 'draft' | 'archived',
    
    // Pricing
    regularPrice: '',
    salePrice: '',
    sku: '',
    
    // Images
    images: [] as string[],
    
    // Bundle Items
    bundleItems: [] as BundleItem[],
  })

  useEffect(() => {
    loadCategories()
    loadProducts()
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

  const handleImageAdd = (url: string) => {
    if (url && !formData.images.includes(url)) {
      setFormData({ ...formData, images: [...formData.images, url] })
    }
  }

  const handleImageRemove = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress('Uploading images...')

    try {
      if (files.length === 1) {
        const result = await uploadImage(files[0])
        if (result.success && result.url) {
          handleImageAdd(result.url)
          setUploadProgress('')
        } else {
          setUploadProgress(result.error || 'Upload failed')
          alert(result.error || 'Failed to upload image')
        }
      } else {
        const fileArray = Array.from(files)
        const result = await uploadImages(fileArray)
        if (result.success && result.urls) {
          result.urls.forEach(url => handleImageAdd(url))
          setUploadProgress('')
        } else {
          setUploadProgress(result.error || 'Upload failed')
          alert(result.error || 'Failed to upload images')
        }
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadProgress('Upload failed')
      alert(error.message || 'Failed to upload images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      if (!uploadProgress.includes('failed') && !uploadProgress.includes('Failed')) {
        setUploadProgress('')
      } else {
        setTimeout(() => setUploadProgress(''), 5000)
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const addProductToBundle = (product: Product) => {
    const existingIndex = formData.bundleItems.findIndex(item => item.productId === product._id)
    if (existingIndex >= 0) {
      // Update quantity
      const updatedItems = [...formData.bundleItems]
      updatedItems[existingIndex].quantity += 1
      setFormData({ ...formData, bundleItems: updatedItems })
    } else {
      // Add new item
      setFormData({
        ...formData,
        bundleItems: [...formData.bundleItems, {
          productId: product._id,
          quantity: 1,
          name: product.name
        }]
      })
    }
    setSearchTerm('')
  }

  const removeProductFromBundle = (productId: string) => {
    setFormData({
      ...formData,
      bundleItems: formData.bundleItems.filter(item => item.productId !== productId)
    })
  }

  const updateBundleItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setFormData({
      ...formData,
      bundleItems: formData.bundleItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    })
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !formData.bundleItems.some(item => item.productId === p._id)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.categoryId) {
      alert('Name and Category are required')
      return
    }

    if (formData.bundleItems.length === 0) {
      alert('Please add at least one product to the set')
      return
    }

    try {
      setLoading(true)
      
      const payload: any = {
        name: formData.name,
        shortDescription: formData.shortDescription,
        description: formData.description,
        categoryId: formData.categoryId,
        brand: formData.brand,
        status: formData.status,
        isBundle: true,
        bundleItems: formData.bundleItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        regularPrice: formData.regularPrice ? parseFloat(formData.regularPrice) : undefined,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        sku: formData.sku,
        images: formData.images,
        isActive: true,
      }

      const result = await adminApiClient.createProduct(payload)
      if (result.error) {
        alert(result.error)
      } else {
        alert('Product set created successfully!')
        router.push('/dashboard/products')
      }
    } catch (error: any) {
      console.error('Create product set error:', error)
      alert('Failed to create product set: ' + error.message)
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
          <h1 className="text-3xl font-bold text-gray-900">Create Product Set</h1>
          <p className="mt-2 text-gray-600">
            Create a bundle or set containing multiple products (e.g., "Class 10 Book Set" with 10 books)
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Set Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Set Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Class 10 Book Set"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Set SKU"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full description of the set"
                />
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regular Price (PKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price (PKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Add Products to Set */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Products in Set</h2>
              
              {/* Search and Add Products */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products to Add
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search products by name..."
                  />
                  
                  {/* Search Results Dropdown */}
                  {searchTerm && filteredProducts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredProducts.slice(0, 10).map(product => (
                        <div
                          key={product._id}
                          onClick={() => addProductToBundle(product)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              {product.sku && <div className="text-sm text-gray-500">SKU: {product.sku}</div>}
                              {product.regularPrice && (
                                <div className="text-sm text-gray-600">PKR {product.regularPrice}</div>
                              )}
                            </div>
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bundle Items List */}
              {formData.bundleItems.length > 0 ? (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.bundleItems.map((item) => {
                        const product = products.find(p => p._id === item.productId)
                        return (
                          <tr key={item.productId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {product?.images?.[0] && (
                                  <img
                                    src={product.images[0]}
                                    alt={item.name}
                                    className="h-10 w-10 object-cover rounded mr-3"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  {product?.sku && (
                                    <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateBundleItemQuantity(item.productId, parseInt(e.target.value) || 1)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => removeProductFromBundle(item.productId)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No products added yet. Search and add products above.</p>
                </div>
              )}
            </div>

            {/* Images */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Set Images</h2>
              
              {/* File Upload Section */}
              <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={uploading}
                    className="mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Images'}
                  </button>
                  <p className="text-sm text-gray-500">
                    Select one or more images (JPEG, PNG, GIF, WebP, SVG)
                  </p>
                  {uploadProgress && (
                    <p className="text-sm mt-2 text-red-600">
                      {uploadProgress}
                    </p>
                  )}
                </div>
              </div>

              {/* URL Input Section */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Or enter image URL:</p>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleImageAdd((e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">Press Enter to add image URL</p>
              </div>

              {/* Images Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Set image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Image+Error'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Link
                href="/dashboard/products"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || formData.bundleItems.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Set...' : `Create Set (${formData.bundleItems.length} products)`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

