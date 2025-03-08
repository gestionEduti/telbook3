import type { Tables } from '@/types/supabase'

export const useNuevaMatriculaLoaderStore = defineStore('nuevaMatriculaLoader-store', () => {
  const authStore = useAuthStore()

  const tp_cursos = ref<string[]>([])
  const tp_jornada_alumno = ref<string[]>([])
  const tp_procedencia_alumno = ref<string[]>([])
  const tp_tipo_tel = ref<string[]>([])
  const tp_problemas_aprendizaje = ref<string[]>([])
  const tp_regiones_chile = ref<string[]>([])
  const tp_regiones_comunas_chile = ref<string[]>([])
  const tp_nacionalidad_alumno = ref<string[]>([])
  const tp_genero_alumno = ref<string[]>([])
  const tp_situacion_social = ref<string[]>([])
  const tp_pueblo_originario = ref<string[]>([])
  const tp_vive_con = ref<string[]>([])
  const tp_parentezco_alumno = ref<string[]>([])
  const tp_nivel_educacional_padres = ref<string[]>([])

  const poblar_tp_cursos = async () => {
    const { data, error, status } = await supabase
      .from('tp_cursos')
      .select()
      .eq('rbd_establecimiento', authStore.perfil?.rbd_usuario || 0)
      .order('sigla_nivel_curso', { ascending: true })
      .order('letra_nivel_curso', { ascending: true })
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_cursos.value = data.map(
        (item: Tables<'tp_cursos'>) => item.sigla_nivel_curso + item.letra_nivel_curso,
      )
    }
  }

  const poblar_tp_jornada_alumno = async () => {
    const { data, error, status } = await supabase.from('tp_jornada_alumno').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_jornada_alumno.value = data.map(
        (item: Tables<'tp_jornada_alumno'>) => item.descripcion_jornada || '', // TODO (modelo) corregir modelo
      )
    }
  }

  const poblar_tp_procedencia_alumno = async () => {
    const { data, error, status } = await supabase.from('tp_procedencia_alumno').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_procedencia_alumno.value = data.map(
        (item: Tables<'tp_procedencia_alumno'>) => item.descripcion_procedencia || '', // TODO (modelo) corregir modelo
      )
    }
  }

  const poblar_tp_tipo_tel = async () => {
    const { data, error, status } = await supabase.from('tp_tipo_tel').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_tipo_tel.value = data.map((item: Tables<'tp_tipo_tel'>) => item.descripcion_tel || '') // TODO (modelo) corregir modelo)
    }
  }

  const poblar_tp_problemas_aprendizaje = async () => {
    const { data, error, status } = await supabase.from('tp_problemas_aprendizaje').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_problemas_aprendizaje.value = data.map(
        (item: Tables<'tp_problemas_aprendizaje'>) => item.descripcion_problema_aprendizaje || '', // TODO (modelo) corregir modelo,
      )
    }
  }

  const poblar_tp_regiones_chile = async () => {
    const { data, error, status } = await supabase
      .from('tp_regiones_comunas_chile')
      .select('nombre_region')
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      const uniqueRegions = [...new Set(data.map((i) => i.nombre_region || ''))]
      tp_regiones_chile.value = uniqueRegions
    }
  }

  const poblar_tp_regiones_comunas_chile = async () => {
    const { data, error, status } = await supabase.from('tp_regiones_comunas_chile').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_regiones_comunas_chile.value = data.map(
        (item: Tables<'tp_regiones_comunas_chile'>) => item.nombre_comuna || '', // TODO (modelo) corregir modelo,
      )
    }
  }

  const poblar_tp_nacionalidad_alumno = async () => {
    const { data, error, status } = await supabase.from('tp_nacionalidad_alumno').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_nacionalidad_alumno.value = data.map(
        (item: Tables<'tp_nacionalidad_alumno'>) => item.descripcion_nacionalidad,
      )
    }
  }

  const poblar_tp_genero_alumno = async () => {
    const { data, error, status } = await supabase.from('tp_genero_alumno').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_genero_alumno.value = data.map(
        (item: Tables<'tp_genero_alumno'>) => item.descripcion_genero_alumno || '', // TODO (modelo) corregir modelo,
      )
    }
  }

  const poblar_tp_situacion_social = async () => {
    const { data, error, status } = await supabase.from('tp_situacion_social').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_situacion_social.value = data.map(
        (item: Tables<'tp_situacion_social'>) => item.descripcion_situacion_social || '', // TODO (modelo) corregir modelo,
      )
    }
  }

  const poblar_tp_pueblo_originario = async () => {
    const { data, error, status } = await supabase.from('tp_pueblo_originario').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_pueblo_originario.value = data.map(
        (item: Tables<'tp_pueblo_originario'>) => item.descripcion_pertenece || '', // TODO (modelo) corregir modelo,
      )
    }
  }

  const poblar_tp_vive_con = async () => {
    const { data, error, status } = await supabase.from('tp_vive_con').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_vive_con.value = data.map((item: Tables<'tp_vive_con'>) => item.descripcion_vive_con || '') // TODO (modelo) corregir modelo)
    }
  }

  const poblar_tp_parentezco_alumno = async () => {
    const { data, error, status } = await supabase.from('tp_parentezco_alumno').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_parentezco_alumno.value = data.map(
        (item: Tables<'tp_parentezco_alumno'>) => item.descripcion_parentezco_alumno || '', // TODO (modelo) corregir modelo,
      )
    }
  }

  const poblar_tp_nivel_educacional_padres = async () => {
    const { data, error, status } = await supabase.from('tp_nivel_educacional_padres').select()
    if (error) useErrorStore().setError({ error: error, customCode: status })
    else {
      tp_nivel_educacional_padres.value = data.map(
        (item: Tables<'tp_nivel_educacional_padres'>) => item.descripcion_educacion || '', // TODO (modelo) corregir modelo,
      )
    }
  }

  const fetchAllSelectsData = async () => {
    await Promise.all([
      poblar_tp_cursos(),
      poblar_tp_jornada_alumno(),
      poblar_tp_procedencia_alumno(),
      poblar_tp_tipo_tel(),
      poblar_tp_problemas_aprendizaje(),
      poblar_tp_regiones_chile(),
      poblar_tp_regiones_comunas_chile(),
      poblar_tp_nacionalidad_alumno(),
      poblar_tp_genero_alumno(),
      poblar_tp_situacion_social(),
      poblar_tp_pueblo_originario(),
      poblar_tp_vive_con(),
      poblar_tp_parentezco_alumno(),
      poblar_tp_nivel_educacional_padres(),
    ])
  }

  return {
    fetchAllSelectsData,
    tp_cursos,
    tp_jornada_alumno,
    tp_procedencia_alumno,
    tp_tipo_tel,
    tp_problemas_aprendizaje,
    tp_regiones_chile,
    tp_regiones_comunas_chile,
    tp_nacionalidad_alumno,
    tp_genero_alumno,
    tp_situacion_social,
    tp_pueblo_originario,
    tp_vive_con,
    tp_parentezco_alumno,
    tp_nivel_educacional_padres,
  }
})

// make sure to pass the right store definition, `useNuevaMatriculaLoaderStore` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNuevaMatriculaLoaderStore, import.meta.hot))
}
