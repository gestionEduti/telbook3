<script setup lang="ts">
import type { Tables } from '@/types/supabase' // types de supabase
import { Info } from 'lucide-vue-next'

interface ProfesoresCursosEstablecimientoInterface {
  curso_asignado: string
  rut_profesor: string
  nombre_usuario: string
  apellido_usuario: string
}

const props = defineProps<{
  curso: Tables<'tp_cursos'>
  niveles: Tables<'tp_niveles'>[]
  profesor: ProfesoresCursosEstablecimientoInterface[]
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
      <CardFooter class="h-full justify-center text-sm">
        <p v-if="props.profesor.length" class="flex items-center justify-center gap-2">
          <span>{{ profesor[0].nombre_usuario }} {{ profesor[0].apellido_usuario }}</span>
          <span
            v-if="props.profesor.length > 1"
            class="flex items-center justify-center rounded-full"
          >
            <TooltipProvider>
              <Tooltip :delay-duration="100">
                <TooltipTrigger>
                  <Info :size="17" />
                </TooltipTrigger>
                <TooltipContent>
                  <ul>
                    <li v-for="profesor in profesor" :key="profesor.rut_profesor">
                      {{ profesor.nombre_usuario }} {{ profesor.apellido_usuario }}
                    </li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </p>
        <p v-else class="text-sm tracking-tighter text-gray-500">sin profesor asignado</p>
      </CardFooter>
    </Card>
  </RouterLink>
</template>
