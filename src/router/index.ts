import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      children: [
        {
          path: '/dashboard/matriculas',
          name: 'matriculas',
          component: () => import('../views/MatriculasView.vue'),
        },
        {
          path: '/dashboard/matriculas/nueva',
          name: 'nueva-matricula',
          component: () => import('../views/MatriculaNuevaView.vue'),
        },
      ],
    },
  ],
})

export default router
