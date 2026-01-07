'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminApiClient } from '@/lib/api'

interface InventoryItem {
  _id: string
  variantId: {
    _id: string
    sku: string
    productId: {
      _id: string
      name: string
    }
    price: number
    attributes: any
  }
  quantity: number
  reservedQuantity: number
  lowStockThreshold: number
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    quantity: 0,
    reservedQuantity: 0,
    lowStockThreshold: 10,
  })

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      setLoading(true)
      const result = await adminApiClient.getInventory()
      if (result.data) {
        setInventory(result.data.inventory || [])
      }
    } catch (error) {
      console.error('Failed to load inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item._id)
    setEditForm({
      quantity: item.quantity,
      reservedQuantity: item.reservedQuantity || 0,
      lowStockThreshold: item.lowStockThreshold || 10,
    })
  }

  const handleSave = async (variantId: string) => {
    try {
      const result = await adminApiClient.updateInventory({
        variantId,
        ...editForm,
      })
      if (result.error) {
        alert(result.error)
      } else {
        setEditingId(null)
        loadInventory()
      }
    } catch (error) {
      console.error('Failed to update inventory:', error)
      alert('Failed to update inventory')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (quantity <= threshold) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' }
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
          <Link href="/dashboard/inventory" className="block px-6 py-3 bg-gray-700">
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
        <div className="max-w-7xl">
          <h1 className="text-4xl font-bold mb-6">Inventory</h1>

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
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reserved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Low Stock Threshold
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
                  {inventory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                        No inventory items found
                      </td>
                    </tr>
                  ) : (
                    inventory.map((item) => {
                      const available = item.quantity - (item.reservedQuantity || 0)
                      const status = getStockStatus(item.quantity, item.lowStockThreshold)
                      const isEditing = editingId === item._id

                      return (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.variantId?.productId?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.variantId?.sku || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editForm.quantity}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 0 })
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded"
                                min="0"
                              />
                            ) : (
                              item.quantity
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editForm.reservedQuantity}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    reservedQuantity: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded"
                                min="0"
                              />
                            ) : (
                              item.reservedQuantity || 0
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {available}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editForm.lowStockThreshold}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    lowStockThreshold: parseInt(e.target.value) || 10,
                                  })
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded"
                                min="0"
                              />
                            ) : (
                              item.lowStockThreshold || 10
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}
                            >
                              {status.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {isEditing ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSave(item.variantId._id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

