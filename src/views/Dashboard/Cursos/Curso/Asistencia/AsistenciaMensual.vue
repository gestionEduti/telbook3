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
interface AsistenciasMes {
  [alumnoId: string]: {
    [key: string]: number
  }
}

const numeroAnioActual = computed(() => useDateFormat(useNow(), 'YYYY').value) // ejemplo -> 2025
const numeroMesActual = computed(() => useDateFormat(useNow(), 'M').value) // ejemplo marzo -> 3
const cantidadDiasMesActual = computed(() => {
  const now = useNow()
  const month = Number(mesSeleccionado.value)
  const year = Number(useDateFormat(now, 'YYYY').value)
  return new Date(year, month, 0).getDate()
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
async function fetchAsistenciasMes(mes: string) {
  asistenciasMes.value = null // al cambiar de mes, seteo como null para que la transicion se gatille
  const { data, error } = await supabase.rpc('resumen_asistencia_mes', {
    nivel_alumno_param: props.nivel + props.letra,
    year_param: Number(numeroAnioActual.value), // TODO traer desde la DB el año de operacion actual
    mes_param: Number(mes),
  })
  if (error) errorStore.setError({ error })
  else asistenciasMes.value = data as AsistenciasMes
}

onMounted(async () => {
  await Promise.all([fetchAsistenciasMes(numeroMesActual.value), fetchAlumnosCurso()])
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <Card v-if="alumnos">
      <CardHeader>
        <CardTitle>Asistencia mensual</CardTitle>
        <CardDescription>Descripcion asistencia mensual.</CardDescription>
        <Separator />
      </CardHeader>
      <!-- <CardContent v-if="asistenciasMes && alumnos"> -->
      <CardContent v-if="alumnos.length">
        <!-- selector mes -->
        <div class="mb-6 flex flex-col items-end space-y-2">
          <Label>Mes seleccionado</Label>
          <Select
            v-model="mesSeleccionado"
            @update:model-value="fetchAsistenciasMes(mesSeleccionado)"
          >
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
                <SelectItem value="5">Mayo</SelectItem>
                <SelectItem value="6">Junio</SelectItem>
                <SelectItem value="7">Julio</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Septiembre</SelectItem>
                <SelectItem value="10">Octubre</SelectItem>
                <SelectItem value="11">Noviembre</SelectItem>
                <SelectItem value="12">Diciembre</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Transition name="fade" mode="out-in">
          <div v-if="asistenciasMes">
            <!-- encabezados -->
            <div :class="`telbook-label mb-1 grid grid-cols-[repeat(43,minmax(0,1fr))] gap-1`">
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
            <AsistenciaMensualItem
              v-for="alumno in alumnos"
              :key="alumno.rut_alumno"
              :alumno="alumno"
              :asistencias="asistenciasMes[alumno.rut_alumno]"
              :dias="cantidadDiasMesActual || 31"
            />

            <!-- resumenes por dia -->
            <AsistenciaMensualResumenAlumnos
              :alumnos
              :asistencias="asistenciasMes"
              :dias="cantidadDiasMesActual || 31"
            />
          </div>

          <InfoMensajeSinData v-else icono="vacio" mensaje="No hay asistencias este mes" />
        </Transition>
      </CardContent>

      <CardContent v-else>
        <InfoMensajeSinData
          icono="vacio"
          mensaje="No hay alumnos en el curso"
          :dias="cantidadDiasMesActual || 31"
        />
      </CardContent>
    </Card>
  </Transition>
</template>
