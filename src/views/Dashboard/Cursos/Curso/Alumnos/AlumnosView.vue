<script setup lang="ts">
// vue imports
import { onMounted, ref } from 'vue'

// props
const props = defineProps<{ siglaCurso: string }>()

// utils
import { formatearRut } from '@/lib/formato'

// shadcn
import Table from '@/components/ui/table/Table.vue'
import TableCaption from '@/components/ui/table/TableCaption.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
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
  <Transition name="fade" mode="out-in">
    <Table v-if="alumnos?.length" class="border border-slate-300 bg-white shadow-xl">
      <TableCaption>
        {{ alumnos.length }} {{ alumnos.length > 1 ? 'alumnos en total' : 'alumno en total' }}
      </TableCaption>
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
            @click="$router.push({ name: 'alumno', params: { rutAlumno: alumno.rut_alumno } })"
          >
            <TableCell class="text-center font-medium"> {{ alumno.id }} </TableCell>
            <TableCell class="text-right">{{ formatearRut(alumno.rut_alumno) }}</TableCell>
            <TableCell class="text-left capitalize">{{
              alumno.nombre_completo_alumno?.toLowerCase()
            }}</TableCell>
          </TableRow>
        </TableBody>
      </Transition>
    </Table>
  </Transition>
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
