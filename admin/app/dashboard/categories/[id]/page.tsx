'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { adminApiClient } from '@/lib/api'
import { Button, Input, Textarea, Card } from '@/components/ui'
import { uploadImage } from '@/lib/upload'

interface Category {
  _id: string
  name: string
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'seo' | 'display'>('basic')
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
    description: '',
    shortDescription: '',
    
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    
    image: '',
    displayOrder: '0',
    isActive: true,
    showInMenu: true,
    featured: false,
  })

  useEffect(() => {
    if (id) {
      loadCategory()
      loadCategories()
    }
  }, [id])

  const loadCategory = async () => {
    try {
      const result = await adminApiClient.getCategory(id)
      if (result.data) {
        const cat = result.data.category
        setCategory(cat)
        setFormData({
          name: cat.name || '',
          slug: cat.slug || '',
          parentId: cat.parentId?._id || cat.parentId || '',
          description: cat.description || '',
          shortDescription: cat.shortDescription || '',
          
          seoTitle: cat.seoTitle || '',
          seoDescription: cat.seoDescription || '',
          seoKeywords: cat.seoKeywords || '',
          
          image: cat.image || '',
          displayOrder: cat.displayOrder?.toString() || '0',
          isActive: cat.isActive !== false,
          showInMenu: cat.showInMenu !== false,
          featured: cat.featured || false,
        })
      }
    } catch (error) {
      console.error('Failed to load category:', error)
    }
  }

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress('Uploading image...')

    try {
      const result = await uploadImage(files[0])
      if (result.success && result.url) {
        setFormData({ ...formData, image: result.url })
        // Clear progress immediately on success - image preview will show
        setUploadProgress('')
      } else {
        setUploadProgress(result.error || 'Upload failed')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadProgress('Upload failed')
    } finally {
      setUploading(false)
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
    if (!formData.name) {
      alert('Name is required')
      return
    }

    try {
      setLoading(true)
      const payload: any = {
        name: formData.name,
        slug: formData.slug,
        parentId: formData.parentId || undefined,
        description: formData.description,
        shortDescription: formData.shortDescription,
        
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
        
        image: formData.image || undefined,
        displayOrder: parseInt(formData.displayOrder),
        isActive: formData.isActive,
        showInMenu: formData.showInMenu,
        featured: formData.featured,
      }

      const result = await adminApiClient.updateCategory(id, payload)
      if (result.error) {
        alert(result.error)
      } else {
        router.push('/dashboard/categories')
      }
    } catch (error) {
      console.error('Failed to update category:', error)
      alert('Failed to update category')
    } finally {
      setLoading(false)
    }
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="ml-64 p-8">
          <div className="max-w-3xl">Loading...</div>
        </div>
      </main>
    )
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'seo', label: 'SEO' },
    { id: 'display', label: 'Display' },
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
          <Link href="/dashboard/categories" className="block px-6 py-3 bg-gray-700">
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
              href="/dashboard/categories"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to Categories
            </Link>
            <h1 className="text-4xl font-bold">Edit Category</h1>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <div className="border-b border-gray-200 mb-6">
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

              <div>
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    <Input
                      label="Category Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <Input
                      label="Slug (URL)"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      helperText="URL-friendly version of the name"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Category
                      </label>
                      <select
                        value={formData.parentId}
                        onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">None (Top Level)</option>
                        {categories.filter(cat => cat._id !== id).map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Textarea
                      label="Short Description"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      rows={2}
                    />

                    <Textarea
                      label="Full Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                    />
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <Input
                      label="SEO Title"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      maxLength={60}
                      helperText={`${formData.seoTitle.length}/60 characters`}
                    />

                    <Textarea
                      label="SEO Description"
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      rows={3}
                      maxLength={160}
                      helperText={`${formData.seoDescription.length}/160 characters`}
                    />

                    <Input
                      label="SEO Keywords"
                      value={formData.seoKeywords}
                      onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                      placeholder="Comma-separated keywords"
                      helperText="Separate keywords with commas"
                    />
                  </div>
                )}

                {activeTab === 'display' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Image
                      </label>
                      
                      {/* File Upload Section */}
                      <div className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
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
                            {uploading ? 'Uploading...' : 'Upload Image'}
                          </button>
                          <p className="text-sm text-gray-500">
                            Select an image (JPEG, PNG, GIF, WebP, SVG)
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
                        <Input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          helperText="Enter a valid image URL"
                        />
                      </div>

                      {formData.image && (
                        <div className="mt-4">
                          <img
                            src={formData.image}
                            alt="Category preview"
                            className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <Input
                      label="Display Order"
                      type="number"
                      min="0"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                      helperText="Lower numbers appear first"
                    />

                    <div className="space-y-4">
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          Active
                        </span>
                      </label>

                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.showInMenu}
                          onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          Show in navigation menu
                        </span>
                      </label>

                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          Featured Category
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6 flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  isLoading={loading}
                >
                  Update Category
                </Button>
                <Link
                  href="/dashboard/categories"
                  className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 px-6 py-2.5 text-sm"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </main>
  )
}
