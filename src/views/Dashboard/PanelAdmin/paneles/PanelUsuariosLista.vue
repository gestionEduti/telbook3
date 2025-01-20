<script setup lang="ts">
// shadcn
import Table from '@/components/ui/table/Table.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCaption from '@/components/ui/table/TableCaption.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'

// store
const errorStore = useErrorStore()

// supabase
import { supabase } from '@/services/supabaseClient'
import type { QueryData } from '@supabase/supabase-js'
const query = supabase
  .from('mv_usuario')
  .select(`*,tp_perfil_usuario(descripcion_perfil_usuario)`)
  .order('rbd_usuario', { ascending: true })
  .order('nombre_usuario', { ascending: true })
  .order('apellido_usuario', { ascending: true })
  .order('email', { ascending: true })

// data
type UsuariosConPerfil = QueryData<typeof query>
const usuarios = ref<UsuariosConPerfil | null>(null)

// method
const fetch = async () => {
  const { data, error, status } = await query
  if (error) errorStore.setError({ error: error, customCode: status })
  else usuarios.value = data
}

// lifecycle
onMounted(async () => {
  await fetch()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardDescription>Lista de usuarios registrados en el sistema</CardDescription>
    </CardHeader>
    <CardContent>
      <Transition name="fade" mode="out-in">
        <Table v-if="usuarios" class="border border-slate-300 bg-white">
          <TableCaption>
            {{
              usuarios?.length
                ? `Hay un total de ${usuarios?.length || 0} usuarios en la tabla`
                : 'No hay usuarios'
            }}
          </TableCaption>
          <TableHeader class="bg-slate-100">
            <TableRow>
              <TableHead class="w-[1px] py-2 text-right"> RBD </TableHead>
              <TableHead class="w-[1px] py-2 text-left"> Nombre </TableHead>
              <TableHead class="w-auto py-2 text-left"> Email </TableHead>
              <TableHead class="w-[1px] py-2 text-left"> Telefono </TableHead>
              <TableHead class="w-auto py-2 text-left"> Perfil </TableHead>
            </TableRow>
          </TableHeader>
          <Transition name="company" mode="out-in">
            <TableBody>
              <TransitionGroup name="list">
                <TableRow v-for="usuario in usuarios" :key="usuario.id">
                  <TableCell class="text-right font-medium">
                    {{ usuario.rbd_usuario }}
                  </TableCell>
                  <TableCell class="text-nowrap text-left font-medium">
                    {{ usuario.nombre_usuario }} {{ usuario.apellido_usuario }}
                  </TableCell>
                  <TableCell class="text-left font-medium">
                    {{ usuario.email }}
                  </TableCell>
                  <TableCell class="text-left font-medium">
                    {{ usuario.telefono }}
                  </TableCell>
                  <TableCell class="text-left font-medium">
                    {{ usuario.tp_perfil_usuario?.descripcion_perfil_usuario }}
                  </TableCell>
                </TableRow>
              </TransitionGroup>
            </TableBody>
          </Transition>
        </Table>
      </Transition>
    </CardContent>
  </Card>
</template>

<style></style>
