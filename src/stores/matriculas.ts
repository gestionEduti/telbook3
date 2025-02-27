import type { Tables } from '@/types/supabase'

const authStore = useAuthStore()
const errorStore = useErrorStore()

export const useMatriculasStore = defineStore('matriculas', () => {
  const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)

  async function fetchAlumnos() {
    const { data, error, status } = await supabase
      .from('mv_libro_matricula')
      .select()
      .or('codigo_estado_alumno.eq.0,codigo_estado_alumno.eq.1')
      .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario) // // TODO: setear error si es que el perfil no existe
      .order('numero_matricula_alumno', { ascending: true })
    if (error) errorStore.setError({ error: error, customCode: status })
    else alumnos.value = data
  }

  return {
    alumnos,
    fetchAlumnos,
  }
})
