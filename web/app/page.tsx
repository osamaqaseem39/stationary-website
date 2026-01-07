import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-pink">
              GBS Store
            </Link>
            <nav className="flex gap-6">
              <Link href="/products" className="text-gray-700 hover:text-pink">
                Products
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-pink">
                Cart
              </Link>
              <Link href="/account" className="text-gray-700 hover:text-pink">
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink to-blue py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to GBS Store
          </h1>
          <p className="text-xl text-white mb-8">
            Your one-stop shop for Stationery, Gifts & Uniforms
          </p>
          <Link
            href="/products"
            className="bg-white text-pink px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/products?category=stationery" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Stationery</h3>
              <p className="text-gray-600">Pens, notebooks, and more</p>
            </Link>
            <Link href="/products?category=gifts" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">Gifts</h3>
              <p className="text-gray-600">Perfect gifts for every occasion</p>
            </Link>
            <Link href="/products?category=uniforms" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">👔</div>
              <h3 className="text-xl font-semibold mb-2">Uniforms</h3>
              <p className="text-gray-600">School and work uniforms</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
