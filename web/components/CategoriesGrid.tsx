'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '../lib/api'
import Skeleton from './ui/Skeleton'



export default function CategoriesGrid() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.getCategories()
                if (response.data && response.data.categories) {
                    setCategories(response.data.categories)
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return (
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 animate-fadeInDown">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Shop by <span className="text-primary">Category</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find exactly what you are looking for
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                                <Skeleton className="w-full h-full rounded-2xl" />
                            </div>
                        ))
                    ) : (
                        categories.map((cat, index) => (
                            <Link
                                key={cat._id || index}
                                href={`/shop?category=${cat.slug || cat.name?.toLowerCase().replace(/ /g, '-')}`}
                                className="group"
                            >
                                <div
                                    className={`relative overflow-hidden rounded-2xl aspect-square flex flex-col items-center justify-center ${cat.color || 'bg-gray-50'} transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl cursor-pointer p-4`}
                                >
                                    <div className="mb-3 transform group-hover:scale-110 transition-transform duration-500 flex items-center justify-center w-24 h-24">
                                        {cat.image ? (
                                            <img
                                                src={cat.image}
                                                alt={cat.name}
                                                className="w-full h-full object-contain drop-shadow-md"
                                            />
                                        ) : (
                                            <span className="text-5xl">{cat.icon || '📦'}</span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg md:text-xl group-hover:text-primary transition-colors text-center z-10">
                                        {cat.name}
                                    </h3>

                                    {/* Decorative circle */}
                                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}
