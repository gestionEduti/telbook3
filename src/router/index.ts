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
          path: '/dashboard/cursos/:siglaCurso',
          name: 'curso',
          component: () => import('../views/Dashboard/Cursos/Curso/CursoView.vue'),
          props: true,
          redirect: { name: 'alumnos' },
          children: [
            {
              path: '/dashboard/cursos/:siglaCurso/alumnos',
              name: 'alumnos',
              component: () => import('../views/Dashboard/Cursos/Curso/Alumnos/AlumnosView.vue'),
              props: true,
            },
            {
              path: '/dashboard/cursos/:siglaCurso/alumnos/:rutAlumno',
              name: 'alumno',
              component: () => import('../views/Dashboard/Cursos/Curso/Alumnos/AlumnoView.vue'),
              props: true,
            },
          ],
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
