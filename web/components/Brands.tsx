'use client'

import React from 'react'

const brands = [
    { name: 'Parker', logo: 'https://via.placeholder.com/150x50?text=Parker' },
    { name: 'Moleskine', logo: 'https://via.placeholder.com/150x50?text=Moleskine' },
    { name: 'Pilot', logo: 'https://via.placeholder.com/150x50?text=Pilot' },
    { name: 'Fabriano', logo: 'https://via.placeholder.com/150x50?text=Fabriano' },
    { name: 'Lamy', logo: 'https://via.placeholder.com/150x50?text=Lamy' },
    { name: 'Faber-Castell', logo: 'https://via.placeholder.com/150x50?text=Faber-Castell' },
    { name: 'Staedtler', logo: 'https://via.placeholder.com/150x50?text=Staedtler' },
    { name: 'Moleskine', logo: 'https://via.placeholder.com/150x50?text=Moleskine' },
]

export default function Brands() {
    return (
        <section className="py-12 bg-gray-50 border-y border-gray-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                <h3 className="text-xl font-semibold text-gray-500 uppercase tracking-widest">
                    Trusted by Global Brands
                </h3>
            </div>

            <div className="relative w-full">
                {/* Gradients to fade edges */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

                <div className="flex overflow-hidden group">
                    <div className="flex gap-16 animate-infinite-scroll group-hover:paused w-max px-8">
                        {/* Duplicated for infinite scroll */}
                        {[...brands, ...brands].map((brand, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                            >
                                {/* Using text for demo if images irrelevant, but using placeholder images */}
                                <div className="text-2xl font-bold font-serif italic text-gray-700">{brand.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: scroll 40s linear infinite;
        }
        .group-hover\\:paused:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    )
}
