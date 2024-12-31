import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'

const routes = [
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
    path: '/logout',
    name: 'logout',
    component: () => import('../views/LogoutView.vue'),
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
        path: '/dashboard/cursos/:nivel/:letra',
        name: 'curso',
        component: () => import('../views/Dashboard/Cursos/Curso/CursoView.vue'),
        props: true,
        redirect: { name: 'alumnos' },
        children: [
          {
            path: '/dashboard/cursos/:nivel/:letra/alumnos',
            name: 'alumnos',
            component: () => import('../views/Dashboard/Cursos/Curso/Alumnos/AlumnosView.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/alumnos/:rut',
            name: 'alumno',
            component: () => import('../views/Dashboard/Cursos/Curso/Alumnos/AlumnoView.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/asistencia/diaria',
            name: 'asistenciaDiaria',
            component: () =>
              import('../views/Dashboard/Cursos/Curso/Asistencia/AsistenciaDiaria.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/asistencia/mensual',
            name: 'asistenciaMensual',
            component: () =>
              import('../views/Dashboard/Cursos/Curso/Asistencia/AsistenciaMensual.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/planificaciones/corto',
            name: 'planificacionesCortoPlazo',
            component: () =>
              import('../views/Dashboard/Cursos/Curso/Planificaciones/CortoPlazoView.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/planificaciones/mediano',
            name: 'planificacionesMedianoPlazo',
            component: () =>
              import('../views/Dashboard/Cursos/Curso/Planificaciones/MedianoPlazoView.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/planificaciones/largo',
            name: 'planificacionesLargoPlazo',
            component: () =>
              import('../views/Dashboard/Cursos/Curso/Planificaciones/LargoPlazoView.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/planificaciones/leccionario',
            name: 'leccionario',
            component: () =>
              import('../views/Dashboard/Cursos/Curso/Planificaciones/LeccionarioView.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/evaluaciones/formato',
            name: 'evaluacionesPorFormato',
            component: () =>
              import('../views/Dashboard/Cursos/Curso/Evaluaciones/PorFormatoView.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/evaluaciones/personalizada',
            name: 'evaluacionesPersonalizadas',
            component: () =>
              import('../views/Dashboard/Cursos/Curso/Evaluaciones/PersonalizadaView.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/modulotel',
            name: 'moduloTel',
            component: () => import('../views/Dashboard/Cursos/Curso/ModuloTEL/ModuloTelView.vue'),
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
      {
        path: '/dashboard/perfil',
        name: 'perfil',
        component: () => import('../views/Dashboard/Perfil/PerfilView.vue'),
      },
      {
        path: '/dashboard/panel-admin',
        name: 'panel-admin',
        component: () => import('../views/Dashboard/PanelAdmin/PanelAdminView.vue'),
      },

      // solo para admin
      {
        path: '/dashboard/prematricula',
        name: 'prematricula',
        component: () => import('../views/Dashboard/Prematricula/PreMatriculaView.vue'),
      },
    ],
  },

  // Error
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  await authStore.obtenerSesion()

  const paginaConAutenticacion = ['/login'].includes(to.path)
  if (!authStore.usuario && !paginaConAutenticacion) {
    return { name: 'login' }
  }
  if (authStore.usuario && paginaConAutenticacion) {
    return { name: 'dashboard' }
  }
})

router.afterEach((to, from) => {
  const errorStore = useErrorStore()
  errorStore.clearError()
})

export default router
