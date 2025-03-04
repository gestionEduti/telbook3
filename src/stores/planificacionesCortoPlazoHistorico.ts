import { defineStore } from 'pinia'
import { supabase } from '@/services/supabaseClient'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

interface PlanificacionCortoPlazo {
  id_planificacion: number
  rbd: number
  nivel_planificacion: string
  id_planificacion_mediano_plazo: number
  proyecto_eje: string
  recursos: string
  instrumentos_evaluacion: string
  inicio_desarrollo_cierre: string
  estado_planificacion: string
  fecha_modificacion: Date
  fecha_inicio: Date
  fecha_creacion: Date
  codigo_oa: number
  descripcion_ambito: string
  descripcion_nucleo: string
  descripcion_oa: string
}

export const usePlanificacionesCortoPlazoStore = defineStore('planificacionesCortoPlazoHistorico', {
  state: () => ({
    planificaciones: [] as PlanificacionCortoPlazo[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchPlanificacionesCortoPlazoHistorico(nivel: string, letra: string) {
      try {
        this.loading = true
        this.error = null

        const nombreCurso = nivel + letra

        const { data, error } = await supabase
          .rpc('gestionar_planificaciones_corto_plazo_historico', {
            p_rbd: Number(authStore.perfil!.rbd_usuario),
            p_nivel: nombreCurso
          })

        if (error) throw error

        this.planificaciones = (data || []).map(p => ({
          ...p,
          fecha_modificacion: new Date(p.fecha_modificacion),
          fecha_inicio: new Date(p.fecha_inicio),
          fecha_creacion: new Date(p.fecha_creacion)
        }))
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al cargar las planificaciones'
        console.error('Error:', error)
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    getPlanificaciones: (state) => state.planificaciones,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  }
})
