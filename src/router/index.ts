import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/ResetPassword.vue'),
    meta: {
      requiresAuth: false,
      isPublic: true,
    },
  },
  {
    path: '/actualizar-password',
    name: 'UpdatePassword',
    component: () => import('@/views/UpdatePassword.vue'),
  },
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
  // {
  //   path: '/reset-password',
  //   name: 'reset-password',
  //   component: () => import('../views/PasswordReset.vue'),
  // },
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
              import('../views/Dashboard/Cursos/Curso/Planificaciones/Corto/CortoPlazoView.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/planificaciones/mediano',
            name: 'planificacionesMedianoPlazo',
            component: () =>
              import(
                '../views/Dashboard/Cursos/Curso/Planificaciones/Mediano/MedianoPlazoView.vue'
              ),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/planificaciones/largo',
            name: 'planificacionesLargoPlazo',
            component: () =>
              import('../views/Dashboard/Cursos/Curso/Planificaciones/Largo/LargoPlazoView.vue'),
            props: true,
          },
          {
            path: '/dashboard/cursos/:nivel/:letra/planificaciones/leccionario',
            name: 'leccionario',
            component: () =>
              import(
                '../views/Dashboard/Cursos/Curso/Planificaciones/Leccionario/LeccionarioView.vue'
              ),
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
        path: '/dashboard/matriculas/editar/:matriculaId',
        name: 'editar-matricula',
        props: true,
        component: () => import('../views/Dashboard/Matriculas/EditarMatricula.vue'),
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

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.obtenerSesion()

  // booleano que indica si la pagina actual es una pagina de autenticacion
  // se usa para que cuando un usuario ya este autenticado y quiera ir a una pagina de autenticacion...
  // se reenvie al dashboard
  const rutasAutenticacion = ['/login', '/reset-password', '/actualizar-password']
  const esRelacionadaConAutenticacion = rutasAutenticacion.includes(to.path)

  // booleano que indica si una pagina requiere autenticacion
  // en este caso, todas las paginas bajo /dashboard requieren autenticacion
  const requiereAutorizacion = to.matched.some((record) => record.path === '/dashboard')

  // casos para cuando el usuario esta autenticado
  if (authStore.usuario) {
    // si es una pagina de autenticacion (login, logout, reset-password, etc...)
    // se reenvia al dashboard
    if (esRelacionadaConAutenticacion) return { name: 'dashboard' }
    // de lo contrario continua (por ejemplo ir al dashboard)
  }

  // casos para cuando el usuario no esta autenticado
  else {
    // si es una pagina que requiere autenticacion (dashboard, etc...)
    // se reenvia al login
    if (requiereAutorizacion) return { name: 'login' }
    // de lo contrario continua (por ejemplo ir al login
  }
})

router.afterEach((to, from) => {
  const errorStore = useErrorStore()
  errorStore.clearError()
})

export default router
