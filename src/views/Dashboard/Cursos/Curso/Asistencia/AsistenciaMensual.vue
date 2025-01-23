<script setup lang="ts">
const props = defineProps<{
  nivel: string
  letra: string
}>()

const errorStore = useErrorStore()
const authStore = useAuthStore()

import { useDateFormat, useNow } from '@vueuse/core'

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

const numeroAnioActual = computed(() => useDateFormat(useNow(), 'YYYY').value)
const numeroMesActual = computed(() => useDateFormat(useNow(), 'M').value)
const cantidadDiasMesActual = computed(() => {
  const now = useNow()
  const month = Number(mesSeleccionado.value)
  const year = Number(useDateFormat(now, 'YYYY').value)
  return new Date(year, month, 0).getDate()
})
const cantidadColumnasGrid = computed(() => {
  // const columnasNombre = 5
  // const columnasDiasMes = cantidadDiasMesActual.value
  // const columnasResumen = 7
  // return columnasNombre + columnasDiasMes + columnasResumen
  return 43
})

const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)
const asistenciasMes = ref<AsistenciasMes | null>(null)
const mesSeleccionado = ref(numeroMesActual.value)

/**
 * trae los alumnos del curso
 */
async function fetchAlumnosCurso() {
  const { data, error, status } = await supabase
    .from('mv_libro_matricula')
    .select()
    .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario)
    .ilike('nivel_alumno', props.nivel + props.letra)
    .order('apellidos_alumno', { ascending: true })
  if (error) errorStore.setError({ error: error, customCode: status })
  else alumnos.value = data
}

/**
 * trae desde supabase la asistencia de cada alumno del curso, para el mes actual
 */
async function fetchAsistenciasMes() {
  const { data, error } = await supabase.rpc('resumen_asistencia_mes', {
    nivel_alumno_param: props.nivel + props.letra,
    year_param: numeroAnioActual.value, // TODO traer desde la DB el año de operacion actual
    mes_param: numeroMesActual.value,
  })
  if (error) errorStore.setError({ error })
  else asistenciasMes.value = data as AsistenciasMes
}

/**
 * extrae la asistencia de un dia especifico de un alumno especifico desde el state
 */
function extraerAsistenciaAlumnoDia(rut: string, dia: number) {
  if (!asistenciasMes.value) return false
  const asistencia = asistenciasMes.value[rut]['asistencias'][`dia${dia}`]
  if (asistencia === 0) return false // ausente
  if (asistencia === 1) return true // presente
}

onMounted(async () => {
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
    <!-- <CardContent v-if="asistenciasMes && alumnos"> -->
    <CardContent>
      <!-- selector mes -->
      <div class="mb-6 flex flex-col items-end space-y-2">
        <Label>Mes seleccionado</Label>
        <Select v-model="mesSeleccionado">
          <SelectTrigger class="w-64">
            <SelectValue placeholder="Selecciona un mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Mes</SelectLabel>
              <SelectItem value="1">Enero</SelectItem>
              <SelectItem value="2">Febrero</SelectItem>
              <SelectItem value="3">Marzo</SelectItem>
              <SelectItem value="4">Abril</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <!-- encabezados -->
      <div
        :class="`telbook-label mb-1 grid grid-cols-[repeat(${cantidadColumnasGrid},minmax(0,1fr))] gap-1`"
      >
        <p class="col-span-5">Nombre</p>
        <p v-for="dia in cantidadDiasMesActual" :key="dia" class="col-span-1 text-center">
          {{ dia }}
        </p>
        <p class="col-span-1 -col-start-8 text-center">T</p>
        <p class="col-span-1 -col-start-7 text-center">P</p>
        <p class="col-span-1 -col-start-6 text-center">A</p>
        <p class="col-span-2 -col-start-5 text-center">%P</p>
        <p class="col-span-2 -col-start-3 text-center">%A</p>
      </div>

      <!-- alumnos -->
      <div
        :class="`mb-1 grid grid-cols-[repeat(${cantidadColumnasGrid},minmax(0,1fr))] gap-1`"
        v-for="alumno in alumnos"
        :key="alumno.rut_alumno"
      >
        <p class="col-span-5 truncate">{{ alumno.nombre_completo_alumno }}</p>
        <input
          v-for="dia in cantidadDiasMesActual"
          :key="dia"
          type="checkbox"
          class="col-span-1"
          :checked="extraerAsistenciaAlumnoDia(alumno.rut_alumno, dia)"
        />
        <p
          class="col-span-1 -col-start-8 place-content-center text-center text-xs tracking-tighter"
        >
          31
        </p>
        <p
          class="col-span-1 -col-start-7 place-content-center text-center text-xs tracking-tighter"
        >
          31
        </p>
        <p
          class="col-span-1 -col-start-6 place-content-center text-center text-xs tracking-tighter"
        >
          31
        </p>
        <p
          class="col-span-2 -col-start-5 place-content-center text-center text-xs tracking-tighter"
        >
          100%
        </p>
        <p
          class="col-span-2 -col-start-3 place-content-center text-center text-xs tracking-tighter"
        >
          100%
        </p>
      </div>
    </CardContent>
  </Card>
</template>
