'use client'

import { useState } from 'react'
import Banner from '@/components/Banner'
import Sidebar from '@/components/Sidebar'
import ProductCard from '@/components/ProductCard'
import Newsletter from '@/components/Newsletter'

// Mock data - replace with actual API calls
const categories = [
  { id: 'all', name: 'All Products' },
  { id: '3d-magnets', name: '3D Magnets' },
  { id: 'other', name: 'Other' },
  { id: 'postcards', name: 'Postcards' },
  { id: 'prints', name: 'Prints' },
  { id: 'sale', name: 'Sale' },
  { id: 'stationery', name: 'Stationery' },
]

const filterOptions = [
  { id: '3d-magnets', name: '3D Magnets' },
  { id: 'other', name: 'Other' },
  { id: 'postcards', name: 'Postcards' },
  { id: 'prints', name: 'Prints' },
  { id: 'stationery', name: 'Stationery' },
]

const products = [
  {
    id: '1',
    name: 'Design magnet set (3D printed) – RANDOMIZED',
    price: 'From €16.50',
    image: '',
    labels: [],
    buttonText: 'add to cart',
  },
  {
    id: '2',
    name: 'Modern Wooden Christmas Tree Ornaments – Lasercut Design',
    price: '€16.00',
    image: '',
    labels: ['Limited Edition'],
    buttonText: 'add to cart',
  },
  {
    id: '3',
    name: 'Christmas Postcards – XMAS Holiday Cards',
    price: '€9.00',
    image: '',
    labels: ['NEW!'],
    buttonText: 'add to cart',
  },
  {
    id: '4',
    name: 'Empowerment Postcard – Equality & WomansDay',
    price: '€3.50',
    image: '',
    labels: [],
    buttonText: 'add to cart',
  },
  {
    id: '5',
    name: 'Poster design COWBOY SHRIMP',
    price: 'From €22.00',
    image: '',
    labels: ['NEW!'],
    buttonText: 'add to cart',
  },
  {
    id: '6',
    name: 'Printed wall art – Graffiti design LIFE IS LOL',
    price: 'From €22.00',
    image: '',
    labels: ['more colors available'],
    buttonText: 'add to cart',
  },
  {
    id: '7',
    name: 'Celebration Postcards – Happy Birthday & Positive Messages',
    price: '€9.00',
    image: '',
    labels: [],
    buttonText: 'add to cart',
  },
  {
    id: '8',
    name: 'Design magnet set (3D printed) – HAPPY',
    price: 'From €16.50',
    image: '',
    labels: [],
    buttonText: 'preorder',
  },
  {
    id: '9',
    name: 'Printed artwork – Poster design OK LETS GO',
    price: 'From €22.00',
    image: '',
    labels: [],
    buttonText: 'add to cart',
  },
  {
    id: '10',
    name: 'Empowerment Postcard Set – Bold & Feminist Art Cards',
    price: '€9.00',
    image: '',
    labels: ['NEW!'],
    buttonText: 'add to cart',
  },
  {
    id: '11',
    name: 'Trendy Cowboy Shrimp Postcard Set – Positive Vibes Illustrations',
    price: '€9.00',
    image: '',
    labels: ['NEW!'],
    buttonText: 'add to cart',
  },
  {
    id: '12',
    name: 'Notepad DIN A6 – Wavy design',
    price: '€10.00',
    image: '',
    labels: [],
    buttonText: 'add to cart',
  },
  {
    id: '13',
    name: 'Artsy Illustration Postcard Set – Rabbit, Hi & Waffle',
    price: '€9.00',
    image: '',
    labels: [],
    buttonText: 'add to cart',
  },
  {
    id: '14',
    name: 'Printed wall art – poster design RABBIT',
    price: 'From €22.00',
    image: '',
    labels: [],
    buttonText: 'add to cart',
  },
  {
    id: '15',
    name: 'Magnet Design (3D printed) – transparent',
    price: '€6.50',
    image: '',
    labels: ['Choose your shape!'],
    buttonText: 'add to cart',
  },
  {
    id: '16',
    name: 'Ocean Life Art Print – Seashells, Surf & Summer Vibes',
    price: 'From €11.00',
    image: '',
    labels: ['Sale'],
    buttonText: 'add to cart',
  },
  {
    id: '17',
    name: 'Lovely postcard design – STAY WITH ME',
    price: '€3.50',
    image: '',
    labels: [],
    buttonText: 'add to cart',
  },
  {
    id: '18',
    name: 'Sticker Pack – 5+1 unique and creative Designs',
    price: '€5.00',
    image: '',
    labels: ['out of stock'],
    buttonText: 'not available',
    isOutOfStock: true,
  },
  {
    id: '19',
    name: 'Illustrated Postcards – Playful Monsters & Abstract Designs',
    price: '€9.00',
    image: '',
    labels: [],
    buttonText: 'add to cart',
  },
  {
    id: '20',
    name: 'Glow in the Dark – Magnet Set (3D printed)',
    price: 'From €16.50',
    image: '',
    labels: ['Glow in the dark'],
    buttonText: 'add to cart',
  },
  {
    id: '21',
    name: 'Printed wall art – Poster design GO INTERNATIONAL',
    price: 'From €11.00',
    image: '',
    labels: [],
    buttonText: 'add to cart',
  },
  {
    id: '22',
    name: 'Design magnet set (3D printed) – HEARTS',
    price: 'From €16.50',
    image: '',
    labels: [],
    buttonText: 'add to cart',
  },
  {
    id: '23',
    name: 'Mystery Bundle – selected art items',
    price: '€50.00',
    image: '',
    labels: ['NEW!'],
    buttonText: 'add to cart',
  },
  {
    id: '24',
    name: 'Magnet Design (3D printed) – pink',
    price: '€6.50',
    image: '',
    labels: ['Choose your shape!'],
    buttonText: 'add to cart',
  },
]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('default')
  const productsPerPage = 12

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'all') return true
    // Add category filtering logic here
    return true
  })

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  )

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Banner
            title="All Products"
            description="WELCOME. Abstract design-essentials that will make a statement in your place. Shop prints, postcards, 3D printed magnets, stationery, stickers and more..."
          />

          <div className="flex flex-col md:flex-row gap-8 pb-16">
            {/* Sidebar */}
            <Sidebar
              categories={categories}
              filterOptions={filterOptions}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              productCount={filteredProducts.length}
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort Bar with Product Count */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-gray-700">{filteredProducts.length} products</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue"
                >
                  <option value="default">Sort by</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>

              {/* Product Grid - 3 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 text-sm ${
                        currentPage === page
                          ? 'text-gray-900 font-semibold'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Newsletter />
    </div>
  )
}

