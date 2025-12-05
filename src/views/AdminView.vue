<template>
  <div class="admin-view">
    <header class="header">
      <div class="container">
        <div class="logo">
          <span class="logo-icon">⚙️</span>
          <span class="logo-text">Admin Panel</span>
        </div>
       <router-link to="/" class="btn-back">← Back to Store</router-link>
      </div>
    </header>

    <main class="container main-content">
      <div class="admin-grid">
        <div class="form-section">
          <ProductForm
            :product="editingProduct"
            :edit-mode="!!editingProduct"
            @submit="handleProductSubmit"
            @cancel="cancelEdit"
          />
        </div>

        <div class="list-section">
          <div class="section-header">
            <h2>📦 Product List</h2>
            <span class="product-count">{{ products.length }} products</span>
          </div>
          
          <div class="product-list">
            <div
              v-for="product in products"
              :key="product.id"
              class="product-item"
            >
              <img :src="product.image" :alt="product.name" />
              <div class="product-details">
                <h4>{{ product.name }}</h4>
                <p class="price">{{ formatCurrency(product.price) }}</p>
                <span class="stock">Stock: {{ product.stock }}</span>
              </div>
              <div class="product-actions">
                <button @click="editProduct(product)" class="btn-edit">
                  ✏️
                </button>
                <button @click="deleteProduct(product.id)" class="btn-delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Product } from '@/lib/types'
import { generateId, saveToLocalStorage, getFromLocalStorage, formatCurrency } from '@/lib/utils'
import ProductForm from '@/components/ProductForm.vue'

const products = ref<Product[]>([])
const editingProduct = ref<Product | undefined>(undefined)

const loadProducts = () => {
  const saved = getFromLocalStorage<Product[]>('products')
  if (saved) {
    products.value = saved
  } else {
    // Default products
    products.value = [
      {
        id: generateId(),
        name: 'Gaming Laptop RTX 4060',
        price: 18500000,
        image: '/products/laptop.jpg',
        category: 'Laptop',
        description: 'Powerful gaming laptop with RTX 4060 graphics',
        stock: 5
      },
      {
        id: generateId(),
        name: 'Mechanical Keyboard RGB',
        price: 1250000,
        image: '/products/keyboard.jpg',
        category: 'Accessories',
        description: 'Mechanical keyboard with RGB lighting',
        stock: 15
      },
      {
        id: generateId(),
        name: 'Wireless Gaming Mouse',
        price: 850000,
        image: '/products/mouse.jpg',
        category: 'Accessories',
        description: 'High precision wireless gaming mouse',
        stock: 20
      },
      {
        id: generateId(),
        name: '27" QHD Monitor 165Hz',
        price: 4200000,
        image: '/products/monitor.jpg',
        category: 'Monitor',
        description: 'QHD gaming monitor with 165Hz refresh rate',
        stock: 8
      }
    ]
    saveToLocalStorage('products', products.value)
  }
}

const handleProductSubmit = (productData: Partial<Product>) => {
  if (editingProduct.value) {
    const index = products.value.findIndex(p => p.id === editingProduct.value!.id)
    products.value[index] = { ...editingProduct.value, ...productData }
    editingProduct.value = undefined
  } else {
    const newProduct: Product = {
      ...productData as Product,
      id: generateId()
    }
    products.value.push(newProduct)
  }
  saveToLocalStorage('products', products.value)
}

const editProduct = (product: Product) => {
  editingProduct.value = { ...product }
}

const cancelEdit = () => {
  editingProduct.value = undefined
}

const deleteProduct = (id: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    products.value = products.value.filter(p => p.id !== id)
    saveToLocalStorage('products', products.value)
  }
}

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%);
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

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.logo-icon {
  font-size: 32px;
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

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.main-content {
  padding-top: 40px;
}

.admin-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.product-count {
  background: #e0e7ff;
  color: #3b82f6;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

.product-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.product-details .price {
  font-size: 14px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 6px;
}

.product-details .stock {
  display: inline-block;
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.product-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-edit, .btn-delete {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
}

.btn-edit {
  background: #e0e7ff;
}

.btn-edit:hover {
  background: #3b82f6;
  transform: scale(1.1);
}

.btn-delete {
  background: #fee2e2;
}

.btn-delete:hover {
  background: #ef4444;
  transform: scale(1.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 968px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
}
</style>