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
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'inventory' | 'shipping' | 'attributes'>('basic')
  
  const [formData, setFormData] = useState({
    productId: '',
    sku: '',
    barcode: '',
    price: '',
    compareAtPrice: '',
    costPerItem: '',
    
    trackQuantity: true,
    quantity: '',
    allowBackorder: false,
    lowStockThreshold: '',
    
    weight: '',
    requiresShipping: true,
    
    size: '',
    color: '',
    material: '',
    style: '',
    gender: '',
    customAttributes: [] as { name: string; value: string }[],
    
    isActive: true,
    taxable: true,
  })

  useEffect(() => {
    if (id) {
      loadVariant()
      loadProducts()
    }
  }, [id])

  const loadVariant = async () => {
    try {
      const result = await adminApiClient.getVariant(id)
      if (result.data) {
        const found = result.data.variant
        setVariant(found)
        const attrs = found.attributes || {}
        
        // Extract custom attributes (non-standard ones)
        const standardAttrs = ['size', 'color', 'material', 'style', 'gender']
        const customAttrs = Object.keys(attrs)
          .filter(key => !standardAttrs.includes(key))
          .map(key => ({ name: key, value: attrs[key] }))
        
        setFormData({
          productId: found.productId?._id || found.productId || '',
          sku: found.sku || '',
          barcode: found.barcode || '',
          price: found.price?.toString() || '',
          compareAtPrice: found.compareAtPrice?.toString() || '',
          costPerItem: found.costPerItem?.toString() || '',
          
          trackQuantity: found.trackQuantity !== false,
          quantity: found.quantity?.toString() || '',
          allowBackorder: found.allowBackorder || false,
          lowStockThreshold: found.lowStockThreshold?.toString() || '',
          
          weight: found.weight?.toString() || '',
          requiresShipping: found.requiresShipping !== false,
          
          size: attrs.size || '',
          color: attrs.color || '',
          material: attrs.material || '',
          style: attrs.style || '',
          gender: attrs.gender || '',
          customAttributes: customAttrs,
          
          isActive: found.isActive !== false,
          taxable: found.taxable !== false,
        })
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

  const addCustomAttribute = () => {
    setFormData({
      ...formData,
      customAttributes: [...formData.customAttributes, { name: '', value: '' }]
    })
  }

  const removeCustomAttribute = (index: number) => {
    setFormData({
      ...formData,
      customAttributes: formData.customAttributes.filter((_, i) => i !== index)
    })
  }

  const updateCustomAttribute = (index: number, field: 'name' | 'value', value: string) => {
    const updated = [...formData.customAttributes]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, customAttributes: updated })
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
      if (formData.material) attributes.material = formData.material
      if (formData.style) attributes.style = formData.style
      if (formData.gender) attributes.gender = formData.gender
      
      formData.customAttributes.forEach(attr => {
        if (attr.name && attr.value) {
          attributes[attr.name] = attr.value
        }
      })

      const payload: any = {
        productId: formData.productId,
        sku: formData.sku,
        barcode: formData.barcode || undefined,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        costPerItem: formData.costPerItem ? parseFloat(formData.costPerItem) : undefined,
        
        trackQuantity: formData.trackQuantity,
        quantity: formData.trackQuantity && formData.quantity ? parseInt(formData.quantity) : undefined,
        allowBackorder: formData.allowBackorder,
        lowStockThreshold: formData.lowStockThreshold ? parseInt(formData.lowStockThreshold) : undefined,
        
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        requiresShipping: formData.requiresShipping,
        
        attributes,
        isActive: formData.isActive,
        taxable: formData.taxable,
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

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'attributes', label: 'Attributes' },
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
          <Link href="/dashboard/categories" className="block px-6 py-3 hover:bg-gray-700 transition">
            Categories
          </Link>
          <Link href="/dashboard/variants" className="block px-6 py-3 bg-gray-700">
            Variants
          </Link>
        </nav>
      </aside>

      <div className="ml-64 p-8">
        <div className="max-w-6xl">
          <div className="mb-6">
            <Link
              href="/dashboard/variants"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to Variants
            </Link>
            <h1 className="text-4xl font-bold">Edit Variant</h1>
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
              {/* Same tab content as new variant form */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Barcode
                      </label>
                      <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-6">
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
                        checked={formData.taxable}
                        onChange={(e) => setFormData({ ...formData, taxable: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Taxable</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
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
                        min="0"
                        value={formData.compareAtPrice}
                        onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cost Per Item
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.costPerItem}
                        onChange={(e) => setFormData({ ...formData, costPerItem: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={formData.trackQuantity}
                        onChange={(e) => setFormData({ ...formData, trackQuantity: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Track quantity</span>
                    </label>
                  </div>
                  {formData.trackQuantity && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.allowBackorder}
                            onChange={(e) => setFormData({ ...formData, allowBackorder: e.target.checked })}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700">Allow backorders</span>
                        </label>
                      </div>
                    </>
                  )}
                </div>
              )}

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
                      <span className="text-sm font-medium text-gray-700">This variant requires shipping</span>
                    </label>
                  </div>
                  {formData.requiresShipping && (
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
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'attributes' && (
                <div className="space-y-6">
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Material
                      </label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      />
                    </div>
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
                      <option value="kids">Kids</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Custom Attributes
                      </label>
                      <button
                        type="button"
                        onClick={addCustomAttribute}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        + Add Attribute
                      </button>
                    </div>
                    {formData.customAttributes.map((attr, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Attribute name"
                          value={attr.name}
                          onChange={(e) => updateCustomAttribute(index, 'name', e.target.value)}
                          className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Attribute value"
                          value={attr.value}
                          onChange={(e) => updateCustomAttribute(index, 'value', e.target.value)}
                          className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomAttribute(index)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
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
