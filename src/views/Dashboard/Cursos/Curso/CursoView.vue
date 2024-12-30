<script setup lang="ts">
// vue imports
import { onMounted, ref } from 'vue'

// components
import CursoMenu from './CursoMenu.vue'
// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'

// store
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'
const errorStore = useErrorStore()
const authStore = useAuthStore()

// props
const props = defineProps<{ siglaCurso: string }>()

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
const queryNiveles = supabase.from('tp_niveles').select()
const queryCurso = supabase
  .from('tp_cursos')
  .select()
  .eq('rbd_establecimiento', String(authStore.establecimiento?.rbd))
  .eq('anio_curso', 2025) // TODO cambiar a año sacado desde la futura tabla de configuraciones
  .ilike('nombre_curso', props.siglaCurso)
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
        <CursoMenu :siglaCurso />
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
