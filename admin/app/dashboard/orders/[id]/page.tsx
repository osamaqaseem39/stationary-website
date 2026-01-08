'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { adminApiClient } from '@/lib/api'

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadOrder()
    }
  }, [id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const result = await adminApiClient.getOrder(id)
      if (result.data) {
        setOrder(result.data.order)
      }
    } catch (error) {
      console.error('Failed to load order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const result = await adminApiClient.updateOrderStatus(id, newStatus)
      if (result.error) {
        alert(result.error)
      } else {
        loadOrder()
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      alert('Failed to update order status')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="ml-64 p-8">
          <div className="max-w-4xl">Loading...</div>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-100">
        <div className="ml-64 p-8">
          <div className="max-w-4xl">Order not found</div>
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
          <Link href="/dashboard/orders" className="block px-6 py-3 bg-gray-700">
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
        <div className="max-w-4xl">
          <div className="mb-6">
            <Link
              href="/dashboard/orders"
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to Orders
            </Link>
            <h1 className="text-4xl font-bold">Order Details</h1>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
                <p className="text-lg font-semibold">{order.orderNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span
                  className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                <p className="text-lg">{order.userId?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{order.userId?.email || ''}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="text-lg">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Update Status</h3>
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.productName || 'Product'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">PKR {item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      PKR {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">PKR {order.subtotal.toFixed(2)}</span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">PKR {order.shippingCost.toFixed(2)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">PKR {order.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>PKR {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

