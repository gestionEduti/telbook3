<script setup lang="ts">
const props = defineProps(['asistenciaRecibida'])

const asistencia = ref(props.asistenciaRecibida)

const colorClass = computed(() => {
  if (asistencia.value === 1) return 'bg-emerald-400'
  else if (asistencia.value === 0) return 'bg-red-400'
  else if (asistencia.value === null) return 'bg-gray-300'
})

function handleClick() {
  if (asistencia.value === null) {
    asistencia.value = 1
  } else if (asistencia.value === 1) {
    asistencia.value = 0
  } else if (asistencia.value === 0) {
    asistencia.value = 1
  }
}
</script>

<template>
  <div :class="colorClass" @click="handleClick"></div>
</template>
