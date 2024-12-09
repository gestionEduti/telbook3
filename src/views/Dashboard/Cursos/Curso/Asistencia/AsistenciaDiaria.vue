<script setup lang="ts">
// vue imports
import { ref, onMounted } from 'vue'

// props
const props = defineProps<{ siglaCurso: string }>()

// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import Badge from '@/components/ui/badge/Badge.vue'
// icons
import { Pen } from 'lucide-vue-next'

// supabase
import type { Tables } from '@/types/supabase'
import { supabase } from '@/services/supabaseClient'
const querySelect = supabase
  .from('mv_libro_matricula')
  .select('*')
  .eq('rbd_establecimiento', 26005)
  .eq('nivel_alumno', props.siglaCurso)
  .order('apellidos_alumno', { ascending: true })

// data
const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)

// methods
const fetchSupabase = async () => {
  const { data, error } = await querySelect
  if (error) console.error(error)
  else alumnos.value = data
}

// lifecycle
onMounted(async () => {
  await fetchSupabase()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Asistencia diaria</CardTitle>
      <CardDescription>Descripcion asistencia diaria.</CardDescription>
    </CardHeader>
    <CardContent>
      <ul class="mb-3 divide-y">
        <li
          class="grid grid-cols-12 items-center gap-2 py-3 text-sm font-semibold tracking-tighter text-gray-400"
        >
          <span class="col-span-4">Nombre</span>
          <span class="col-span-2">Estado</span>
          <span class="col-span-6">Comentario</span>
        </li>
        <li
          v-for="alumno in alumnos"
          :key="alumno.id"
          class="grid grid-cols-12 items-center gap-2 py-3"
        >
          <span class="col-span-4 truncate capitalize">
            {{ alumno.nombre_completo_alumno?.toLowerCase() }}
          </span>
          <Switch class="col-span-2" />
          <Input class="col-span-6 w-full" />
        </li>
      </ul>
    </CardContent>
    <CardFooter class="flex items-center justify-between">
      <div class="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Badge>{{ 10 }} presentes</Badge>
        <Badge>{{ 4 }} ausentes</Badge>
      </div>
      <Button>
        <Pen />
        <span>Firmar asistencia</span>
      </Button>
    </CardFooter>
  </Card>
</template>

<style></style>
