<script setup lang="ts">
import type { Tables } from '@/types/supabase' // types de supabase

const props = defineProps<{
  curso: Tables<'tp_cursos'>
  niveles: Tables<'tp_niveles'>[]
  profesor: Tables<'view_profesor_curso'>
}>()

// data
const colorCurso: Record<string, string> = {
  MM: 'bg-gray-100',
  '1NT': 'bg-gray-200',
  '2NT': 'bg-gray-300',
}
</script>

<template>
  <RouterLink
    :to="{
      name: 'curso',
      params: {
        nivel: props.curso.sigla_nivel_curso,
        letra: props.curso.letra_nivel_curso,
      },
    }"
  >
    <Card :class="`${colorCurso[props.curso.sigla_nivel_curso]}`">
      <CardContent>
        <div class="mt-6 text-center">
          <p class="text-2xl font-bold">{{ curso.letra_nivel_curso }}</p>
        </div>
      </CardContent>
      <CardFooter class="h-full justify-center">
        <span v-if="profesor" class="text-sm">{{ profesor.nombre_profesor }}</span>
        <span v-else class="text-sm tracking-tighter text-gray-500">sin profesor asignado</span>
      </CardFooter>
    </Card>
  </RouterLink>
</template>
