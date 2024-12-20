import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
import { useAuthStore } from '@/stores/auth'

export const useNuevaMatriculaLoaderStore = defineStore('nuevaMatriculaLoader-store', () => {
  const authStore = useAuthStore()

  const tp_cursos = ref<string[]>([])
  const tp_jornada_alumno = ref<string[]>([])
  const tp_procedencia_alumno = ref<string[]>([])
  const tp_tipo_tel = ref<string[]>([])
  const tp_problemas_aprendizaje = ref<string[]>([])
  const tp_regiones_comunas_chile = ref<string[]>([])
  const tp_nacionalidad_alumno = ref<string[]>([])
  const tp_genero_alumno = ref<string[]>([])
  const tp_situacion_social = ref<string[]>([])
  const tp_pueblo_originario = ref<string[]>([])
  const tp_vive_con = ref<string[]>([])
  const tp_parentezco_alumno = ref<string[]>([])
  const tp_nivel_educacional_padres = ref<string[]>([])

  const poblar_tp_cursos = async () => {
    const { data, error } = await supabase
      .from('tp_cursos')
      .select()
      .eq('rbd_establecimiento', authStore.perfil?.rbd_usuario || 0)
      .order('sigla_nivel_curso', { ascending: true })
      .order('letra_nivel_curso', { ascending: true })
    if (error) console.error(error)
    else {
      tp_cursos.value = data.map((item: Tables<'tp_cursos'>) => item.nombre_curso || '')
    }
  }

  const poblar_tp_jornada_alumno = async () => {
    const { data, error } = await supabase.from('tp_jornada_alumno').select()
    if (error) console.error(error)
    else {
      tp_jornada_alumno.value = data.map(
        (item: Tables<'tp_jornada_alumno'>) => item.descripción_jornada || '',
      )
    }
  }

  const poblar_tp_procedencia_alumno = async () => {
    const { data, error } = await supabase.from('tp_procedencia_alumno').select()
    if (error) console.error(error)
    else {
      tp_procedencia_alumno.value = data.map(
        (item: Tables<'tp_procedencia_alumno'>) => item.descripcion_procedencia || '',
      )
    }
  }

  const poblar_tp_tipo_tel = async () => {
    const { data, error } = await supabase.from('tp_tipo_tel').select()
    if (error) console.error(error)
    else {
      tp_tipo_tel.value = data.map((item: Tables<'tp_tipo_tel'>) => item.descripcion_tel || '')
    }
  }

  const poblar_tp_problemas_aprendizaje = async () => {
    const { data, error } = await supabase.from('tp_problemas_aprendizaje').select()
    if (error) console.error(error)
    else {
      tp_problemas_aprendizaje.value = data.map(
        (item: Tables<'tp_problemas_aprendizaje'>) => item.descripcion_problema_aprendizaje || '',
      )
    }
  }

  const poblar_tp_regiones_comunas_chile = async () => {
    const { data, error } = await supabase.from('tp_regiones_comunas_chile').select()
    if (error) console.error(error)
    else {
      tp_regiones_comunas_chile.value = data.map(
        (item: Tables<'tp_regiones_comunas_chile'>) => item.nombre_comuna || '',
      )
    }
  }

  const poblar_tp_nacionalidad_alumno = async () => {
    const { data, error } = await supabase.from('tp_nacionalidad_alumno').select()
    if (error) console.error(error)
    else {
      tp_nacionalidad_alumno.value = data.map(
        (item: Tables<'tp_nacionalidad_alumno'>) => item.descripcion_nacionalidad || '',
      )
    }
  }

  const poblar_tp_genero_alumno = async () => {
    const { data, error } = await supabase.from('tp_genero_alumno').select()
    if (error) console.error(error)
    else {
      tp_genero_alumno.value = data.map(
        (item: Tables<'tp_genero_alumno'>) => item.descripcion_genero_alumno || '',
      )
    }
  }

  const poblar_tp_situacion_social = async () => {
    const { data, error } = await supabase.from('tp_situacion_social').select()
    if (error) console.error(error)
    else {
      tp_situacion_social.value = data.map(
        (item: Tables<'tp_situacion_social'>) => item.descripcion_situacion_social || '',
      )
    }
  }

  const poblar_tp_pueblo_originario = async () => {
    const { data, error } = await supabase.from('tp_pueblo_originario').select()
    if (error) console.error(error)
    else {
      tp_pueblo_originario.value = data.map(
        (item: Tables<'tp_pueblo_originario'>) => item.descripcion_pertenece || '',
      )
    }
  }

  const poblar_tp_vive_con = async () => {
    const { data, error } = await supabase.from('tp_vive_con').select()
    if (error) console.error(error)
    else {
      tp_vive_con.value = data.map((item: Tables<'tp_vive_con'>) => item.descripcion_vive_con || '')
    }
  }

  const poblar_tp_parentezco_alumno = async () => {
    const { data, error } = await supabase.from('tp_parentezco_alumno').select()
    if (error) console.error(error)
    else {
      tp_parentezco_alumno.value = data.map(
        (item: Tables<'tp_parentezco_alumno'>) => item.descripcion_parentezco_alumno || '',
      )
    }
  }

  const poblar_tp_nivel_educacional_padres = async () => {
    const { data, error } = await supabase.from('tp_nivel_educacional_padres').select()
    if (error) console.error(error)
    else {
      tp_nivel_educacional_padres.value = data.map(
        (item: Tables<'tp_nivel_educacional_padres'>) => item.descripcion_educacion || '',
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

  // TEMPORAL SOLO EN DESAROLLO PARA PRUEBAS RAPIDAS Y NO TENER QUE RELLENAR EL FORMULARIO A MANO
  const datos_ejemplo = {
    // numbers
    anio_libro: 2025,
    codigo_estado_alumno: 1,
    numero_lista_nivel_alumno: 1,
    numero_matricula_alumno: 1,
    rbd_establecimiento: 1,
    // strings
    apellidos_alumno: 'Perez Gonzales',
    apoderado_tutor_alumno: '',
    causa_retiro_alumno: '',
    comuna_alumno: 'SANTIAGO',
    domicilio_alumno: 'San Pablo 123, dpto. 456',
    email_apoderado_alumno: 'juanperez@gmail.com',
    estado_alumno: '',
    jornada_alumno: 'TARDE',
    nacionalidad_alumno: 'CHILENA',
    nivel_alumno: 'MMA',
    nivel_educacional_madre: 'MEDIA COMPLETA',
    nivel_educacional_padre: 'MEDIA COMPLETA',
    nombre_apoderado_alumno: 'Juan Perez',
    nombre_completo_alumno: '',
    nombres_alumno: 'Juan Carlos',
    parentezco_con_alumno: 'MADRE',
    problema_aprendizaje_alumno: 'CON',
    procedencia_alumno: 'CONTINUIDAD',
    pueblo_originario_alumno: 'SI',
    region_alumno: '',
    rut_alumno: '12456789-k',
    rut_profesor_alumno: '',
    sexo_alumno: 'MASCULINO',
    situacion_social_alumno: 'PRIORITARIO',
    telefono_apoderado_alumno: '+56981234567',
    tipo_tel_alumno: 'TEL MIXTO',
    vive_con_alumno: 'MADRE',
    // timestamps
    fecha_incorporacion_alumno: '2024-12-15',
    fecha_nacimiento_alumno: '2018-10-20',
    fecha_retiro_escuela: '',
  }

  return {
    fetchAllSelectsData,
    tp_cursos,
    tp_jornada_alumno,
    tp_procedencia_alumno,
    tp_tipo_tel,
    tp_problemas_aprendizaje,
    tp_regiones_comunas_chile,
    tp_nacionalidad_alumno,
    tp_genero_alumno,
    tp_situacion_social,
    tp_pueblo_originario,
    tp_vive_con,
    tp_parentezco_alumno,
    tp_nivel_educacional_padres,
    datos_ejemplo,
  }
})
