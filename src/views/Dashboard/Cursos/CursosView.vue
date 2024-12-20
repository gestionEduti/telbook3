<script setup lang="ts">
// vue imports
import { onMounted, ref } from 'vue'

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

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
const queryNiveles = supabase.from('tp_niveles').select()
const queryCursos = supabase
  .from('tp_cursos')
  .select('*')
  .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario) // TODO: setear error si es que el perfil no existe
  .order('sigla_nivel_curso', { ascending: true })
  .order('letra_nivel_curso', { ascending: true })

// data
const cursos = ref<Tables<'tp_cursos'>[] | null>(null)
const niveles = ref<Tables<'tp_niveles'>[] | null>([])

// methods
const fetchCursos = async () => {
  const { data, error } = await queryCursos
  if (error) console.error(error)
  else cursos.value = data
}
const fetchNiveles = async () => {
  const { data, error } = await queryNiveles
  if (error) console.error(error)
  else niveles.value = data
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

const nombreNivel = (sigla: string) => {
  const nivel = niveles.value?.find((nivel) => nivel.sigla_nivel === sigla)
  return nivel?.nombre_nivel.toLocaleLowerCase() || ''
}

// lifecycle
onMounted(async () => {
  await Promise.all([fetchNiveles(), fetchCursos()])
})
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <Transition name="fade" mode="out-in">
      <Card class="shadow-xl" v-if="cursos !== null">
        <CardHeader>
          <CardTitle class="flex items-center justify-between"> Cursos </CardTitle>
          <CardDescription>Todos los cursos del establecimiento.</CardDescription>
          <Separator />
        </CardHeader>
        <CardContent v-if="cursos.length">
          <ul class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <li v-for="curso in cursos" :key="curso.id">
              <RouterLink
                :to="{
                  name: 'curso',
                  params: {
                    siglaCurso: curso.nombre_curso,
                  },
                }"
              >
                <Card :class="[colorCurso(curso.sigla_nivel_curso || '')]">
                  <CardHeader>
                    <CardTitle class="h-12 text-center text-sm font-medium capitalize">
                      {{ nombreNivel(curso.sigla_nivel_curso) || '' }}
                    </CardTitle>
                  </CardHeader>
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
            </li>
          </ul>
        </CardContent>
        <CardContent v-else>
          <!-- TODO: extraer a un componente de cuando no hay resultados -->
          <div class="flex flex-col items-center justify-center space-y-2 py-8">
            <ListX :size="32" class="text-gray-500" />
            <p class="text-muted-foreground">No hay cursos creados.</p>
          </div>
        </CardContent>
        <CardFooter v-if="cursos.length">
          <p class="mx-auto text-sm text-muted-foreground">
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
</style>
