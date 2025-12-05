<template>
  <div class="cart-item">
    <img :src="item.image" :alt="item.name" class="item-image" @click="goToDetail" />
    <div class="item-details">
      <h4 @click="goToDetail" class="clickable">{{ item.name }}</h4>
      <p class="item-price">{{ formatCurrency(item.price) }}</p>
    </div>
    <div class="item-actions">
      <div class="quantity-controls">
        <button @click="$emit('decrease', item.id)" class="btn-qty">-</button>
        <span class="quantity">{{ item.quantity }}</span>
        <button @click="$emit('increase', item.id)" class="btn-qty">+</button>
      </div>
      <button @click="$emit('remove', item.id)" class="btn-remove">
        🗑️
      </button>
    </div>
    <div class="item-total">{{ formatCurrency(item.price * item.quantity) }}</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CartItem } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

const props = defineProps<{
  item: CartItem
}>()

defineEmits<{
  increase: [id: string]
  decrease: [id: string]
  remove: [id: string]
}>()

const router = useRouter()

const goToDetail = () => {
  router.push(`/product/${props.item.id}`)
}
</script>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 60px 1fr auto auto;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.item-image:hover {
  transform: scale(1.1);
}

.item-details h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.clickable {
  cursor: pointer;
  transition: color 0.2s ease;
}

.clickable:hover {
  color: #3b82f6;
}

.item-price {
  font-size: 13px;
  color: #3b82f6;
  font-weight: 600;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  padding: 4px;
  border-radius: 8px;
}

.btn-qty {
  width: 28px;
  height: 28px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  color: #64748b;
}

.btn-qty:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.quantity {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
  color: #1e293b;
}

.btn-remove {
  width: 36px;
  height: 36px;
  background: #fee2e2;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #ef4444;
  transform: scale(1.1);
}

.item-total {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
