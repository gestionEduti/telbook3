<script setup lang="ts">
import type { Tables } from '@/types/supabase'

// props
const props = defineProps<{
  cursos: Tables<'tp_cursos'>[]
  niveles: Tables<'tp_niveles'>[]
}>()

// methods
const cursosFiltradosPorNivel = (nivel: Tables<'tp_niveles'>) => {
  return props.cursos.filter((curso) => {
    return curso.sigla_nivel_curso === nivel.sigla_nivel
  })
}
</script>

<template>
  <template v-for="(nivel, index) in props.niveles" :key="nivel.id">
    <template v-if="cursosFiltradosPorNivel(nivel).length > 0">
      <!-- nivel -->
      <div :data-test="`cursos-card-content-item-${index}`" class="flex flex-col gap-2">
        <!-- nombre nivel -->
        <p data-test="cursos-lista-nombre-nivel" class="font-semibold capitalize tracking-tight">
          {{ nivel.nombre_nivel?.toLocaleLowerCase() }}
        </p>
        <!-- cursos nivel -->
        <ul
          data-test="cursos-lista-lista"
          class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
        >
          <li v-for="curso in cursosFiltradosPorNivel(nivel)" :key="curso.id">
            <ListaCursosItem :curso :niveles="props.niveles" />
          </li>
        </ul>
        <Separator class="my-4" />
      </div>
    </template>
  </template>
</template>
