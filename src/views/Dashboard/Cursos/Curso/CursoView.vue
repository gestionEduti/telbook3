<script setup lang="ts">
// vue imports
import { onMounted, ref } from 'vue'

// components
import CursoMenu from './CursoMenu.vue'

// props
const props = defineProps<{ siglaCurso: string }>()

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
const query = supabase.from('tp_cursos').select('*').eq('nombre_curso', props.siglaCurso).single()

// data
const curso = ref<Tables<'tp_cursos'> | null>(null)

// methods
const fetchSupabase = async () => {
  const { data, error } = await query
  if (error) console.error(error)
  else curso.value = data
}

// lifecycle
onMounted(async () => {
  await fetchSupabase()
})
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <!-- menu superior -->
    <Card>
      <CardContent class="mt-4 flex items-end justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">Curso {{ props.siglaCurso }}</h2>
        <CursoMenu :siglaCurso />
      </CardContent>
    </Card>

    <!-- contenido -->
    <main class="contenedor">
      <RouterView v-slot="{ Component }" :key="$route.fullPath">
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
