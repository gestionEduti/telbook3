<script setup lang="ts">
import { onMounted, ref } from 'vue'

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
const query = supabase.from('tp_cursos').select('*').order('id', { ascending: true })

// data
const cursos = ref<Tables<'tp_cursos'>[] | null>(null)

// methods
const fetchSupabase = async () => {
  const { data, error } = await query
  if (error) {
    console.error(error)
  } else {
    cursos.value = data
  }
}

onMounted(async () => {
  await fetchSupabase()
})
</script>

<template>
  <div class="flex-1 space-y-4 p-8 pt-6">
    <div class="flex items-end justify-between space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Cursos</h2>
    </div>

    <Transition name="fade" mode="out-in">
      <ul v-if="cursos" class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <li v-for="curso in cursos" :key="curso.id">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium"> {{ curso.sigla_nivel_curso }} </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ curso.letra_nivel_curso }}</div>
              <p class="text-xs text-muted-foreground">Juanita Perez</p>
            </CardContent>
          </Card>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
