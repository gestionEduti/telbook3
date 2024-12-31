<script setup lang="ts">
// vue imports
import { onMounted, ref, computed } from 'vue'

// utils
import { formatearRut } from '@/lib/formato'

// shadcn
import AlertDialog from '@/components/ui/alert-dialog/AlertDialog.vue'
import AlertDialogTrigger from '@/components/ui/alert-dialog/AlertDialogTrigger.vue'
import AlertDialogContent from '@/components/ui/alert-dialog/AlertDialogContent.vue'
import AlertDialogHeader from '@/components/ui/alert-dialog/AlertDialogHeader.vue'
import AlertDialogTitle from '@/components/ui/alert-dialog/AlertDialogTitle.vue'
import AlertDialogDescription from '@/components/ui/alert-dialog/AlertDialogDescription.vue'
import AlertDialogFooter from '@/components/ui/alert-dialog/AlertDialogFooter.vue'
import AlertDialogCancel from '@/components/ui/alert-dialog/AlertDialogCancel.vue'
import AlertDialogAction from '@/components/ui/alert-dialog/AlertDialogAction.vue'
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
import Separator from '@/components/ui/separator/Separator.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import Label from '@/components/ui/label/Label.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertTitle from '@/components/ui/alert/AlertTitle.vue'
import AlertDescription from '@/components/ui/alert/AlertDescription.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
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
  ListX,
} from 'lucide-vue-next'

// store
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import { useErrorStore } from '@/stores/error'
const errorStore = useErrorStore()

// data
const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)
const formularioRetirarAlumno = ref({
  fecha: new Date().toISOString().slice(0, 10),
  motivo: '',
})
const filtroAlumnos = ref('')
const ordenarPor = ref('matricula')

// computed
const alumnosFiltrados = computed(() => {
  const filtrados = alumnos.value?.filter((a) => {
    if (!filtroAlumnos.value) return true
    const regex = new RegExp(filtroAlumnos.value, 'i')
    return (
      regex.test(a.nombres_alumno) || regex.test(a.apellidos_alumno) || regex.test(a.rut_alumno)
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

// methods
const fetchSupabase = async () => {
  const { data, error, status } = await querySelect
  if (error) errorStore.setError({ error: error, customCode: status })
  else alumnos.value = data
}

const eliminarAlumno = async (id: number) => {
  const { error, status } = await queryEliminarAlumno(id)
  if (error) errorStore.setError({ error: error, customCode: status })
  else await fetchSupabase()
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
    })
    formularioRetirarAlumno.value = {
      fecha: new Date().toISOString().slice(0, 10),
      motivo: '',
    }
    await fetchSupabase()
  }
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
                  <Button>
                    <Download class="h-4 w-4" />
                    <span class="ml-2 hidden md:block">Descargar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-56">
                  <DropdownMenuLabel>Descargar Libro</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem disabled>
                      <BookCheck class="h-4 w-4" />
                      <span class="ml-2 hidden md:block">Libro completo</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <FileText class="h-4 w-4" />
                      <span class="ml-2 hidden md:block">Resumen</span>
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
          <Alert class="bg-gray-50">
            <AlertTitle class="mb-4 text-center"> Resumen </AlertTitle>
            <AlertDescription>
              <div class="grid gap-4 pb-4 md:grid-cols-2 lg:grid-cols-5">
                <Card class="col-start-2">
                  <CardHeader class="flex flex-row items-center justify-center space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium"> Total </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-center text-2xl font-bold">{{ alumnos.length || 0 }}</div>
                  </CardContent>
                </Card>
                <Card class="col-start-3">
                  <CardHeader class="flex flex-row items-center justify-center space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium"> Activos </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-center text-2xl font-bold">
                      {{ alumnos.filter((a) => a.codigo_estado_alumno == 1).length || 0 }}
                    </div>
                  </CardContent>
                </Card>
                <Card class="col-start-4">
                  <CardHeader class="flex flex-row items-center justify-center space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium"> Retirados </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-center text-2xl font-bold">
                      {{ alumnos.filter((a) => a.codigo_estado_alumno == 0).length || 0 }}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AlertDescription>
          </Alert>

          <!-- tabla -->
          <div class="grid grid-cols-6 gap-4 pb-2 pt-4">
            <Label
              for="matriculas-filtro-alumnos"
              class="col-span-2 col-start-1 flex flex-col space-y-1"
            >
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
          <Table class="border border-slate-300 bg-white">
            <TableCaption>
              {{
                alumnosFiltrados?.length
                  ? `Hay un total de ${alumnos?.length || 0} matriculas en la tabla`
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
                              <DropdownMenuItem>
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
                              <DropdownMenuItem @click.stop>
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
                                          !formularioRetirarAlumno.fecha ||
                                          !formularioRetirarAlumno.motivo
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

<style scoped>
/* animacion para cuando aparezca la pagina luego de llamar a la db */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
