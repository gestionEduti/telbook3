<script setup lang="ts">
import { formatearFecha, formatearRut } from '@/lib/formato' // utilidades para formatear

const authStore = useAuthStore()
const errorStore = useErrorStore()

import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

import { EllipsisVertical, UserX, UserPen, Trash2 } from 'lucide-vue-next' // iconos

// supabase
import type { Tables } from '@/types/supabase' // types de supabase
const queryEliminarAlumno = (id: number) =>
  supabase
    .from('mv_libro_matricula')
    .update({ codigo_estado_alumno: 2, estado_alumno: 'ELIMINADO' }) // TODO (modelo) dejar solo 1 de los 2 FK
    .eq('id', id)
const queryRetirarAlumno = ({ rut, numeroMatricula }: { rut: string; numeroMatricula: number }) =>
  supabase.rpc('actualizar_estado_alumno', {
    p_rut: rut,
    p_numero_matricula: numeroMatricula,
    p_codigo_estado: 0,
    p_fecha_retiro: formularioRetirarAlumno.value.fecha,
    p_causa_retiro: formularioRetirarAlumno.value.motivo,
    p_rut_modificador: authStore.perfil!.rut_usuario,
  })

const props = defineProps<{
  alumnos: Tables<'mv_libro_matricula'>[]
}>()

// data
const filtroAlumnos = ref('')
const ordenarPor = ref('matricula')
const formularioRetirarAlumno = ref({
  fecha: new Date().toISOString().slice(0, 10),
  motivo: '',
})

// computed
const alumnosFiltrados = computed(() => {
  const filtrados = props.alumnos?.filter((a) => {
    if (!filtroAlumnos.value) return true
    const regex = new RegExp(filtroAlumnos.value, 'i')
    return (
      regex.test(a.nombres_alumno || '') ||
      regex.test(a.apellidos_alumno || '') ||
      regex.test(a.rut_alumno || '')
    )
  })
  const ordenados = filtrados?.sort((a, b) => {
    if (ordenarPor.value === 'matricula')
      return a.numero_matricula_alumno - b.numero_matricula_alumno
    if (ordenarPor.value === 'rut')
      return Number(a.rut_alumno.slice(0, -2)) - Number(b.rut_alumno.slice(0, -2))
    if (ordenarPor.value === 'nombres') return a.nombres_alumno.localeCompare(b.nombres_alumno)
    if (ordenarPor.value === 'apellidos')
      return a.apellidos_alumno.localeCompare(b.apellidos_alumno)
    return 0
  })
  return ordenados
})

// emits
const emit = defineEmits(['alumnoEliminado', 'alumnoRetirado'])

// methods
const eliminarAlumno = async (id: number) => {
  const { error, status } = await queryEliminarAlumno(id)
  if (error) errorStore.setError({ error: error, customCode: status })
  else emit('alumnoEliminado')
}

const retirarAlumno = async (alumno: Tables<'mv_libro_matricula'>) => {
  const { error, status } = await queryRetirarAlumno({
    rut: alumno.rut_alumno,
    numeroMatricula: alumno.numero_matricula_alumno,
  })
  if (error) errorStore.setError({ error: error, customCode: status })
  else {
    toast({
      title: 'Exito',
      description: 'Alummno retirado exitosamente.',
      variant: 'exitoso',
      duration: 3000,
    })
    formularioRetirarAlumno.value = {
      fecha: new Date().toISOString().slice(0, 10),
      motivo: '',
    }
    emit('alumnoRetirado')
  }
}
</script>

