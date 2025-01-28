<script setup lang="ts">
const props = defineProps(['asistencias', 'alumnos', 'dias'])

interface Resumen {
  [dia: string]: {
    total: number
    ausentes: number
    presentes: number
    nulls: number
  }
}

const resumen = ref<Resumen | null>(null)

function reducirAsistencia(asistencias: {
  [alumnoId: string]: {
    [key: string]: number | null
  }
}) {
  // se inicia un objeto vacio
  const reduccion: Resumen = {}

  // se itera en las asistencias (cada una es un rut)
  for (const rut in asistencias) {
    // se almacenas las asistencias de un rut
    const asistenciasRut = asistencias[rut]

    // se itera por cada dia del mes en el rut
    for (const dia in asistenciasRut) {
      // se almacena la asistencia del dia
      const asistencia = asistenciasRut[dia]

      // si el dia no existe en la reduccion, se inicializa
      if (!reduccion[dia]) {
        reduccion[dia] = { total: 0, ausentes: 0, presentes: 0, nulls: 0 }
      }

      // se verifica como viene la asistencia y se suma en la reduccion
      if (asistencia === null) {
        reduccion[dia]['nulls']++
      } else if (asistencia === 0) {
        reduccion[dia]['total']++
        reduccion[dia]['ausentes']++
      } else if (asistencia === 1) {
        reduccion[dia]['total']++
        reduccion[dia]['presentes']++
      }
    }
  }

  // se devuelve la reduccion
  return reduccion
}

onMounted(() => {
  // calcula una vez los totales y los guarda en la variable resumen para usarla en el template
  resumen.value = reducirAsistencia(props.asistencias)
})
</script>

<template>
  <div v-if="resumen" class="pt-2">
    <!-- presente -->
    <div :class="`mb-1 grid grid-cols-[repeat(43,minmax(0,1fr))] gap-1`">
      <p class="telbook-label col-span-5">Presente</p>
      <p v-for="dia in dias" :key="dia" class="col-span-1 text-center text-xs tracking-tighter">
        {{ resumen[dia].presentes }}
      </p>
    </div>

    <!-- ausente -->
    <div :class="`mb-1 grid grid-cols-[repeat(43,minmax(0,1fr))] gap-1`">
      <p class="telbook-label col-span-5">Ausente</p>
      <p v-for="dia in dias" :key="dia" class="col-span-1 text-center text-xs tracking-tighter">
        {{ resumen[dia].ausentes }}
      </p>
    </div>

    <!-- total -->
    <div :class="`mb-1 grid grid-cols-[repeat(43,minmax(0,1fr))] gap-1`">
      <p class="telbook-label col-span-5">Total</p>
      <p v-for="dia in dias" :key="dia" class="col-span-1 text-center text-xs tracking-tighter">
        {{ resumen[dia].total }}
      </p>
    </div>
  </div>
</template>
