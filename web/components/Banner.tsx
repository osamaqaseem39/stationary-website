interface BannerProps {
  title: string
  description?: string
}

export default function Banner({ title, description }: BannerProps) {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 mb-8 overflow-hidden">
      {/* Background with abstract design */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-light via-blue to-blue-dark">
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="border border-blue-dark/30"
              />
            ))}
          </div>
        </div>
        {/* Wavy shapes overlay */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <path
              d="M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z"
              fill="rgba(70, 130, 180, 0.3)"
            />
            <path
              d="M0,250 Q400,150 800,250 T1200,250 L1200,400 L0,400 Z"
              fill="rgba(135, 206, 235, 0.2)"
            />
          </svg>
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 md:p-12 max-w-4xl mx-4 shadow-lg">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

