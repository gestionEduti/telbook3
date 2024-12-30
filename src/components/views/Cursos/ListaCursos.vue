<script setup lang="ts">
// supabase
import type { Tables } from '@/types/supabase'

// shadcn
import ListaCursosItem from './ListaCursosItem.vue'
import Separator from '@/components/ui/separator/Separator.vue'

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
  <div class="flex flex-col gap-2">
    <template v-for="nivel in props.niveles" :key="nivel.id">
      <p class="font-semibold capitalize tracking-tight">
        {{ nivel.nombre_nivel?.toLocaleLowerCase() }}
      </p>
      <ul class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <li v-for="curso in cursosFiltradosPorNivel(nivel)" :key="curso.id">
          <ListaCursosItem :curso="curso" :niveles="props.niveles" />
        </li>
      </ul>
      <Separator class="my-4" />
    </template>
  </div>
</template>
