 'use client'
 
 import { useEffect, useMemo, useState } from 'react'
 import { useSearchParams } from 'next/navigation'
 import ProductCard from '@/components/ProductCard'
 import Newsletter from '@/components/Newsletter'
 import { apiClient } from '@/lib/api'
 import { CURRENCY_PREFIX } from '@/lib/currency'
 
 interface Product {
   _id: string
   name: string
   shortDescription?: string
   description?: string
   brand?: string
   brandId?: {
     _id: string
     name: string
     slug?: string
   }
   categoryId?: {
     _id: string
     name: string
     slug?: string
   }
   images?: string[]
   regularPrice?: number
   salePrice?: number
   stockStatus?: string
   isActive?: boolean
   status?: string
   variants?: Array<{
     _id: string
     price: number
     quantity?: number
     images?: string[]
   }>
 }
 
 export default function ProductsSearchPage() {
   const searchParams = useSearchParams()
   const search = searchParams?.get('search') || ''
   const categoryId = searchParams?.get('categoryId') || ''
 
   const [products, setProducts] = useState<Product[]>([])
   const [loading, setLoading] = useState(true)
 
   useEffect(() => {
     const loadProducts = async () => {
       setLoading(true)
       try {
         const result = await apiClient.getProducts({
           search: search || undefined,
           categoryId: categoryId || undefined,
           limit: 60,
         })
 
         if (result.data?.products) {
           setProducts(result.data.products.filter((p: Product) => p.isActive !== false))
         } else {
           setProducts([])
         }
       } catch (error) {
         console.error('Failed to load products:', error)
         setProducts([])
       } finally {
         setLoading(false)
       }
     }
 
     loadProducts()
   }, [search, categoryId])
 
   const title = useMemo(() => {
     if (search) {
       return `Search results for "${search}"`
     }
     return 'Products'
   }, [search])
 
   return (
     <div className="min-h-screen flex flex-col bg-white">
       <main className="flex-grow">
         <div className="w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
           <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
             <div>
               <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                 {title}
               </h1>
               <p className="text-sm text-gray-500 font-medium mt-1">
                 {loading
                   ? 'Finding the best matches for you...'
                   : products.length > 0
                   ? `Showing ${products.length} result${products.length === 1 ? '' : 's'}`
                   : 'No products match your search.'}
               </p>
             </div>
           </div>
 
           {loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
               {[...Array(10)].map((_, i) => (
                 <div key={i} className="aspect-[9/16] bg-gray-50 animate-pulse rounded-2xl" />
               ))}
             </div>
           ) : products.length === 0 ? (
             <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
               <div className="mb-4 text-4xl">🔍</div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
               <p className="text-gray-500">
                 {search
                   ? `We couldn't find any products matching "${search}". Try a different keyword or check the spelling.`
                   : 'Try adjusting your filters or search terms.'}
               </p>
             </div>
           ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
               {products.map((product) => {
                 let displayPrice = 'Price on request'
 
                 if (product.salePrice && product.salePrice > 0) {
                   displayPrice = `${CURRENCY_PREFIX}${product.salePrice}`
                 } else if (product.regularPrice && product.regularPrice > 0) {
                   displayPrice = `${CURRENCY_PREFIX}${product.regularPrice}`
                 } else if (product.variants && product.variants.length > 0) {
                   const min = Math.min(...product.variants.map((v) => v.price))
                   displayPrice = `From ${CURRENCY_PREFIX}${min}`
                 }
 
                 const image =
                   product.images?.[0] ||
                   (product.variants && product.variants[0]?.images?.[0]) ||
                   '/images/placeholder.jpg'
 
                 const isOutOfStock =
                   product.stockStatus === 'outofstock' ||
                   (product.variants &&
                     product.variants.length > 0 &&
                     product.variants.every((v) => (v.quantity || 0) <= 0))
 
                 return (
                   <ProductCard
                     key={product._id}
                     id={product._id}
                     productId={product._id}
                     name={product.name}
                     price={displayPrice}
                     image={image}
                     labels={product.categoryId ? [product.categoryId.name] : []}
                     isOutOfStock={isOutOfStock}
                     brand={product.brand || product.brandId?.name}
                   />
                 )
               })}
             </div>
           )}
         </div>
       </main>
       <Newsletter />
     </div>
   )
 }
 
