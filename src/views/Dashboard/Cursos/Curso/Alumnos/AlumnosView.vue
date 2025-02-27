<script setup lang="ts">
const props = defineProps<{
  nivel: string
  letra: string
}>()

import type { Tables } from '@/types/supabase' // types de supabase

import { formatearRut } from '@/lib/formato' // utils

const authStore = useAuthStore()
const errorStore = useErrorStore()

import { ListX, UserPlus } from 'lucide-vue-next' // iconos

// data
const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)

// methods
const fetchSupabase = async () => {
  const { data, error, status } = await supabase
    .from('mv_libro_matricula')
    .select()
    .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario)
    .eq('codigo_estado_alumno', 1)
    .ilike('nivel_alumno', props.nivel + props.letra)
    .order('numero_lista_nivel_alumno', { ascending: true })
  if (error) errorStore.setError({ error: error, customCode: status })
  else alumnos.value = data
}

onMounted(async () => {
  await fetchSupabase()
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <Card v-if="alumnos !== null">
      <CardHeader>
        <CardTitle>Alumnos</CardTitle>
        <CardDescription>Lista de alumnos del curso.</CardDescription>
        <Separator />
      </CardHeader>
      <CardContent v-if="alumnos?.length">
        <Table class="border border-slate-300 bg-white">
          <TableCaption> {{ alumnos.length }} alumno(s) en la tabla </TableCaption>
          <TableHeader class="bg-slate-100">
            <TableRow>
              <TableHead class="w-[1px] py-2 text-center"> Nº </TableHead>
              <TableHead class="w-[130px] py-2 text-right">RUT</TableHead>
              <TableHead class="py-2 text-left">Nombre</TableHead>
            </TableRow>
          </TableHeader>
          <Transition name="fade" mode="out-in">
            <TableBody as-child>
              <TableRow
                v-for="alumno in alumnos"
                :key="alumno.id"
                class="cursor-pointer"
                @click="$router.push({ name: 'alumno', params: { rut: alumno.rut_alumno } })"
              >
                <TableCell class="text-center font-medium">
                  {{ alumno.numero_lista_nivel_alumno }}
                </TableCell>
                <TableCell class="text-right">{{ formatearRut(alumno.rut_alumno) }}</TableCell>
                <TableCell class="text-left capitalize">{{
                  alumno.nombre_completo_alumno?.toLowerCase()
                }}</TableCell>
              </TableRow>
            </TableBody>
          </Transition>
        </Table>
      </CardContent>
      <CardContent v-else>
        <!-- TODO: extraer a un componente de cuando no hay resultados -->
        <div class="flex flex-col items-center justify-center space-y-2 py-8">
          <ListX :size="32" class="text-gray-500" />
          <p class="pb-4 text-muted-foreground">No hay alumnos en el curso.</p>
          <Button @click="$router.push('/dashboard/matriculas/nueva')">
            <UserPlus class="h-4 w-4" />
            <span class="ml-2 hidden md:block">Matricular alumno</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </Transition>
</template>
