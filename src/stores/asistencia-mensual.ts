import type { Tables } from '@/types/supabase'
import type { AsistenciasMes } from '@/types/asistenciamensual'

import { useDateFormat, useNow } from '@vueuse/core'

const authStore = useAuthStore()
const errorStore = useErrorStore()

import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

export const useAsistenciaMensualStore = defineStore('asistencia-mensual', () => {
  const numeroYearActual = computed(() => useDateFormat(useNow(), 'YYYY').value) // ejemplo -> 2025
  const numeroMesActual = computed(() => useDateFormat(useNow(), 'M').value) // ejemplo marzo -> 3
  const cantidadDiasMesActual = computed(() => {
    const now = useNow()
    const month = Number(mesSeleccionado.value)
    const year = Number(useDateFormat(now, 'YYYY').value)
    return new Date(year, month, 0).getDate()
  })

  const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)
  const asistencias = ref<AsistenciasMes | null>(null)
  const mesSeleccionado = ref(numeroMesActual.value)
  const cursoActual = ref('')
  const modoEdicion = ref(false)

  /**
   * trae los alumnos del curso
   */
  async function fetchAlumnosCurso(curso: string) {
    cursoActual.value = curso
    const { data, error, status } = await supabase
      .from('mv_libro_matricula')
      .select()
      .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario)
      .ilike('nivel_alumno', curso)
      .order('apellidos_alumno', { ascending: true })
    if (error) errorStore.setError({ error: error, customCode: status })
    else alumnos.value = data
  }

  /**
   * trae desde supabase la asistencia de cada alumno del curso, para el mes actual
   */
  async function fetchAsistenciasMes(curso: string) {
    cursoActual.value = curso
    asistencias.value = null // al cambiar de mes, seteo como null para que la transicion se gatille
    const { data, error } = await supabase.rpc('resumen_asistencia_mes', {
      nivel_alumno_param: curso,
      year_param: Number(numeroYearActual.value), // TODO traer desde la DB el año de operacion actual
      mes_param: Number(mesSeleccionado.value),
    })
    if (error) {
      errorStore.setError({ error })
    } else {
      asistencias.value = data as AsistenciasMes
    }
  }

  function actualizarEstadoAsistencia(rut: string, dia: number, nuevoValor: number) {
    // console.log(`actualizando a ${nuevoValor} para el dia ${dia}, rut ${rut}, `)
    if (asistencias.value && asistencias.value[rut]) {
      asistencias.value[rut][dia] = nuevoValor
    } else {
      const diasAsistencia: Record<number, number | null> = {}
      for (let i = 1; i <= 31; i++) {
        diasAsistencia[i] = i === dia ? nuevoValor : null
      }
      asistencias.value = {
        ...asistencias.value,
        [rut]: diasAsistencia,
      }
    }
  }

  function guardarModificacionesAsistencia() {
    modoEdicion.value = false
    toast({
      title: 'Exito',
      description: 'La asistencia fue actualizada exitosamente.',
      variant: 'exitoso',
      duration: 3000,
    })
  }

  return {
    alumnos,
    asistencias,
    mesSeleccionado,
    cursoActual,
    modoEdicion,

    cantidadDiasMesActual,

    fetchAlumnosCurso,
    fetchAsistenciasMes,
    actualizarEstadoAsistencia,
    guardarModificacionesAsistencia,
  }
})
