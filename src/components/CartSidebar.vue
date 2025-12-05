<template>
  <div class="cart-sidebar" :class="{ open: isOpen }">
    <div class="cart-header">
      <h2>🛒 Shopping Cart</h2>
      <button @click="$emit('close')" class="btn-close">✕</button>
    </div>

    <div class="cart-content">
      <div v-if="items.length === 0" class="empty-cart">
        <div class="empty-icon">🛍️</div>
        <p>Your cart is empty</p>
      </div>

      <div v-else class="cart-items">
        <CartItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          @increase="$emit('increase', $event)"
          @decrease="$emit('decrease', $event)"
          @remove="$emit('remove', $event)"
        />
      </div>
    </div>

    <div v-if="items.length > 0" class="cart-footer">
      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>{{ formatCurrency(total) }}</span>
        </div>
        <div class="summary-row">
          <span>Tax (11%)</span>
          <span>{{ formatCurrency(total * 0.11) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>{{ formatCurrency(total * 1.11) }}</span>
        </div>
      </div>
      <button @click="$emit('checkout')" class="btn-checkout">
        Checkout Now
      </button>
    </div>
  </div>
  <div v-if="isOpen" class="overlay" @click="$emit('close')"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CartItem as CartItemType } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import CartItem from './CartItem.vue'

const props = defineProps<{
  items: CartItemType[]
  isOpen: boolean
}>()

defineEmits<{
  close: []
  increase: [id: string]
  decrease: [id: string]
  remove: [id: string]
  checkout: []
}>()

const total = computed(() => {
  return props.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
})
</script>

<style scoped>
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -450px;
  width: 450px;
  height: 100vh;
  background: #f8fafc;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.cart-sidebar.open {
  right: 0;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.cart-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.btn-close {
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  color: #64748b;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #e2e8f0;
  transform: rotate(90deg);
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce 2s infinite;
}

.cart-items {
  animation: fadeIn 0.3s ease;
}

.cart-footer {
  padding: 20px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.cart-summary {
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #64748b;
}

.summary-row.total {
  border-top: 2px solid #e2e8f0;
  margin-top: 8px;
  padding-top: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.btn-checkout {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-checkout:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 768px) {
  .cart-sidebar {
    width: 100%;
    right: -100%;
  }
}
</style>