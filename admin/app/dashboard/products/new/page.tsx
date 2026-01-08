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

interface Brand {
  _id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'inventory' | 'shipping' | 'seo' | 'images'>('basic')
  
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    shortDescription: '',
    description: '',
    categoryId: '',
    productType: '',
    brand: '', // Keep for backward compatibility
    brandId: '',
    vendor: '',
    tags: '',
    status: 'active', // active, draft, archived
    featured: false,
    
    // Uniform fields
    size: '',
    color: '',
    gender: '',
    material: '',
    style: '',
    schoolName: '',
    grade: '',
    uniformType: '',
    
    // Pricing
    regularPrice: '',
    salePrice: '',
    taxStatus: 'taxable', // taxable, shipping, none
    taxClass: 'standard',
    
    // Inventory
    sku: '',
    manageStock: true,
    stockQuantity: '',
    stockStatus: 'instock', // instock, outofstock, onbackorder
    backorders: 'no', // no, notify, yes
    lowStockThreshold: '',
    
    // Shipping
    weight: '',
    length: '',
    width: '',
    height: '',
    shippingClass: '',
    requiresShipping: true,
    shippingTaxable: true,
    
    // SEO
    seoTitle: '',
    seoDescription: '',
    seoSlug: '',
    seoKeywords: '',
    
    // Images
    images: [] as string[],
    
