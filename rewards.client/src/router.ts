import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import RegisterSalePage from '@/views/RegisterSalePage.vue'
import RewardsPage from '@/views/RewardsPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/register',
    name: 'RegisterSale',
    component: RegisterSalePage
  },
  {
    path: '/rewards',
    name: 'Rewards',
    component: RewardsPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
