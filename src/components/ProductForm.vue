<template>
  <div class="product-form">
    <h3>{{ editMode ? 'Edit Product' : 'Add New Product' }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Product Name</label>
        <input v-model="form.name" type="text" required />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Price (IDR)</label>
          <input v-model.number="form.price" type="number" required />
        </div>
        <div class="form-group">
          <label>Stock</label>
          <input v-model.number="form.stock" type="number" required />
        </div>
      </div>

      <div class="form-group">
        <label>Category</label>
        <input v-model="form.category" type="text" required />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="form.description" rows="3" required></textarea>
      </div>

      <div class="form-group">
        <label>Image URL</label>
        <input v-model="form.image" type="text" required placeholder="/products/image.jpg" />
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn-cancel">
          Cancel
        </button>
        <button type="submit" class="btn-submit">
          {{ editMode ? 'Update' : 'Add' }} Product
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Product } from '@/lib/types'

const props = defineProps<{
  product?: Product
  editMode?: boolean
}>()

const emit = defineEmits<{
  submit: [product: Partial<Product>]
  cancel: []
}>()

const form = reactive({
  name: '',
  price: 0,
  stock: 0,
  category: '',
  description: '',
  image: ''
})

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    Object.assign(form, newProduct)
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', { ...form })
  if (!props.editMode) {
    resetForm()
  }
}

const resetForm = () => {
  form.name = ''
  form.price = 0
  form.stock = 0
  form.category = ''
  form.description = ''
  form.image = ''
}
</script>

<style scoped>
.product-form {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.product-form h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

input, textarea {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-cancel, .btn-submit {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-submit {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
</style>
