// Wishlist utility functions using localStorage

export interface WishlistItem {
  id: string
  name: string
  price: string
  image: string
  productId: string
}

export const getWishlist = (): WishlistItem[] => {
  if (typeof window === 'undefined') return []
  const wishlist = localStorage.getItem('wishlist')
  return wishlist ? JSON.parse(wishlist) : []
}

export const addToWishlist = (item: WishlistItem): boolean => {
  if (typeof window === 'undefined') return false
  const wishlist = getWishlist()
  
  // Check if item already exists
  if (wishlist.some((w: WishlistItem) => w.id === item.id)) {
    return false // Item already in wishlist
  }
  
  wishlist.push(item)
  localStorage.setItem('wishlist', JSON.stringify(wishlist))
  window.dispatchEvent(new Event('wishlistUpdated'))
  return true
}

export const removeFromWishlist = (id: string): boolean => {
  if (typeof window === 'undefined') return false
  const wishlist = getWishlist()
  const filtered = wishlist.filter((item: WishlistItem) => item.id !== id)
  localStorage.setItem('wishlist', JSON.stringify(filtered))
  window.dispatchEvent(new Event('wishlistUpdated'))
  return true
}

export const isInWishlist = (id: string): boolean => {
  if (typeof window === 'undefined') return false
  const wishlist = getWishlist()
  return wishlist.some((item: WishlistItem) => item.id === id)
}

export const getWishlistCount = (): number => {
  return getWishlist().length
}

