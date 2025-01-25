<script setup lang="ts">
import type { Tables } from '@/types/supabase'

const props = defineProps<{
  alumno: Tables<'mv_libro_matricula'>
  asistencias: { [key: string]: number }
  dias: number
}>()

/**
 * extrae la asistencia de un dia especifico de un alumno especifico desde el state
 */
function extraerAsistenciaAlumnoDia(rut: string, dia: number) {
  const asistenciaDia = props.asistencias[dia]
  if (asistenciaDia === 0) return false // ausente
  if (asistenciaDia === 1) return true // presente
}

function calcularTotalesAlumno() {
  if (!props.asistencias) return { total: 0, presentes: 0, ausentes: 0 }
  const totales = Object.values(props.asistencias).reduce(
    (
      acc: {
        total: number
        presentes: number
        ausentes: number
        porcentajePresentes: number
        porcentajeAusentes: number
      },
      curr,
    ) => {
      if (curr === 1) {
        acc.presentes++
        acc.total++
      }
      if (curr === 0) {
        acc.ausentes++
        acc.total++
      }
      return acc
    },
    { total: 0, presentes: 0, ausentes: 0, porcentajePresentes: 0, porcentajeAusentes: 0 },
  )

  totales.porcentajePresentes = Number(((totales.presentes / totales.total) * 100).toFixed(1))
  totales.porcentajeAusentes = Number(((totales.ausentes / totales.total) * 100).toFixed(1))

  return totales
}
</script>

<template>
  <div :class="`mb-1 grid grid-cols-[repeat(43,minmax(0,1fr))] gap-1`">
    <p class="col-span-5 truncate">{{ alumno.nombre_completo_alumno }}</p>
    <input
      v-for="dia in dias"
      :key="dia"
      type="checkbox"
      class="col-span-1"
      :checked="extraerAsistenciaAlumnoDia(alumno.rut_alumno, dia)"
    />
    <p class="col-span-1 -col-start-8 place-content-center text-center text-xs tracking-tighter">
      {{ calcularTotalesAlumno().total }}
    </p>
    <p class="col-span-1 -col-start-7 place-content-center text-center text-xs tracking-tighter">
      {{ calcularTotalesAlumno().presentes }}
    </p>
    <p class="col-span-1 -col-start-6 place-content-center text-center text-xs tracking-tighter">
      {{ calcularTotalesAlumno().ausentes }}
    </p>
    <p class="col-span-2 -col-start-5 place-content-center text-center text-xs tracking-tighter">
      {{ calcularTotalesAlumno().porcentajePresentes }}%
    </p>
    <p class="col-span-2 -col-start-3 place-content-center text-center text-xs tracking-tighter">
      {{ calcularTotalesAlumno().porcentajeAusentes }}%
    </p>
  </div>
</template>
