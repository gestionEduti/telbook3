<script setup lang="ts">
import type { Database } from '@/types/supabase'

const errorStore = useErrorStore()

type Resumen =
  Database['public']['Views']['view_panel_administracion_resumen_establecimientos']['Row'][]

// data
const resumen = ref<Resumen | null>(null)

// methods
const fetch = async () => {
  const { data, error, status } = await supabase
    .from('view_panel_administracion_resumen_establecimientos')
    .select()
    .order('rbd', { ascending: true })
  if (error) errorStore.setError({ error: error, customCode: status })
  else resumen.value = data
}

onMounted(async () => {
  await fetch()
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <Table v-if="resumen" class="border border-slate-300 bg-white">
      <TableCaption>
        {{
          resumen?.length
            ? `Hay un total de ${resumen?.length || 0} establecimientos en la tabla`
            : 'No hay establecimientos'
        }}
      </TableCaption>
      <TableHeader class="bg-slate-100">
        <TableRow>
          <TableHead class="w-[1px] py-2 text-left"> RBD </TableHead>
          <TableHead class="w-[1px] py-2 text-left"> Nombre </TableHead>
          <TableHead class="w-[1px] py-2 text-left"> Cursos </TableHead>
          <TableHead class="w-[1px] py-2 text-left"> Matriculas </TableHead>
        </TableRow>
      </TableHeader>
      <Transition name="company" mode="out-in">
        <TableBody>
          <TransitionGroup name="list">
            <TableRow v-for="establecimiento in resumen" :key="establecimiento.rbd!">
              <TableCell class="text-center font-medium">
                {{ establecimiento.rbd }}
              </TableCell>
              <TableCell class="w-full text-left font-medium">
                {{ establecimiento.razon_social }}
              </TableCell>
              <TableCell class="w-full text-center font-medium">
                {{ establecimiento.cursos || '-' }}
              </TableCell>
              <TableCell class="w-full text-center font-medium">
                {{ establecimiento.matriculas || '-' }}
              </TableCell>
            </TableRow>
          </TransitionGroup>
        </TableBody>
      </Transition>
    </Table>
  </Transition>
</template>
