import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: () => import('../views/Home.vue'),
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
      component: () => import('../views/Dashboard/DashboardView.vue'),
      redirect: '/dashboard/resumen',
      children: [
        {
          path: '/dashboard/resumen',
          name: 'resumen',
          component: () => import('../views/Dashboard/Resumen/ResumenView.vue'),
        },
        {
          path: '/dashboard/cursos',
          name: 'cursos',
          component: () => import('../views/Dashboard/Cursos/CursosView.vue'),
        },
        {
          path: '/dashboard/matriculas',
          name: 'matriculas',
          component: () => import('../views/Dashboard/Matriculas/MatriculasView.vue'),
        },
        {
          path: '/dashboard/matriculas/nueva',
          name: 'nueva-matricula',
          component: () => import('../views/Dashboard/Matriculas/NuevaMatricula.vue'),
        },
      ],
    },
  ],
})

export default router
