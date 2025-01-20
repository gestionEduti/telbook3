<script setup lang="ts">
// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'

// props
const props = defineProps<{
  curso: Tables<'tp_cursos'>
  niveles: Tables<'tp_niveles'>[]
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
        <div class="mt-6 text-center text-2xl font-bold">
          {{ curso.letra_nivel_curso }}
        </div>
      </CardContent>
    </Card>
  </RouterLink>
</template>
