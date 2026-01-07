'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminApiClient } from '@/lib/api'

interface Category {
  _id: string
  name: string
}

export default function NewCategoryPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'seo' | 'display'>('basic')
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
    description: '',
    shortDescription: '',
    
    // SEO
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    
    // Display
    image: '',
    displayOrder: '0',
    isActive: true,
    showInMenu: true,
    featured: false,
  })

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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name)
    })
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
        slug: formData.slug || generateSlug(formData.name),
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

      const result = await adminApiClient.createCategory(payload)
      if (result.error) {
        alert(result.error)
      } else {
        router.push('/dashboard/categories')
      }
    } catch (error) {
      console.error('Failed to create category:', error)
      alert('Failed to create category')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-4xl font-bold">Create New Category</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
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
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter category name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="category-url-slug"
                    />
                    <p className="mt-1 text-xs text-gray-500">Auto-generated from name if left empty. Use lowercase letters, numbers, and hyphens only.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Category
                    </label>
                    <select
                      value={formData.parentId}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">None (Top Level)</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Select a parent category to create a subcategory</p>
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
                      placeholder="Brief description for category listings"
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
                      placeholder="Detailed category description (HTML supported)"
                    />
                  </div>
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

              {/* Display Tab */}
              {activeTab === 'display' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image && (
                      <div className="mt-4">
                        <img
                          src={formData.image}
                          alt="Category preview"
                          className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <p className="mt-1 text-xs text-gray-500">Lower numbers appear first in category listings</p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.showInMenu}
                        onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Show in navigation menu</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured Category</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-6 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Category'}
              </button>
              <Link
                href="/dashboard/categories"
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
