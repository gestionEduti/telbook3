<script setup lang="ts">
import { Trash2, CalendarPlus2, Download, Pen } from 'lucide-vue-next'
import { formatearFecha, formatearTimestamptzADDMMYYYY } from '@/lib/formato'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

import type { Tables } from '@/types/supabase'

const errorStore = useErrorStore()
const authStore = useAuthStore()
const mineducStore = useMineducStore()

const props = defineProps<{
  nivel: string
  letra: string
}>()

const nombreCurso = computed(() => props.nivel + props.letra)

const meses = [
  { numero: '01', nombre: 'Enero' },
  { numero: '02', nombre: 'Febrero' },
  { numero: '03', nombre: 'Marzo' },
  { numero: '04', nombre: 'Abril' },
  { numero: '05', nombre: 'Mayo' },
  { numero: '06', nombre: 'Junio' },
  { numero: '07', nombre: 'Julio' },
  { numero: '08', nombre: 'Agosto' },
  { numero: '09', nombre: 'Septiembre' },
  { numero: '10', nombre: 'Octubre' },
  { numero: '11', nombre: 'Noviembre' },
  { numero: '12', nombre: 'Diciembre' },
]

const planificaciones = ref<Tables<'mv_pla_largo_plazo'>[] | null>(null)
const nuevaPlanificacion = ref<string>('')
const fechaNuevaPlanificacion = ref('')
const otp = ref('') // codigo de verificacion

async function fetchPlanificaciones() {
  const { data, error } = await supabase
    .from('mv_pla_largo_plazo')
    .select('*')
    .eq('rbd', authStore.perfil!.rbd_usuario) // TODO asegurar que haya perfil
    .eq('nivel_planificacion', nombreCurso.value)
    .gte('fecha_creacion', `${2025}-01-01`)
    .lt('fecha_creacion', `${2025 + 1}-01-01`)
    .order('fecha_planificacion')


  if (error) errorStore.setError({ error, customCode: 500 })
  else {
    planificaciones.value = data

  }
}

async function insertPlanificacion() {
  // llamada a la api de mineduc
  const respuestaOTP = await mineducStore.validarOTP(otp.value)

  // guardar asistencia en supabase
  const { error } = await supabase.from('mv_pla_largo_plazo').insert({
    rbd: authStore.perfil!.rbd_usuario,
    nivel_planificacion: nombreCurso.value,
    descripcion_planificacion: nuevaPlanificacion.value,
    fecha_planificacion: fechaNuevaPlanificacion.value,
    rut_crea_planificacion: authStore.perfil!.rut_usuario,
    estado_planificacion: 1,
    otp_crea_planificacion: Number(otp.value),
    respuesta_mineduc_otp: respuestaOTP,
  })

  if (error) {
    errorStore.setError({ error, customCode: 500 })
  } else {
    toast({
      title: 'Planificación guardada',
      description: 'La planificación se ha guardado correctamente',
      duration: 3000,
      variant: 'exitoso',
    })
    await fetchPlanificaciones()
  }
}

async function eliminarPlanificacion(id: number) {
  const { error } = await supabase.from('mv_pla_largo_plazo').delete().eq('id_planificacion', id)

  if (error) {
    errorStore.setError({ error })
  } else {
    toast({
      title: 'Planificación eliminada',
      description: 'La planificación se ha eliminado correctamente',
      duration: 3000,
      variant: 'destructive',
    })
    await fetchPlanificaciones()
  }
}

async function guardarPlanificacion() {
  await insertPlanificacion()
  await fetchPlanificaciones()
}

function planificacionesMes(mes: string) {
  return planificaciones.value?.filter(
    (planificacion) => planificacion.fecha_planificacion.split('-')[1] === mes,
  )
}

onMounted(async () => {
  await fetchPlanificaciones()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span> Planificacion largo plazo </span>

        <!-- botones -->
        <div class="space-x-2">
          <Button variant="secondary" disabled>
            <Download />
            <span> Descargar reporte </span>
          </Button>

          <Dialog>
            <DialogTrigger as-child>
              <Button>
                <CalendarPlus2 />
                <span> Crear planificacion </span>
              </Button>
            </DialogTrigger>

            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nueva planificacion</DialogTitle>
                <DialogDescription> </DialogDescription>
              </DialogHeader>

              <!-- calendario -->
              <FormKit
                type="date"
                label="Fecha"
                validation="required"
                validation-visibility="dirty"
                v-model="fechaNuevaPlanificacion"
              />

              <!-- text area con la planificacion -->
              <Textarea v-model="nuevaPlanificacion" placeholder=" Ingresa acá la planificación." />

              <!-- input con el otp -->
              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="codigo" class="text-right"> Codigo OTP </Label>
                  <Input id="codigo" class="col-span-3" v-model="otp" maxlength="6" />
                </div>
              </div>

              <!-- boton de guardar -->
              <DialogFooter>
                <DialogClose>
                  <Button
                    @click="guardarPlanificacion"
                    :disabled="
                      !otp ||
                      otp.length !== 6 ||
                      !nuevaPlanificacion.length ||
                      !fechaNuevaPlanificacion
                    "
                  >
                    <Pen />
                    <span>Crear planificacion</span>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardTitle>
      <CardDescription>
        Crea ó visualiza las planificaciones a largo plazo del establecimiento.
      </CardDescription>
      <Separator />
    </CardHeader>

    <CardContent>
      <!-- si no hay planificaciones -->
      <InfoMensajeSinData
        v-if="!planificaciones || !planificaciones.length"
        icono="vacio"
        mensaje="No hay planificaciones"
      />

      <!-- si hay planificaciones -->
      <template v-else>
        <div v-for="mes in meses" :key="mes.numero">
          <div v-if="planificacionesMes(mes.numero)?.length" class="mb-4">
            <!-- nombre mes -->
            <p class="telbook-label">{{ mes.nombre }}</p>

            <!-- planificaciones del mes -->
            <Table>
              <TableBody>
                <TableRow
                  v-for="planificacion in planificacionesMes(mes.numero)"
                  :key="planificacion.id_planificacion"
                  class="group flex min-h-20 items-center"
                >
                  <TableCell class="w-32 border-r text-center capitalize">
<!--                    {{ formatearTimestamptzADDMMYYYY(planificacion.fecha_planificacion) }}-->
                    {{formatearFecha(planificacion.fecha_planificacion)}}
                  </TableCell>
                  <TableCell class="flex-1">
                    <p class="capitalize">
                      {{ planificacion.descripcion_planificacion.toLocaleLowerCase() }}
                    </p>
                  </TableCell>
                  <TableCell class="w-40">
                    <Dialog>
                      <DialogTrigger as-child>
                        <Button variant="destructive" class="hidden w-32 group-hover:flex">
                          <Trash2 />
                          <span>Eliminar</span>
                        </Button>
                      </DialogTrigger>

                      <DialogContent class="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Confirmar eliminacion</DialogTitle>
                          <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
                        </DialogHeader>

                        <!-- boton de guardar -->
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              @click.stop="eliminarPlanificacion(planificacion.id_planificacion)"
                            >
                              <Trash2 />
                              <span>Eliminar planificación</span>
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div class="mb-4">
        </div>
      </template>
    </CardContent>
  </Card>
</template>
