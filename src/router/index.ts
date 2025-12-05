import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'
import HomeView from '@/views/HomeView.vue'
import AdminView from '@/views/AdminView.vue'

const ProductDetailView = defineComponent({
  props: ['id'],
  template: `<div>Product ID: {{ id }}</div>`
})


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetailView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router