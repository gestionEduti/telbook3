<script setup lang="ts">
// vue imports
import { onMounted, ref } from 'vue'

// utils
import { formatearRut } from '@/lib/formato'

// shadcn
import Button from '@/components/ui/button/Button.vue'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuGroup from '@/components/ui/dropdown-menu/DropdownMenuGroup.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuLabel from '@/components/ui/dropdown-menu/DropdownMenuLabel.vue'
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import Table from '@/components/ui/table/Table.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableCaption from '@/components/ui/table/TableCaption.vue'
import TableCell from '@/components/ui/table/TableCell.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
// icons
import {
  Download,
  UserPlus,
  EllipsisVertical,
  UserX,
  UserPen,
  Trash2,
  BookCheck,
  FileText,
} from 'lucide-vue-next'

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
const querySelect = supabase.from('mv_libro_matricula').select('*').order('id', { ascending: true })
const queryDelete = (id: number) => supabase.from('mv_libro_matricula').delete().eq('id', id)

// data
const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)

// methods
const fetchSupabase = async () => {
  const { data, error } = await querySelect
  if (error) console.error(error)
  else alumnos.value = data
}

const deleteSupabase = async (id: number) => {
  const { error } = await queryDelete(id)
  if (error) console.error(error)
  else await fetchSupabase()
}

// lifecycle
onMounted(async () => {
  await fetchSupabase()
})
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <Transition name="fade" mode="out-in">
      <Card v-if="alumnos?.length">
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span> Matriculas </span>
            <div class="flex items-center space-x-2">
              <Button @click="$router.push('/dashboard/matriculas/nueva')">
                <UserPlus class="h-4 w-4" />
                <span class="ml-2 hidden md:block">Nuevo alumno</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button>
                    <Download class="h-4 w-4" />
                    <span class="ml-2 hidden md:block">Descargar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-56">
                  <DropdownMenuLabel>Descargar Libro</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BookCheck class="h-4 w-4" />
                      <span class="ml-2 hidden md:block">Libro completo</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText class="h-4 w-4" />
                      <span class="ml-2 hidden md:block">Resumen</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
          <CardDescription>Lista de matriculas del establecimiento.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table class="border border-slate-300 bg-white">
            <TableCaption>
              {{ alumnos?.length ? 'Lista de matriculas.' : 'No hay alumnos' }}
            </TableCaption>
            <TableHeader class="bg-slate-100">
              <TableRow>
                <TableHead class="w-[1px] py-2 text-center"> Nº </TableHead>
                <TableHead class="w-[130px] py-2 text-right">RUT</TableHead>
                <TableHead class="py-2 text-left">Nombre</TableHead>
                <TableHead class="w-[10px] py-2 text-center">Procedencia </TableHead>
                <TableHead class="w-[120px] py-2 text-center">Fecha Nacimiento </TableHead>
                <TableHead class="w-[120px] py-2 text-center">Fecha ingreso</TableHead>
                <TableHead class="w-[10px] py-2 text-center">Estado </TableHead>
                <TableHead class="w-[10px] py-2 text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <Transition name="fade" mode="out-in">
              <TableBody>
                <TableRow v-for="alumno in alumnos" :key="alumno.id">
                  <TableCell class="text-center font-medium"> {{ alumno.id }} </TableCell>
                  <TableCell class="text-right">{{ formatearRut(alumno.rut_alumno) }}</TableCell>
                  <TableCell class="text-left">{{ alumno.nombre_completo_alumno }}</TableCell>
                  <TableCell class="text-center"> {{ alumno.procedencia_alumno }} </TableCell>
                  <TableCell class="text-center">{{ alumno.fecha_nacimiento_alumno }} </TableCell>
                  <TableCell class="text-center"
                    >{{ alumno.fecha_incorporacion_alumno }}
                  </TableCell>
                  <TableCell class="text-center"> {{ alumno.estado_alumno }} </TableCell>
                  <TableCell class="text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button variant="outline">
                            <EllipsisVertical class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="w-56">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem @click.stop="deleteSupabase(alumno.id)">
                              <Trash2 class="h-4 w-4" />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserPen class="h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserX class="h-4 w-4" />
                              <span>Retirar</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Transition>
          </Table>
        </CardContent>
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
