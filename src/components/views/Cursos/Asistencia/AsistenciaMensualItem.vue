<script setup lang="ts">
import type { Tables } from '@/types/supabase'

const props = defineProps<{
  alumno: Tables<'mv_libro_matricula'>
}>()

const { asistencias, cantidadDiasMesActual } = storeToRefs(useAsistenciaMensualStore())

interface Resumen {
  total: number
  presentes: number
  ausentes: number
  porcentajePresentes: number
  porcentajeAusentes: number
}

const resumen = ref<Resumen | null>(null)

/**
 * extrae la asistencia de un dia especifico de un alumno especifico desde el state
 */
function extraerAsistenciaAlumnoDia(rut: string, dia: number) {
  if (asistencias.value === undefined || asistencias.value === null) return null
  const asistenciasRut = asistencias.value[rut]
  if (!asistenciasRut) return null
  const asistenciaDia = asistenciasRut[dia]
  if (asistenciaDia === null) return null
  return asistenciaDia
}

/**
 * reduce las asistencias del mes y devuelve un objeto con
 */
function calcularTotalesAlumno() {
  if (!asistencias.value) {
    return { total: 0, presentes: 0, ausentes: 0, porcentajePresentes: 0, porcentajeAusentes: 0 }
  }

  const asistenciasAlumno = asistencias.value[props.alumno.rut_alumno]
  if (!asistenciasAlumno) {
    return { total: 0, presentes: 0, ausentes: 0, porcentajePresentes: 0, porcentajeAusentes: 0 }
  }

  const totales = Object.values(asistenciasAlumno).reduce(
    (
      acumulado: {
        total: number
        presentes: number
        ausentes: number
        porcentajePresentes: number
        porcentajeAusentes: number
      },
      item,
    ) => {
      if (item === 1) {
        acumulado.presentes++
        acumulado.total++
      }
      if (item === 0) {
        acumulado.ausentes++
        acumulado.total++
      }
      return acumulado
    },
    { total: 0, presentes: 0, ausentes: 0, porcentajePresentes: 0, porcentajeAusentes: 0 },
  )

  totales.porcentajePresentes = Number(((totales.presentes / totales.total) * 100).toFixed(0))
  totales.porcentajeAusentes = Number(((totales.ausentes / totales.total) * 100).toFixed(0))

  return totales
}

onMounted(() => {
  // calcula una vez los totales y los guarda en la variable resumen para usarla en el template
  resumen.value = calcularTotalesAlumno()
})
</script>

<template>
  <div v-if="resumen" :class="`mb-1 grid grid-cols-[repeat(43,minmax(0,1fr))] gap-1`">
    <p class="col-span-5 truncate pr-2">{{ alumno.nombre_completo_alumno }}</p>
    <AsistenciaMensualItemButton
      v-for="dia in cantidadDiasMesActual"
      :key="dia"
      :asistenciaRecibida="extraerAsistenciaAlumnoDia(props.alumno.rut_alumno, dia)"
    />

    <!-- resumenes por alumno -->
    <p class="col-span-1 -col-start-8 place-content-center text-center text-xs tracking-tighter">
      {{ resumen.total }}
    </p>
    <p class="col-span-1 -col-start-7 place-content-center text-center text-xs tracking-tighter">
      {{ resumen.presentes }}
    </p>
    <p class="col-span-1 -col-start-6 place-content-center text-center text-xs tracking-tighter">
      {{ resumen.ausentes }}
    </p>
    <p class="col-span-2 -col-start-5 place-content-center text-center text-xs tracking-tighter">
      {{ resumen.porcentajePresentes }}%
    </p>
    <p class="col-span-2 -col-start-3 place-content-center text-center text-xs tracking-tighter">
      {{ resumen.porcentajeAusentes }}%
    </p>
  </div>
</template>
