import type { Tables } from '@/types/supabase'
import type { AsistenciasMes } from '@/types/asistenciamensual'

const authStore = useAuthStore()
const errorStore = useErrorStore()

export const useAsistenciaMensualStore = defineStore('asistencia-mensual', () => {
  const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)
  const asistencias = ref<AsistenciasMes | null>(null)

  /**
   * trae los alumnos del curso
   */
  async function fetchAlumnosCurso(curso: string) {
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
  async function fetchAsistenciasMes(year: string, month: string, curso: string) {
    asistencias.value = null // al cambiar de mes, seteo como null para que la transicion se gatille
    const { data, error } = await supabase.rpc('resumen_asistencia_mes', {
      nivel_alumno_param: curso,
      year_param: Number(year), // TODO traer desde la DB el año de operacion actual
      mes_param: Number(month),
    })
    if (error) {
      errorStore.setError({ error })
    } else {
      asistencias.value = data as AsistenciasMes
    }
  }

  return {
    alumnos,
    asistencias,
    fetchAlumnosCurso,
    fetchAsistenciasMes,
  }
})
