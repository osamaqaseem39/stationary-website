import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">GBS Admin</h1>
        </div>
        <nav className="mt-8">
          <Link
            href="/dashboard"
            className="block px-6 py-3 hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/products"
            className="block px-6 py-3 hover:bg-gray-700 transition"
          >
            Products
          </Link>
          <Link
            href="/dashboard/orders"
            className="block px-6 py-3 hover:bg-gray-700 transition"
          >
            Orders
          </Link>
          <Link
            href="/dashboard/inventory"
            className="block px-6 py-3 hover:bg-gray-700 transition"
          >
            Inventory
          </Link>
          <Link
            href="/dashboard/users"
            className="block px-6 py-3 hover:bg-gray-700 transition"
          >
            Users
          </Link>
          <Link
            href="/dashboard/categories"
            className="block px-6 py-3 hover:bg-gray-700 transition"
          >
            Categories
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 mb-2">Total Products</h3>
              <p className="text-3xl font-bold">-</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 mb-2">Total Orders</h3>
              <p className="text-3xl font-bold">-</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-600 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold">-</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex gap-4">
              <Link
                href="/dashboard/products/new"
                className="bg-blue text-white px-6 py-2 rounded hover:bg-blue-dark transition"
              >
                Add Product
              </Link>
              <Link
                href="/dashboard/categories/new"
                className="bg-pink text-white px-6 py-2 rounded hover:bg-pink-dark transition"
              >
                Add Category
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