    // Additional
    purchaseNote: '',
    menuOrder: '0',
    reviewsAllowed: true,
    catalogVisibility: 'visible', // visible, catalog, search, hidden
  })

  useEffect(() => {
    loadCategories()
    loadBrands()
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

  const loadBrands = async () => {
    try {
      const result = await adminApiClient.getBrands()
      if (result.data) {
        setBrands(result.data.brands || [])
      }
    } catch (error) {
      console.error('Failed to load brands:', error)
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
        // Single file upload
        const result = await uploadImage(files[0])
        if (result.success && result.url) {
          handleImageAdd(result.url)
          // Auto-clear progress after brief success indication
          setUploadProgress('')
        } else {
          setUploadProgress(result.error || 'Upload failed')
          alert(result.error || 'Failed to upload image')
        }
      } else {
        // Multiple files upload
        const fileArray = Array.from(files)
        const result = await uploadImages(fileArray)
        if (result.success && result.urls) {
          result.urls.forEach(url => handleImageAdd(url))
          // Auto-clear progress after brief success indication
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
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      // Only show error messages, clear success messages immediately
      if (!uploadProgress.includes('failed') && !uploadProgress.includes('Failed')) {
        setUploadProgress('')
      } else {
        // Clear error messages after 5 seconds
        setTimeout(() => setUploadProgress(''), 5000)
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.categoryId) {
      alert('Name and Category are required')
      return
    }

    try {
      setLoading(true)
      
      // Prepare payload matching Shopify/WooCommerce structure
      const payload: any = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        categoryId: formData.categoryId,
        productType: formData.productType,
        brand: formData.brand,
        brandId: formData.brandId || undefined,
        vendor: formData.vendor,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        status: formData.status,
        featured: formData.featured,
        
        // Uniform fields
        size: formData.size || undefined,
        color: formData.color || undefined,
        gender: formData.gender || undefined,
        material: formData.material || undefined,
        style: formData.style || undefined,
        schoolName: formData.schoolName || undefined,
        grade: formData.grade || undefined,
        uniformType: formData.uniformType || undefined,
        
        // Pricing
        regularPrice: formData.regularPrice ? parseFloat(formData.regularPrice) : undefined,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        taxStatus: formData.taxStatus,
        taxClass: formData.taxClass,
        
        // Inventory
        sku: formData.sku,
        manageStock: formData.manageStock,
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : undefined,
        stockStatus: formData.stockStatus,
        backorders: formData.backorders,
        lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : undefined,
        
        // Shipping
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        length: formData.length ? parseFloat(formData.length) : undefined,
        width: formData.width ? parseFloat(formData.width) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        shippingClass: formData.shippingClass,
        requiresShipping: formData.requiresShipping,
        shippingTaxable: formData.shippingTaxable,
        
        // SEO
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoSlug: formData.seoSlug,
        seoKeywords: formData.seoKeywords,
        
        // Images
        images: formData.images,
        
        // Additional
        purchaseNote: formData.purchaseNote,
        menuOrder: parseInt(formData.menuOrder),
        reviewsAllowed: formData.reviewsAllowed,
        catalogVisibility: formData.catalogVisibility,
      }

      const result = await adminApiClient.createProduct(payload)
      if (result.error) {
        alert(result.error)
      } else {
        router.push('/dashboard/products')
      }
    } catch (error) {
      console.error('Failed to create product:', error)
      alert('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'seo', label: 'SEO' },
    { id: 'images', label: 'Images' },
  ]

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
          <Link href="/dashboard/products" className="block px-6 py-3 bg-gray-700">
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
          <Link href="/dashboard/variants" className="block px-6 py-3 hover:bg-gray-700 transition">
            Variants
          </Link>
        </nav>
      </aside>

      <div className="ml-64 p-8">
        <div className="max-w-6xl">
          <div className="mb-6">
            <Link
              href="/dashboard/products"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to Products
            </Link>
            <h1 className="text-4xl font-bold">Create New Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description for product listings"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Detailed product description (HTML supported)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Type
                      </label>
                      <input
                        type="text"
                        value={formData.productType}
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Clothing, Electronics"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                      </label>
                      <select
                        value={formData.brandId}
                        onChange={(e) => setFormData({ ...formData, brandId: e.target.value, brand: brands.find(b => b._id === e.target.value)?.name || '' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a brand</option>
                        {brands.map((brand) => (
                          <option key={brand._id} value={brand._id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">Or enter custom brand below</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Brand (if not in list)
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value, brandId: '' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter custom brand name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor
                    </label>
                    <input
                      type="text"
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Vendor/Supplier name"
                    />
                  </div>

                  {/* Uniform Fields Section */}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Uniform Product Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Size
                        </label>
                        <input
                          type="text"
                          value={formData.size}
                          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., S, M, L, XL"
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
                          placeholder="e.g., Navy Blue, White"
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
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="unisex">Unisex</option>
                          <option value="kids">Kids</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Material
                        </label>
                        <input
                          type="text"
                          value={formData.material}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Cotton, Polyester"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Style
                        </label>
                        <input
                          type="text"
                          value={formData.style}
                          onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Classic, Modern"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Uniform Type
                        </label>
                        <select
                          value={formData.uniformType}
                          onChange={(e) => setFormData({ ...formData, uniformType: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select type</option>
                          <option value="school">School</option>
                          <option value="sports">Sports</option>
                          <option value="formal">Formal</option>
                          <option value="casual">Casual</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School Name
                        </label>
                        <input
                          type="text"
                          value={formData.schoolName}
                          onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="School or organization name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grade/Class
                        </label>
                        <input
                          type="text"
                          value={formData.grade}
                          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Grade 1, Class A"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Comma-separated tags (e.g., summer, sale, new)"
                    />
                    <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catalog Visibility
                      </label>
                      <select
                        value={formData.catalogVisibility}
                        onChange={(e) => setFormData({ ...formData, catalogVisibility: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="visible">Visible</option>
                        <option value="catalog">Catalog only</option>
                        <option value="search">Search only</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured Product</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.reviewsAllowed}
                        onChange={(e) => setFormData({ ...formData, reviewsAllowed: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Allow Reviews</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Regular Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.regularPrice}
                        onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sale Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.salePrice}
                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Status
                      </label>
                      <select
                        value={formData.taxStatus}
                        onChange={(e) => setFormData({ ...formData, taxStatus: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="taxable">Taxable</option>
                        <option value="shipping">Shipping only</option>
                        <option value="none">None</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Class
                      </label>
                      <select
                        value={formData.taxClass}
                        onChange={(e) => setFormData({ ...formData, taxClass: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="standard">Standard</option>
                        <option value="reduced-rate">Reduced Rate</option>
                        <option value="zero-rate">Zero Rate</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU (Stock Keeping Unit)
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., SKU-12345"
                    />
                  </div>

                  <div>
                    <label className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={formData.manageStock}
                        onChange={(e) => setFormData({ ...formData, manageStock: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Manage Stock</span>
                    </label>
                  </div>

                  {formData.manageStock && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock Quantity
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.stockQuantity}
                            onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Low Stock Threshold
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.lowStockThreshold}
                            onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Status
                        </label>
                        <select
                          value={formData.stockStatus}
                          onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="instock">In Stock</option>
                          <option value="outofstock">Out of Stock</option>
                          <option value="onbackorder">On Backorder</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Backorders
                        </label>
                        <select
                          value={formData.backorders}
                          onChange={(e) => setFormData({ ...formData, backorders: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="no">Do not allow</option>
                          <option value="notify">Allow, but notify customer</option>
                          <option value="yes">Allow</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Shipping Tab */}
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={formData.requiresShipping}
                        onChange={(e) => setFormData({ ...formData, requiresShipping: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">This product requires shipping</span>
                    </label>
                  </div>

                  {formData.requiresShipping && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 mb-3">
                          Dimensions (cm)
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Length</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.length}
                              onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Width</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.width}
                              onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Height</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.height}
                              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shipping Class
                        </label>
                        <input
                          type="text"
                          value={formData.shippingClass}
                          onChange={(e) => setFormData({ ...formData, shippingClass: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Standard, Express"
                        />
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.shippingTaxable}
                            onChange={(e) => setFormData({ ...formData, shippingTaxable: e.target.checked })}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700">Shipping is taxable</span>
                        </label>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SEO optimized title"
                      maxLength={60}
                    />
                    <p className="mt-1 text-xs text-gray-500">{formData.seoTitle.length}/60 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description (Meta Description)
                    </label>
                    <textarea
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SEO meta description"
                      maxLength={160}
                    />
                    <p className="mt-1 text-xs text-gray-500">{formData.seoDescription.length}/160 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.seoSlug}
                      onChange={(e) => setFormData({ ...formData, seoSlug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="product-url-slug"
                    />
                    <p className="mt-1 text-xs text-gray-500">Leave empty to auto-generate from product name</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <input
                      type="text"
                      value={formData.seoKeywords}
                      onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="mt-1 text-xs text-gray-500">Comma-separated keywords</p>
                  </div>
                </div>
              )}

              {/* Images Tab */}
              {activeTab === 'images' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images
                    </label>
                    
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
                          <p className={`text-sm mt-2 ${uploadProgress.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
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

                    <div className="grid grid-cols-4 gap-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Note
                    </label>
                    <textarea
                      value={formData.purchaseNote}
                      onChange={(e) => setFormData({ ...formData, purchaseNote: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional note to customer after purchase"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Menu Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.menuOrder}
                      onChange={(e) => setFormData({ ...formData, menuOrder: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <p className="mt-1 text-xs text-gray-500">Custom ordering position (lower numbers appear first)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="border-t border-gray-200 p-6 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
              <Link
                href="/dashboard/products"
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
