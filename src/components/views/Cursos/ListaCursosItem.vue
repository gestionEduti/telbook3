<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'

import type { Tables } from '@/types/supabase'

const props = defineProps<{
  curso: Tables<'tp_cursos'>
  niveles: Tables<'tp_niveles'>[]
}>()

const nombreNivel = (sigla: string) => {
  if (!props.niveles) return ''
  const nivel = props.niveles.find((nivel) => nivel.sigla_nivel === sigla)
  return nivel?.nombre_nivel.toLocaleLowerCase() || ''
}

const colorCurso = (nivel: string) => {
  switch (nivel) {
    case 'MM':
      return 'bg-gray-100'
    case '1NT':
      return 'bg-gray-200'
    case '2NT':
      return 'bg-gray-300'
    default:
      return 'bg-white'
  }
}
</script>

<template>
  <RouterLink
    :to="{
      name: 'curso',
      params: {
        siglaCurso: curso.nombre_curso,
      },
    }"
  >
    <Card :class="[colorCurso(curso.sigla_nivel_curso || '')]">
      <CardHeader> </CardHeader>
      <CardContent>
        <div class="text-center text-2xl font-bold">
          {{ curso.letra_nivel_curso }}
        </div>
      </CardContent>
      <CardFooter class="h-12 justify-center text-xs text-muted-foreground">
        Nombre profesor jefe
      </CardFooter>
    </Card>
  </RouterLink>
</template>
