'use client'

interface ProductCardProps {
  id: string
  name: string
  price: string
  image: string
  labels?: string[]
  buttonText?: string
  isOutOfStock?: boolean
}

export default function ProductCard({
  name,
  price,
  image,
  labels = [],
  buttonText = 'add to cart',
  isOutOfStock = false,
}: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <div
          className="w-full h-full bg-gradient-to-br from-blue-light via-pink-light to-blue"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!image && (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Labels */}
        {labels.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-2">
            {labels.map((label, index) => {
              const labelLower = label.toLowerCase()
              let labelClass = 'bg-blue text-white'
              
              if (labelLower === 'limited edition') {
                labelClass = 'bg-red-500 text-white'
              } else if (labelLower === 'new!') {
                labelClass = 'bg-blue text-white'
              } else if (labelLower === 'sale') {
                labelClass = 'bg-red-500 text-white'
              } else if (labelLower === 'out of stock') {
                labelClass = 'bg-gray-500 text-white'
              } else {
                labelClass = 'bg-blue text-white'
              }
              
              return (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs font-semibold rounded ${labelClass}`}
                >
                  {label}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>
        <p className="text-base font-semibold text-gray-900 mb-3">{price}</p>
        <button
          disabled={isOutOfStock}
          className={`w-full py-2 px-4 rounded text-sm font-normal transition-colors ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {isOutOfStock ? 'not available' : buttonText}
        </button>
      </div>
    </div>
  )
}

