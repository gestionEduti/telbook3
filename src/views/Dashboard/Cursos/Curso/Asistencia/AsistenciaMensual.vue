<script setup lang="ts">
const props = defineProps<{
  nivel: string
  letra: string
}>()

const errorStore = useErrorStore()
const authStore = useAuthStore()

// types
import type { Tables } from '@/types/supabase'
interface AsistenciasAlumno {
  [key: string]: number
}
interface Alumno {
  rut: string
  asistencias: AsistenciasAlumno
}
interface AsistenciasMes {
  [alumnoId: string]: Alumno
}

import { useDateFormat, useNow } from '@vueuse/core'

// data
const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)
const diasMes = ref<number>(0)
const asistenciasMes = ref<AsistenciasMes | null>(null)

// methods
const fetchAlumnosCurso = async () => {
  const { data, error, status } = await supabase
    .from('mv_libro_matricula')
    .select()
    .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario)
    .ilike('nivel_alumno', props.nivel + props.letra)
    .order('apellidos_alumno', { ascending: true })
  if (error) errorStore.setError({ error: error, customCode: status })
  else alumnos.value = data
}

const fetchAsistenciasMes = async () => {
  const { data, error } = await supabase.rpc('resumen_asistencia_mes', {
    nivel_alumno_param: props.nivel + props.letra,
    year_param: 2025,
    mes_param: 1,
  })
  if (error) console.error(error)
  else asistenciasMes.value = data as AsistenciasMes
}

const obtenerCantidadDiasMes = () => {
  const now = useNow()
  const month = Number(useDateFormat(now, 'MM').value)
  const year = Number(useDateFormat(now, 'YYYY').value)
  const lastDayOfMonth = computed(() => new Date(year, month, 0).getDate())
  return lastDayOfMonth.value
}

const extraerAsistenciaAlumnoDia = (rut: string, dia: number) => {
  if (!asistenciasMes.value) return false
  const asistencia = asistenciasMes.value[rut]['asistencias'][`dia${dia}`]
  if (asistencia === 0) return false // ausente
  if (asistencia === 1) return true // presente
}

onMounted(async () => {
  diasMes.value = obtenerCantidadDiasMes()
  await Promise.all([fetchAsistenciasMes(), fetchAlumnosCurso()])
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Asistencia mensual</CardTitle>
      <CardDescription>Descripcion asistencia mensual.</CardDescription>
      <Separator />
    </CardHeader>
    <CardContent v-if="asistenciasMes && alumnos">
      <!-- encabezados -->
      <div class="telbook-label mb-1 grid grid-cols-[repeat(36,minmax(0,1fr))] gap-1">
        <p class="col-span-5">Nombre</p>
        <p v-for="dia in diasMes" :key="dia" class="col-span-1 text-center">{{ dia }}</p>
      </div>

      <!-- alumnos -->
      <div
        class="mb-1 grid grid-cols-[repeat(36,minmax(0,1fr))] gap-1"
        v-for="alumno in alumnos"
        :key="alumno.rut_alumno"
      >
        <p class="col-span-5 truncate">{{ alumno.nombre_completo_alumno }}</p>
        <input
          v-for="dia in diasMes"
          :key="dia"
          type="checkbox"
          class="col-span-1"
          :checked="extraerAsistenciaAlumnoDia(alumno.rut_alumno, dia)"
          disabled
        />
      </div>
    </CardContent>
  </Card>
</template>
