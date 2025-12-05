<template>
  <div class="product-card">
    <div class="product-image" @click="goToDetail">
      <img :src="product.image" :alt="product.name" />
      <div class="product-badge">{{ product.category }}</div>
    </div>
    <div class="product-info">
      <h3 @click="goToDetail" class="clickable">{{ product.name }}</h3>
      <p class="description">{{ truncateText(product.description, 50) }}</p>
      <div class="product-footer">
        <div class="price">{{ formatCurrency(product.price) }}</div>
        <div class="stock">Stock: {{ product.stock }}</div>
      </div>
      <div class="button-group">
        <button @click="goToDetail" class="btn-detail">
          👁️ Detail
        </button>
        <button 
          @click="handleAddToCart" 
          class="btn-add"
          :disabled="product.stock === 0"
        >
          🛒
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  'add-to-cart': [product: Product]
}>()

const router = useRouter()

const goToDetail = () => {
  router.push(`/product/${props.product.id}`)
}

const handleAddToCart = () => {
  emit('add-to-cart', props.product)
}

const truncateText = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
}

.product-image {
  position: relative;
  height: 220px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  cursor: pointer;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.clickable {
  cursor: pointer;
  transition: color 0.2s ease;
}

.clickable:hover {
  color: #3b82f6;
}

.description {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 16px;
  line-height: 1.5;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
}

.stock {
  font-size: 13px;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 12px;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.btn-detail {
  padding: 12px;
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-detail:hover {
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(100, 116, 139, 0.3);
}

.btn-add {
  width: 50px;
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
}

.btn-add:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
