<template>
  <div class="detail-view">
    <header class="header">
      <div class="container">
        <button @click="goBack" class="btn-back">
          ← Back
        </button>
        <div class="logo">🏪 TechStore</div>
        <button @click="cartOpen = true" class="cart-btn">
          🛒 Cart
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </button>
      </div>
    </header>

    <main class="container main-content">
      <div v-if="product" class="product-detail">
        <div class="detail-image">
          <img :src="product.image" :alt="product.name" />
        </div>
        
        <div class="detail-info">
          <span class="category-badge">{{ product.category }}</span>
          <h1>{{ product.name }}</h1>
          <div class="price-section">
            <div class="price">{{ formatCurrency(product.price) }}</div>
            <div class="stock-info" :class="{ 'low-stock': product.stock < 5 }">
              {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
            </div>
          </div>
          
          <div class="description-section">
            <h3>Description</h3>
            <p>{{ product.description }}</p>
          </div>

          <div class="quantity-section">
            <label>Quantity:</label>
            <div class="quantity-controls">
              <button @click="decreaseQty" class="btn-qty" :disabled="quantity <= 1">-</button>
              <input v-model.number="quantity" type="number" min="1" :max="product.stock" />
              <button @click="increaseQty" class="btn-qty" :disabled="quantity >= product.stock">+</button>
            </div>
          </div>

          <button 
            @click="addMultipleToCart" 
            class="btn-add-large"
            :disabled="product.stock === 0"
          >
            <span>🛒</span> Add {{ quantity }} to Cart
          </button>

          <div class="features">
            <div class="feature">
              <span class="icon">🚚</span>
              <div>
                <strong>Free Shipping</strong>
                <p>For orders over Rp 1.000.000</p>
              </div>
            </div>
            <div class="feature">
              <span class="icon">🔄</span>
              <div>
                <strong>Easy Returns</strong>
                <p>30 days return policy</p>
              </div>
            </div>
            <div class="feature">
              <span class="icon">✅</span>
              <div>
                <strong>Warranty</strong>
                <p>1 year manufacturer warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="not-found">
        <h2>Product not found</h2>
        <button @click="goBack" class="btn-back-home">Back to Store</button>
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
import { useRouter, useRoute } from 'vue-router'
import { Product } from '@/lib/types'
import { formatCurrency, getFromLocalStorage } from '@/lib/utils'
import { useCart } from '@/lib/cart'
import CartSidebar from '@/components/CartSidebar.vue'

const router = useRouter()
const route = useRoute()
const cart = useCart()

const product = ref<Product | null>(null)
const quantity = ref(1)
const cartOpen = ref(false)

const cartCount = computed(() => cart.cartCount.value)

const loadProduct = () => {
  const products = getFromLocalStorage<Product[]>('products')
  if (products) {
    product.value = products.find(p => p.id === route.params.id) || null
  }
}

const goBack = () => {
  router.back()
}

const increaseQty = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQty = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addMultipleToCart = () => {
  if (product.value) {
    for (let i = 0; i < quantity.value; i++) {
      const success = cart.addToCart(product.value)
      if (!success) break
    }
    cartOpen.value = true
  }
}

const handleIncrease = (id: string) => {
  if (product.value) {
    cart.increaseQuantity(id, product.value.stock)
  }
}

const handleCheckout = () => {
  alert('Thank you for your order! 🎉')
  cart.clearCart()
  cartOpen.value = false
  router.push('/')
}

onMounted(() => {
  cart.loadCart()
  loadProduct()
})
</script>

<style scoped>
.detail-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 60px;
}

.header {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.btn-back {
  padding: 10px 20px;
  background: #f1f5f9;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
}

.btn-back:hover {
  background: #e2e8f0;
  transform: translateX(-4px);
}

.cart-btn {
  position: relative;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.main-content {
  padding-top: 40px;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.5s ease;
}

.detail-image {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  aspect-ratio: 1;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.detail-image:hover img {
  transform: scale(1.1);
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-badge {
  display: inline-block;
  background: #e0e7ff;
  color: #3b82f6;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  width: fit-content;
}

.detail-info h1 {
  font-size: 36px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 2px solid #f1f5f9;
  border-bottom: 2px solid #f1f5f9;
}

.price {
  font-size: 32px;
  font-weight: 800;
  color: #3b82f6;
}

.stock-info {
  background: #dcfce7;
  color: #16a34a;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.stock-info.low-stock {
  background: #fef3c7;
  color: #d97706;
}

.description-section h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.description-section p {
  font-size: 16px;
  line-height: 1.7;
  color: #64748b;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quantity-section label {
  font-weight: 600;
  color: #475569;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
}

.quantity-controls input {
  width: 80px;
  padding: 12px;
  text-align: center;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}

.btn-qty {
  width: 40px;
  height: 40px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  color: #64748b;
  transition: all 0.2s ease;
}

.btn-qty:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-qty:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-add-large {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.btn-add-large:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.4);
}

.btn-add-large:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.feature {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.feature .icon {
  font-size: 32px;
  flex-shrink: 0;
}

.feature strong {
  font-size: 16px;
  color: #1e293b;
  display: block;
  margin-bottom: 4px;
}

.feature p {
  font-size: 14px;
  color: #64748b;
}

.not-found {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
}

.not-found h2 {
  font-size: 32px;
  color: #64748b;
  margin-bottom: 24px;
}

.btn-back-home {
  padding: 14px 28px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 968px) {
  .product-detail {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 24px;
  }

  .detail-info h1 {
    font-size: 28px;
  }

  .price {
    font-size: 24px;
  }
}
</style>
