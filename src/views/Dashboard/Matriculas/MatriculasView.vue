<script setup lang="ts">
// vue imports
import { onMounted, ref } from 'vue'
import ResumenMatriculas from '@/components/views/Matriculas/ResumenMatriculas.vue'
import TablaMatriculas from '@/components/views/Matriculas/TablaMatriculas.vue'

// shadcn
import Button from '@/components/ui/button/Button.vue'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuGroup from '@/components/ui/dropdown-menu/DropdownMenuGroup.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuLabel from '@/components/ui/dropdown-menu/DropdownMenuLabel.vue'
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import Separator from '@/components/ui/separator/Separator.vue'
// icons
import {
  Download,
  UserPlus,
  BookCheck,
  FileText,
  ListX,
  ChevronDown,
  FileSpreadsheet,
} from 'lucide-vue-next'

// store
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import { useErrorStore } from '@/stores/error'
const errorStore = useErrorStore()

// data
const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
// supabase queries
const querySelect = supabase
  .from('mv_libro_matricula')
  .select()
  .or('codigo_estado_alumno.eq.0,codigo_estado_alumno.eq.1')
  .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario) // // TODO: setear error si es que el perfil no existe
  .order('id', { ascending: true })

// methods
const fetchSupabase = async () => {
  const { data, error, status } = await querySelect
  if (error) errorStore.setError({ error: error, customCode: status })
  else alumnos.value = data
}

const exportarResumen = () => {
  console.log('exportar resumen')
}

// lifecycle
onMounted(async () => {
  await fetchSupabase()
})
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <Transition name="fade" mode="out-in">
      <Card v-if="alumnos">
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span> Matriculas </span>
            <div class="flex items-center space-x-2">
              <Button @click="$router.push('/dashboard/matriculas/nueva')">
                <UserPlus class="h-4 w-4" />
                <span class="ml-2 hidden md:block">Nuevo alumno</span>
              </Button>
              <DropdownMenu v-if="alumnos.length">
                <DropdownMenuTrigger as-child>
                  <Button variant="outline">
                    <Download class="h-4 w-4" />
                    <span class="ml-2 hidden md:block">Descargar</span>
                    <ChevronDown class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-56">
                  <DropdownMenuLabel>Descargar Libro</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem disabled>
                      <FileSpreadsheet class="h-4 w-4" />
                      <span class="ml-2 hidden md:block">Libro completo (Excel)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="exportarResumen">
                      <FileText class="h-4 w-4" />
                      <span class="ml-2 hidden md:block">Resumen (PDF)</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
          <CardDescription>Lista de matriculas del establecimiento.</CardDescription>
          <Separator />
        </CardHeader>
        <CardContent v-if="alumnos?.length">
          <ResumenMatriculas
            :total-matriculas="alumnos.length"
            :total-activos="alumnos.filter((a) => a.codigo_estado_alumno == 1).length"
            :total-retirados="alumnos.filter((a) => a.codigo_estado_alumno == 0).length"
          />
          <Separator class="mb-2 mt-6" />

          <!-- tabla -->
          <TablaMatriculas
            v-if="alumnos"
            :alumnos
            @alumno-eliminado="fetchSupabase()"
            @alumno-retirado="fetchSupabase()"
          />
        </CardContent>
        <CardContent v-else>
          <!-- TODO: extraer a un componente de cuando no hay resultados -->
          <div class="flex flex-col items-center justify-center space-y-2 py-8">
            <ListX :size="32" class="text-gray-500" />
            <p class="text-muted-foreground">No hay alumnos matriculados.</p>
          </div>
        </CardContent>
      </Card>
    </Transition>
  </div>
</template>
