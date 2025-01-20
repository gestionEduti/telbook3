<script setup lang="ts">
// components
import CursoMenu from './CursoMenu.vue'
// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'

// store
const errorStore = useErrorStore()
const authStore = useAuthStore()

// props
const props = defineProps<{
  nivel: string
  letra: string
}>()

// supabase
import { supabase } from '@/services/supabaseClient'
const queryNiveles = supabase.from('tp_niveles').select()
const queryCurso = supabase
  .from('tp_cursos')
  .select()
  .eq('rbd_establecimiento', String(authStore.establecimiento?.rbd))
  .eq('anio_curso', 2025) // TODO cambiar a año sacado desde la futura tabla de configuraciones
  .ilike('sigla_nivel_curso', props.nivel)
  .ilike('letra_nivel_curso', props.letra)
  .single()

// data
const curso = ref<Tables<'tp_cursos'> | null>(null)
const niveles = ref<Tables<'tp_niveles'>[] | null>([])

// methods
const fetchCurso = async () => {
  const { data, error, status } = await queryCurso
  if (error) errorStore.setError({ error, customCode: status })
  else curso.value = data
}
const fetchNiveles = async () => {
  const { data, error, status } = await queryNiveles
  if (error) errorStore.setError({ error, customCode: status })
  else niveles.value = data
}

// lifecycle
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
