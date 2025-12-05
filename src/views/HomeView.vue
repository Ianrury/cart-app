<template>
  <div class="home-view">
    <header class="header">
      <div class="container">
        <div class="logo">
          <span class="logo-icon">🏪</span>
          <span class="logo-text">TechStore</span>
        </div>
        <nav>
          <router-link to="/" class="nav-btn">🏠 Home</router-link>
          <router-link to="/admin" class="nav-btn">⚙️ Admin</router-link>
          <button @click="cartOpen = true" class="cart-btn">
            🛒 Cart
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </button>
        </nav>
      </div>
    </header>

    <main class="container main-content">
      <div class="hero">
        <h1 class="hero-title">Discover Amazing Products</h1>
        <p class="hero-subtitle">Premium quality tech products at the best prices</p>
      </div>

      <div class="products-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </main>

    <CartSidebar
      :items="cart.cartItems.value"
      :is-open="cartOpen"
      @close="cartOpen = false"
      @increase="handleIncrease"
      @decrease="cart.decreaseQuantity"
      @remove="cart.removeFromCart"
      @checkout="handleCheckout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Product } from '@/lib/types'
import { getFromLocalStorage } from '@/lib/utils'
import { useCart } from '@/lib/cart'
import ProductCard from '@/components/ProductCard.vue'
import CartSidebar from '@/components/CartSidebar.vue'

const products = ref<Product[]>([])
const cartOpen = ref(false)
const cart = useCart()

const cartCount = computed(() => cart.cartCount.value)

const loadProducts = () => {
  const saved = getFromLocalStorage<Product[]>('products')
  if (saved && saved.length > 0) {
    products.value = saved
  }
}

const handleAddToCart = (product: Product) => {
  const success = cart.addToCart(product)
  if (success) {
    cartOpen.value = true
  }
}

const handleIncrease = (id: string) => {
  const product = products.value.find(p => p.id === id)
  if (product) {
    cart.increaseQuantity(id, product.stock)
  }
}

const handleCheckout = () => {
  alert('Thank you for your order! 🎉')
  cart.clearCart()
  cartOpen.value = false
}

onMounted(() => {
  cart.loadCart()
  loadProducts()
})
</script>

<style scoped>
.nav-btn {
  padding: 10px 20px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  text-decoration: none;
  display: inline-block;
}

.nav-btn:hover,
.nav-btn.router-link-active {
  background: #f8fafc;
  color: #3b82f6;
}

.home-view { min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding-bottom: 60px; }
.header { background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); position: sticky; top: 0; z-index: 100; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.header .container { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; }
.logo { display: flex; align-items: center; gap: 12px; font-size: 24px; font-weight: 700; color: #1e293b; }
.logo-icon { font-size: 32px; animation: bounce 2s infinite; }
nav { display: flex; gap: 12px; }
.cart-btn { position: relative; padding: 10px 20px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.cart-badge { position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
.main-content { padding-top: 60px; }
.hero { text-align: center; margin-bottom: 60px; }
.hero-title { font-size: 48px; font-weight: 800; color: white; margin-bottom: 16px; }
.hero-subtitle { font-size: 20px; color: rgba(255, 255, 255, 0.9); }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
</style>