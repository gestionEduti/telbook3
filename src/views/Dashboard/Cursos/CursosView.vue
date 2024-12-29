<script setup lang="ts">
// vue imports
import { onMounted, ref } from 'vue'

// componentes
import ListaCursos from '@/components/views/Cursos/ListaCursos.vue'

// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import Separator from '@/components/ui/separator/Separator.vue'
// icons
import { ListX } from 'lucide-vue-next'

// store
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import { useErrorStore } from '@/stores/error'
const errorStore = useErrorStore()

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
const queryNiveles = supabase.from('tp_niveles').select()
const queryCursos = supabase
  .from('tp_cursos')
  .select('*')
  .eq('anio_curso', 2025) // TODO cambiar a año sacado desde la futura tabla de configuraciones
  .eq('rbd_establecimiento', String(authStore.establecimiento?.rbd)) // TODO: setear error si es que el perfil no existe
  .order('sigla_nivel_curso', { ascending: true })
  .order('letra_nivel_curso', { ascending: true })

// data
const cursos = ref<Tables<'tp_cursos'>[] | null>(null)
const niveles = ref<Tables<'tp_niveles'>[] | null>(null)

// methods
const fetchCursos = async () => {
  const { data, error, status } = await queryCursos
  if (error) errorStore.setError({ error: error, customCode: status })
  else cursos.value = data
}
const fetchNiveles = async () => {
  const { data, error, status } = await queryNiveles
  if (error) errorStore.setError({ error: error, customCode: status })
  else niveles.value = data
}

// lifecycle
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
        <CardContent data-test="cursos-lista">
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* spinner */
/* HTML: <div class="loader"></div> */
.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 8px solid;
  border-color: #000 #0000;
  animation: l1 1s infinite;
}
@keyframes l1 {
  to {
    transform: rotate(0.5turn);
  }
}
</style>
