export interface Product {
  id: string
  name: string
  slug: string
  category: string
  price: number
  originalPrice?: number
  images: string[]
  description: string
  shortDescription: string
  inStock: boolean
  isFeatured: boolean
  isNew: boolean
  tags: string[]
  createdAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
}

export interface OrderCustomer {
  name: string
  phone: string
  email: string
  address: string
  city: string
  county?: string
  message?: string
}

export interface Order {
  id: string
  customer: OrderCustomer
  items: OrderItem[]
  subtotal: number
  discountCode?: string
  discountAmount: number
  deliveryFee: number
  total: number
  deliveryDate: string
  deliveryTimeSlot: string
  giftMessage?: string
  paymentMethod: 'ramburs' | 'transfer'
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'cancelled'
  createdAt: string
}

export interface Discount {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderValue: number
  maxUses: number | null
  usedCount: number
  expiresAt: string | null
  isActive: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
}
