import { defineStore } from 'pinia'
import { supabase } from '@/services/supabaseClient'
import { useAuthStore } from '@/stores/auth'

export const useMatriculaValidacionStore = defineStore('matriculaValidacion', {
  state: () => ({
    numeroMatriculaDisponible: true,
    isValidating: false,
    errorValidacion: null as string | null,
  }),

  actions: {
    async validarNumeroMatricula(numero: number | string | null | undefined, idMatriculaActual?: number) {
      if (!numero) {
        this.numeroMatriculaDisponible = true
        return true
      }

      const numeroMatricula = Number(numero)
      if (isNaN(numeroMatricula)) {
        this.numeroMatriculaDisponible = false
        return false
      }

      try {
        const authStore = useAuthStore()
        const { data, error } = await supabase
          .from('mv_libro_matricula')
          .select('id')
          .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario)
          .eq('numero_matricula_alumno', numeroMatricula)
          .in('codigo_estado_alumno', [0, 1])

        console.log('Resultado búsqueda:', { numero: numeroMatricula, encontrados: data?.length, data })

        if (error) throw error

        if (!data || data.length === 0) {
          this.numeroMatriculaDisponible = true
          return true
        }

        if (idMatriculaActual && data[0].id === idMatriculaActual) {
          this.numeroMatriculaDisponible = true
          return true
        }

        this.numeroMatriculaDisponible = false
        return false

      } catch (error) {
        console.error('Error validación:', error)
        this.numeroMatriculaDisponible = false
        return false
      }
    }
  }
})
