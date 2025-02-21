<script setup lang="ts">
import type { Tables } from '@/types/supabase' // types de supabase

const errorStore = useErrorStore()

interface ProfesoresCursosEstablecimientoInterface {
  curso_asignado: string
  rut_profesor: string
  nombre_usuario: string
  apellido_usuario: string
}

const props = defineProps<{
  cursos: Tables<'tp_cursos'>[]
  niveles: Tables<'tp_niveles'>[]
  profesores: ProfesoresCursosEstablecimientoInterface[]
}>()

// methods
const cursosFiltradosPorNivel = (nivel: Tables<'tp_niveles'>) => {
  return props.cursos.filter((curso) => {
    return curso.sigla_nivel_curso === nivel.sigla_nivel
  })
}

const profesorDelCurso = (curso: Tables<'tp_cursos'>) => {
  if (props.profesores === null) {
    return []
  } else {
    return props.profesores.filter((profesor) => {
      return profesor.curso_asignado === curso.nombre_curso
    })
  }
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
          class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          <li v-for="curso in cursosFiltradosPorNivel(nivel)" :key="curso.id">
            <ListaCursosItem
              v-if="props.profesores"
              :curso
              :niveles="props.niveles"
              :profesor="profesorDelCurso(curso)"
            />
          </li>
        </ul>
        <Separator class="my-4" />
      </div>
    </template>
  </template>
</template>
