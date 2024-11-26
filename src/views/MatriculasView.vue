<script setup lang="ts">
import { computed, ref } from 'vue'

// shadcn
import Button from '@/components/ui/button/Button.vue'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
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
import { Download, UserPlus, EllipsisVertical, UserX, UserPen, Trash2 } from 'lucide-vue-next'
// icons
import DropdownMenuGroup from '@/components/ui/dropdown-menu/DropdownMenuGroup.vue'

// data
const alumnos = ref([])
const ordenarPor = 'id'
const alumnosOrdenados = computed(() => {
  return [...alumnos.value].sort((a, b) => a[ordenarPor] - b[ordenarPor])
})

// methods
const formatearRut = (rut: string) => {
  if (!rut) return ''
  const rutFormateado = rut.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  return rutFormateado
}
</script>

<template>
  <div class="flex-1 space-y-4 p-4 pt-6">
    <div class="flex items-end justify-between space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Matriculas</h2>
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
              <DropdownMenuItem> Libro completo </DropdownMenuItem>
              <DropdownMenuItem> Resumen </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <Table class="border">
      <TableCaption>{{
        alumnosOrdenados.length ? 'Lista de matriculas.' : 'No hay alumnos'
      }}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[10px] text-center"> Matricula </TableHead>
          <TableHead class="w-[130px] text-right">RUT</TableHead>
          <TableHead class="text-left">Nombre</TableHead>
          <TableHead class="w-[10px] text-center">Procedencia </TableHead>
          <TableHead class="w-[120px] text-center">Fecha Nacimiento </TableHead>
          <TableHead class="w-[120px] text-center">Fecha ingreso</TableHead>
          <TableHead class="w-[10px] text-center">Estado </TableHead>
          <TableHead class="w-[10px] text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="alumno in alumnosOrdenados" :key="alumno.id">
          <TableCell class="text-center font-medium"> {{ alumno.id }} </TableCell>
          <TableCell class="text-right">{{ formatearRut(alumno.rut_alumno) }}</TableCell>
          <TableCell class="text-left">{{ alumno.nombre_completo_alumno }}</TableCell>
          <TableCell class="text-center"> {{ alumno.procedencia_alumno }} </TableCell>
          <TableCell class="text-center">{{ alumno.fecha_nacimiento_alumno }} </TableCell>
          <TableCell class="text-center">{{ alumno.fecha_incorporacion_alumno }} </TableCell>
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
                    <DropdownMenuItem>
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
    </Table>
  </div>
</template>

<style></style>
