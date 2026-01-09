interface BannerProps {
  title: string
  description?: string
}

export default function Banner({ title, description }: BannerProps) {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 mb-12 overflow-hidden rounded-3xl animate-fadeInUp">
      {/* Animated background with abstract blue grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-light via-blue-100 to-pink-100">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-30 stationery-pattern">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div
                key={i}
                className="border border-blue-dark/20 animate-pulse"
                style={{ animationDelay: `${i * 10}ms` }}
              />
            ))}
          </div>
        </div>
        
        {/* Animated abstract shapes overlay */}
        <div className="absolute inset-0">
          <svg className="w-full h-full animate-float" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <path
              d="M0,200 Q300,100 600,200 T1200,200 L1200,400 L0,400 Z"
              fill="rgba(70, 130, 180, 0.2)"
              className="animate-float"
            />
            <path
              d="M0,250 Q400,150 800,250 T1200,250 L1200,400 L0,400 Z"
              fill="rgba(135, 206, 235, 0.15)"
              className="animate-float"
              style={{ animationDelay: '1s' }}
            />
            <path
              d="M0,180 Q500,80 1000,180 T1200,180 L1200,400 L0,400 Z"
              fill="rgba(255, 105, 180, 0.1)"
              className="animate-float"
              style={{ animationDelay: '2s' }}
            />
          </svg>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-300/20 rounded-full blur-2xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Content overlay - white rounded box positioned to the left with animation */}
      <div className="relative z-10 h-full flex items-center animate-fadeInLeft">
        <div className="ml-4 md:ml-8 lg:ml-16 bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 lg:p-10 max-w-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/50 card-hover animate-scaleIn">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-4 animate-fadeInDown">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed animate-fadeInUp animation-delay-200">
              {description}
            </p>
          )}
          
          {/* Decorative accent line */}
          <div className="mt-6 w-20 h-1 bg-gradient-to-r from-pink to-blue rounded-full animate-scaleIn animation-delay-400"></div>
        </div>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-2000"></div>
      </div>
    </div>
  )
}

