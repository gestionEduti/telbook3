<script setup lang="ts">
import type { Tables } from '@/types/supabase' // types de supabase

import { ListX } from 'lucide-vue-next' // iconos

const authStore = useAuthStore()
const errorStore = useErrorStore()

// data
const cursos = ref<Tables<'tp_cursos'>[] | null>(null)
const niveles = ref<Tables<'tp_niveles'>[] | null>(null)

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

onMounted(async () => {
  await Promise.all([fetchNiveles(), fetchCursos()])
})
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <Transition name="fade" mode="out-in">
      <Card class="shadow-xl" v-if="cursos && niveles">
        <CardHeader>
          <CardTitle class="flex items-center justify-between"> Cursos </CardTitle>
          <CardDescription>Todos los cursos del establecimiento.</CardDescription>
          <Separator />
        </CardHeader>
        <CardContent data-test="cursos-card-content">
          <ListaCursos v-if="cursos.length && niveles.length" :cursos :niveles />
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
