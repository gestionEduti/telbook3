<script setup lang="ts">
import type { Tables } from '@/types/supabase'

const props = defineProps<{
  alumno: Tables<'mv_libro_matricula'>
}>()

const authStore = useAuthStore()
const { asistencias, cantidadDiasMesActual, cursoActual, modoEdicion } = storeToRefs(
  useAsistenciaMensualStore(),
)

interface Resumen {
  total: number
  presentes: number
  ausentes: number
  porcentajePresentes: number
  porcentajeAusentes: number
}

const resumen = ref<Resumen | null>(null)

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

watch(
  () => modoEdicion.value,
  () => (resumen.value = calcularTotalesAlumno()),
)

onMounted(() => {
  // calcula una vez los totales y los guarda en la variable resumen para usarla en el template
  resumen.value = calcularTotalesAlumno()
})
</script>

<template>
  <div v-if="resumen" :class="`mb-1 grid grid-cols-[repeat(43,minmax(0,1fr))] gap-1`">
    <div class="col-span-5 flex h-6 items-center justify-start">
      <p class="truncate text-left text-xs">
        {{ alumno.apellidos_alumno }} {{ alumno.nombres_alumno }}
      </p>
    </div>

    <AsistenciaMensualAlumnoBoton
      v-for="dia in cantidadDiasMesActual"
      :key="dia"
      :rut="props.alumno.rut_alumno"
      :rbd="authStore.perfil!.rbd_usuario"
      :curso="cursoActual"
      :dia
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

@media print { .card-content-to-export { background: white; padding: 20px; } }
