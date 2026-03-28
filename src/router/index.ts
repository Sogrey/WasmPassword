import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/password',
      name: 'password',
      component: () => import('../views/Password.vue'),
    },
    {
      path: '/file',
      name: 'file',
      component: () => import('../views/FileEncrypt.vue'),
    },
  ],
})

export default router