<template>
  <!-- filtros y ordenamiento -->
  <div class="grid grid-cols-6 gap-4 pb-2 pt-4">
    <Label for="matriculas-filtro-alumnos" class="col-span-2 col-start-1 flex flex-col space-y-1">
      <span class="telbook-label">Filtrar</span>
      <Input
        id="matriculas-filtro-alumnos"
        v-model="filtroAlumnos"
        type="search"
        placeholder="Busca alumnos por rut, nombre ó apellido"
        class="max-w-xs"
      />
    </Label>
    <Label for="matriculas-filtro-alumnos" class="col-start-6 flex flex-col space-y-1">
      <span class="telbook-label">Ordenar por</span>
      <Select v-model="ordenarPor">
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un criterio" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="matricula"> Nº Matricula </SelectItem>
            <SelectItem value="rut"> Rut </SelectItem>
            <SelectItem value="nombres"> Nombres </SelectItem>
            <SelectItem value="apellidos"> Apellidos </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Label>
  </div>

  <!-- tabla -->
  <Table class="border border-slate-300 bg-white">
    <TableCaption>
      {{
        alumnosFiltrados?.length
          ? `Hay un total de ${alumnosFiltrados?.length || 0} matriculas en la tabla`
          : 'No hay alumnos'
      }}
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
    <Transition name="company" mode="out-in">
      <TableBody>
        <TransitionGroup name="list">
          <TableRow v-for="alumno in alumnosFiltrados" :key="alumno.id">
            <TableCell class="text-center font-medium">
              {{ alumno.numero_matricula_alumno }}
            </TableCell>
            <TableCell class="text-right">{{ formatearRut(alumno.rut_alumno) }}</TableCell>
            <TableCell class="text-left">{{ alumno.nombre_completo_alumno }}</TableCell>
            <TableCell class="text-center"> {{ alumno.procedencia_alumno }} </TableCell>
            <TableCell class="text-center">
              {{ formatearFecha(alumno.fecha_nacimiento_alumno) }}
            </TableCell>
            <TableCell class="text-center">
              {{ formatearFecha(alumno.fecha_incorporacion_alumno) }}
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
                      <DropdownMenuItem v-if="alumno.codigo_estado_alumno == 1">
                        <!-- TODO: ver si se debe ocultar este boton si es que ya esta retirado -->
                        <RouterLink
                          :to="{
                            name: 'editar-matricula',
                            params: { matriculaId: alumno.id },
                          }"
                          class="flex space-x-2"
                        >
                          <UserPen class="h-4 w-4" />
                          <span>Editar</span>
                        </RouterLink>
                      </DropdownMenuItem>

                      <!-- boton retirar -->
                      <DropdownMenuItem @click.stop v-if="alumno.codigo_estado_alumno == 1">
                        <AlertDialog>
                          <AlertDialogTrigger @click.stop>
                            <div class="flex space-x-2">
                              <UserX class="h-4 w-4" />
                              <span>Retirar</span>
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Indique la fecha y motivo de retiro:
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                <div class="flex flex-col space-y-2">
                                  <Label for="matriculas-fecha-retiro"> Fecha </Label>
                                  <Input
                                    id="matriculas-fecha-retiro"
                                    v-model="formularioRetirarAlumno.fecha"
                                    type="date"
                                    label="Fecha de retiro"
                                    class="mt-2"
                                  />
                                  <Label for="matriculas-motivo-retiro"> Motivo </Label>
                                  <Textarea
                                    id="matriculas-motivo-retiro"
                                    v-model="formularioRetirarAlumno.motivo"
                                    label="Motivo"
                                    class="mt-2"
                                    placeholder="Escribe acá el motivo"
                                  />
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                @click.stop="retirarAlumno(alumno)"
                                :disabled="
                                  !formularioRetirarAlumno.fecha || !formularioRetirarAlumno.motivo
                                "
                              >
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>

                      <!-- boton eliminar -->
                      <DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger @click.stop>
                            <div class="flex space-x-2">
                              <Trash2 class="h-4 w-4" />
                              <span>Eliminar</span>
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Seguro que desea retirar al alumno?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction @click.stop="eliminarAlumno(alumno.id)">
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        </TransitionGroup>
      </TableBody>
    </Transition>
  </Table>
</template>

<style scoped>
/* animacion de la transicion de la tabla al filtrar */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active {
  position: absolute;
}

/* base */
.company {
  backface-visibility: hidden;
  z-index: 1;
}

/* moving */
.company-move {
  transition: all 600ms ease-in-out 50ms;
}

/* appearing */
.company-enter-active {
  transition: all 400ms ease-out;
}

/* disappearing */
.company-leave-active {
  transition: all 200ms ease-in;
  position: absolute;
  z-index: 0;
}

/* appear at / disappear to */
.company-enter,
.company-leave-to {
  opacity: 0;
}
</style>
