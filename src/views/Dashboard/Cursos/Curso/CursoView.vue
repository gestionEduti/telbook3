<script setup lang="ts">
// components
import CursoMenu from './CursoMenu.vue'

import type { Tables } from '@/types/supabase'

const errorStore = useErrorStore()
const authStore = useAuthStore()

const props = defineProps<{
  nivel: string
  letra: string
}>()

// data
const curso = ref<Tables<'tp_cursos'> | null>(null)
const niveles = ref<Tables<'tp_niveles'>[] | null>([])

// methods
const fetchCurso = async () => {
  const { data, error, status } = await supabase
    .from('tp_cursos')
    .select()
    .eq('rbd_establecimiento', String(authStore.establecimiento?.rbd))
    .eq('anio_curso', 2025) // TODO cambiar a año sacado desde la futura tabla de configuraciones
    .ilike('sigla_nivel_curso', props.nivel)
    .ilike('letra_nivel_curso', props.letra)
    .single()
  if (error) errorStore.setError({ error, customCode: status })
  else curso.value = data
}
const fetchNiveles = async () => {
  const { data, error, status } = await supabase.from('tp_niveles').select()
  if (error) errorStore.setError({ error, customCode: status })
  else niveles.value = data
}

onMounted(async () => {
  await Promise.all([fetchNiveles(), fetchCurso()])
})
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3" v-if="curso">
    <!-- menu superior -->
    <Card>
      <CardContent class="mt-4 flex items-end justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">
          {{ curso?.sigla_nivel_curso }}{{ curso?.letra_nivel_curso }}
        </h2>
        <CursoMenu :nivel :letra />
      </CardContent>
    </Card>

    <!-- contenido -->
    <main class="contenedor">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
