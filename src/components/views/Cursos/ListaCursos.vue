<script setup lang="ts">
import type { Tables } from '@/types/supabase'

import ListaCursosItem from './ListaCursosItem.vue'

const props = defineProps<{
  cursos: Tables<'tp_cursos'>[]
  niveles: Tables<'tp_niveles'>[]
}>()
</script>

<template>
  <ul class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
    <li v-for="curso in props.cursos" :key="curso.id">
      <ListaCursosItem :curso="curso" :niveles="props.niveles" />
    </li>
  </ul>
</template>
