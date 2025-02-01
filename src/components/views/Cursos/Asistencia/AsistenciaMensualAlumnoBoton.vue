<script setup lang="ts">
const props = defineProps(['rut', 'rbd', 'curso', 'dia'])

const asistencia = ref<number | null>(null)
const { asistencias, modoEdicion } = storeToRefs(useAsistenciaMensualStore())

const store = useAsistenciaMensualStore()

const colorClass = computed(() => {
  if (asistencia.value === null) return 'bg-gray-300'
  else if (asistencia.value === 1) return 'bg-emerald-400'
  else if (asistencia.value === 0) return 'bg-red-400'
  else if (asistencia.value === -1) return 'bg-gray-400'
})

const cursorClass = computed(() => {
  return modoEdicion.value ? 'cursor-pointer' : 'cursor-default'
})

/**
 * extrae la asistencia de un dia especifico de un alumno especifico desde el state
 */
function extraerAsistenciaAlumnoDia() {
  if (asistencias?.value === undefined || asistencias?.value === null) {
    asistencia.value = null
  } else {
    const asistenciasRut = asistencias.value[props.rut]
    if (asistenciasRut === null || asistenciasRut === undefined) {
      asistencia.value = null
    } else {
      const asistenciaDia = asistenciasRut[props.dia]
      asistencia.value = asistenciaDia
    }
  }
}

/**
 * Cambia el estado de la asistencia del alumno/dia especifico al hacer click en el recuadro
 */
function handleClick() {
  if (!modoEdicion.value) return
  if (asistencia.value === null) {
    // si no hay asistencia (gris), pasa a presente (verde)
    store.actualizarEstadoAsistencia(props.rut, props.dia, 1)
  } else if (asistencia.value === 1) {
    // si es presente (verde), pasa a ausente (rojo)
    store.actualizarEstadoAsistencia(props.rut, props.dia, 0)
  } else if (asistencia.value === 0) {
    // si es ausente (rojo), pasa a remove (gris oscuro)
    store.actualizarEstadoAsistencia(props.rut, props.dia, -1)
  } else if (asistencia.value === -1) {
    // si esta para remover (gris oscuro), pasa a presente
    store.actualizarEstadoAsistencia(props.rut, props.dia, 1)
  }
  extraerAsistenciaAlumnoDia()
}

onMounted(() => {
  extraerAsistenciaAlumnoDia()
})
</script>

<template>
  <div :class="[colorClass, cursorClass]" @click="handleClick"></div>
</template>
