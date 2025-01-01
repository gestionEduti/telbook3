<script setup lang="ts">
import { onMounted, ref } from 'vue'

// shadcn
import Table from '@/components/ui/table/Table.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCaption from '@/components/ui/table/TableCaption.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'

// store
import { useErrorStore } from '@/stores/error'
const errorStore = useErrorStore()

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
const query = supabase.from('tp_establecimientos').select().order('rbd', { ascending: true })

// data
const establecimientos = ref<Tables<'tp_establecimientos'>[] | null>(null)

// methods
const fetch = async () => {
  const { data, error, status } = await query
  if (error) errorStore.setError({ error: error, customCode: status })
  else establecimientos.value = data
}

// lifecycle
onMounted(async () => {
  await fetch()
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <Table v-if="establecimientos" class="border border-slate-300 bg-white">
      <TableCaption>
        {{
          establecimientos?.length
            ? `Hay un total de ${establecimientos?.length || 0} establecimientos en la tabla`
            : 'No hay establecimientos'
        }}
      </TableCaption>
      <TableHeader class="bg-slate-100">
        <TableRow>
          <TableHead class="w-[1px] py-2 text-left"> RBD </TableHead>
          <TableHead class="w-[1px] py-2 text-left"> Nombre </TableHead>
        </TableRow>
      </TableHeader>
      <Transition name="company" mode="out-in">
        <TableBody>
          <TransitionGroup name="list">
            <TableRow v-for="establecimiento in establecimientos" :key="establecimiento.id">
              <TableCell class="text-center font-medium">
                {{ establecimiento.rbd }}
              </TableCell>
              <TableCell class="w-full text-left font-medium">
                {{ establecimiento.razon_social }}
              </TableCell>
            </TableRow>
          </TransitionGroup>
        </TableBody>
      </Transition>
    </Table>
  </Transition>
</template>
