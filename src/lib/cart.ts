import { ref, computed } from 'vue'
import { CartItem, Product } from './types'
import { saveToLocalStorage, getFromLocalStorage } from './utils'

const cartItems = ref<CartItem[]>([])

const loadCart = () => {
  const saved = getFromLocalStorage<CartItem[]>('cart')
  if (saved) {
    cartItems.value = saved
  }
}

const saveCart = () => {
  saveToLocalStorage('cart', cartItems.value)
}

export const useCart = () => {
  const addToCart = (product: Product) => {
    const existingItem = cartItems.value.find(item => item.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++
      } else {
        alert('Stock tidak cukup!')
        return false
      }
    } else {
      if (product.stock > 0) {
        cartItems.value.push({ ...product, quantity: 1 })
      } else {
        alert('Product out of stock!')
        return false
      }
    }
    
    saveCart()
    return true
  }

  const increaseQuantity = (id: string, maxStock: number) => {
    const item = cartItems.value.find(item => item.id === id)
    
    if (item && item.quantity < maxStock) {
      item.quantity++
      saveCart()
      return true
    } else {
      alert('Stock tidak cukup!')
      return false
    }
  }

  const decreaseQuantity = (id: string) => {
    const item = cartItems.value.find(item => item.id === id)
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        removeFromCart(id)
      }
      saveCart()
    }
  }

  const removeFromCart = (id: string) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id)
    saveCart()
  }

  const clearCart = () => {
    cartItems.value = []
    saveCart()
  }

  const cartCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    loadCart
  }
}
