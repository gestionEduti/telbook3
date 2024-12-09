<script setup lang="ts">
// vue imports
import { onMounted, ref } from 'vue'

// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
const query = supabase.from('tp_cursos').select('*').order('id', { ascending: true })

// data
const cursos = ref<Tables<'tp_cursos'>[] | null>(null)

// methods
const fetchSupabase = async () => {
  const { data, error } = await query
  if (error) console.error(error)
  else cursos.value = data
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

// lifecycle
onMounted(async () => {
  await fetchSupabase()
})
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <Card>
      <CardContent class="mt-4 flex items-end justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">Cursos</h2>
      </CardContent>
    </Card>

    <Transition name="fade" mode="out-in">
      <Card class="shadow-xl" v-if="cursos">
        <CardHeader></CardHeader>
        <CardContent>
          <ul class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <li v-for="curso in cursos" :key="curso.id">
              <RouterLink
                :to="{
                  name: 'curso',
                  params: { siglaCurso: curso.sigla_nivel_curso + curso.letra_nivel_curso },
                }"
              >
                <Card :class="[colorCurso(curso.sigla_nivel_curso)]">
                  <CardHeader>
                    <CardTitle class="text-center text-sm font-medium">
                      {{ curso.sigla_nivel_curso }}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-center text-2xl font-bold">{{ curso.letra_nivel_curso }}</div>
                  </CardContent>
                  <CardFooter class="justify-center text-xs text-muted-foreground">
                    Nombre profesor jefe
                  </CardFooter>
                </Card>
              </RouterLink>
            </li>
          </ul>
        </CardContent>
        <CardFooter></CardFooter>
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
