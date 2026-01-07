interface BannerProps {
  title: string
  description?: string
}

export default function Banner({ title, description }: BannerProps) {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 mb-12 overflow-hidden">
      {/* Background with abstract blue grid pattern */}
      <div className="absolute inset-0 bg-blue-light">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="border border-blue-dark/20"
              />
            ))}
          </div>
        </div>
        {/* Abstract shapes overlay */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <path
              d="M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z"
              fill="rgba(70, 130, 180, 0.15)"
            />
            <path
              d="M0,250 Q400,150 800,250 T1200,250 L1200,400 L0,400 Z"
              fill="rgba(135, 206, 235, 0.1)"
            />
          </svg>
        </div>
      </div>

      {/* Content overlay - white rounded box positioned to the left */}
      <div className="relative z-10 h-full flex items-center">
        <div className="ml-4 md:ml-8 lg:ml-12 bg-white rounded-2xl p-6 md:p-8 lg:p-10 max-w-2xl shadow-lg">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

