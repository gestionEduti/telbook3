<script setup lang="ts">
import type { Tables } from '@/types/supabase' // types de supabase

import { ListX } from 'lucide-vue-next' // iconos

const authStore = useAuthStore()
const errorStore = useErrorStore()

// data
const cursos = ref<Tables<'tp_cursos'>[] | null>(null)
const niveles = ref<Tables<'tp_niveles'>[] | null>(null)
// const profesores = ref<Tables<'view_profesor_curso'>[]>([])

// computed
const cursosFiltradosUsuario = computed(() => {
  if (authStore.perfil?.codigo_perfil_usuario !== 3) {
    return cursos.value
  } else {
    return cursos.value?.filter((curso) => {
      const nombreCurso = curso.sigla_nivel_curso + curso.letra_nivel_curso
      return authStore.perfil?.mv_profesor_cursos.some(
        (curso) => curso.curso_asignado === nombreCurso,
      )
    })
  }
})

// methods
const fetchCursos = async () => {
  const { data, error, status } = await supabase
    .from('tp_cursos')
    .select()
    .eq('anio_curso', 2025) // TODO cambiar a año sacado desde la futura tabla de configuraciones
    .eq('rbd_establecimiento', String(authStore.establecimiento?.rbd)) // TODO: setear error si es que el perfil no existe
    .order('sigla_nivel_curso', { ascending: true })
    .order('letra_nivel_curso', { ascending: true })
  if (error) errorStore.setError({ error: error, customCode: status })
  else cursos.value = data
}

const fetchNiveles = async () => {
  const { data, error, status } = await supabase.from('tp_niveles').select()
  if (error) errorStore.setError({ error: error, customCode: status })
  else niveles.value = data
}

// traer los profesores de cada curso de este establecimiento
interface ProfesoresCursosEstablecimientoInterface {
  curso_asignado: string
  rut_profesor: string
  nombre_usuario: string
  apellido_usuario: string
}
const profesoresCursosEstablecimiento = ref<ProfesoresCursosEstablecimientoInterface[] | null>(null)
async function fetchProfesoresCursosEstablecimiento() {
  const { data, error, status } = await supabase
    .from('mv_profesor_cursos')
    .select(
      `
    curso_asignado,
    rut_profesor,
    ...mv_usuario!inner(
      nombre_usuario,
      apellido_usuario
    )
    `,
    )
    .eq('rbd_establecimiento', authStore.perfil?.rbd_usuario)
    .order('rbd_establecimiento')
    .order('curso_asignado')
    .order('rut_profesor')
  if (error) errorStore.setError({ error: error, customCode: status })
  else profesoresCursosEstablecimiento.value = data
}

fetchProfesoresCursosEstablecimiento()
fetchNiveles()
fetchCursos()
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <Transition name="fade" mode="out-in">
      <Card class="shadow-xl" v-if="cursos && niveles && profesoresCursosEstablecimiento">
        <CardHeader>
          <CardTitle class="flex items-center justify-between"> Cursos </CardTitle>
          <CardDescription>Todos los cursos del establecimiento.</CardDescription>
          <Separator />
        </CardHeader>
        <CardContent data-test="cursos-card-content">
          <ListaCursos
            v-if="cursos.length && niveles.length"
            :cursos="cursosFiltradosUsuario"
            :niveles
            :profesores="profesoresCursosEstablecimiento"
          />
          <!-- TODO: extraer a un componente de cuando no hay resultados -->
          <div v-else class="flex flex-col items-center justify-center space-y-2 py-8">
            <ListX :size="32" class="text-gray-500" />
            <p class="text-muted-foreground">No hay cursos creados.</p>
          </div>
        </CardContent>
        <CardFooter>
          <p data-test="cursos-total-cursos" class="mx-auto text-sm text-muted-foreground">
            {{ cursos.length }} curso(s) en total.
          </p>
        </CardFooter>
      </Card>
    </Transition>
  </div>
</template>
