<script setup lang="ts">
import { Save, Trash2, Download, Plus } from 'lucide-vue-next'
import { formatearFecha } from '@/lib/formato'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

import type { Tables } from '@/types/supabase'

// JPS agrego jsPDF
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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

// JPS computed que guarda solo los perfiles permitidos para Registrar Planificación Largo Plazo
const puedeRegistrarPLP = computed(() => {
  const perfilesPermitidos = [1, 2, 3, 4, 6]
  return perfilesPermitidos.includes(authStore.perfil?.codigo_perfil_usuario ?? -1)
})

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
  // Hardcodear el OTP
  const otpHardcoded = '123456'

  // llamada a la api de mineduc
  const respuestaOTP = await mineducStore.validarOTP(otpHardcoded)

  // guardar Plan Anual en supabase
  const { error } = await supabase.from('mv_pla_largo_plazo').insert({
    rbd: authStore.perfil!.rbd_usuario,
    nivel_planificacion: nombreCurso.value,
    descripcion_planificacion: nuevaPlanificacion.value,
    fecha_planificacion: fechaNuevaPlanificacion.value,
    rut_crea_planificacion: authStore.perfil!.rut_usuario,
    estado_planificacion: 1,
    otp_crea_planificacion: Number(otpHardcoded),
    respuesta_mineduc_otp: respuestaOTP,
  })

  if (error) {
    errorStore.setError({ error, customCode: 500 })
  } else {
    toast({
      title: 'Actividad guardada',
      description: 'La actividad se ha guardado correctamente',
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
      title: 'Actividad eliminada',
      description: 'La actividad se ha eliminado correctamente',
      duration: 3000,
      variant: 'destructive',
    })
    await fetchPlanificaciones()
  }
}

function resetearFormulario() {
  fechaNuevaPlanificacion.value = ''
  nuevaPlanificacion.value = ''
}

async function guardarPlanificacion() {
  await insertPlanificacion()
  resetearFormulario()
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

/**
 * Exporta el Actividades del Plan Anual en formato PDF
 */

  const hayPlanificaciones = computed(() => {
  return planificaciones.value !== null && planificaciones.value.length > 0
})

async function exportarPLP() {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Configuración de fuentes y colores
  doc.setFont('helvetica')

  // Agregar encabezado con información del establecimiento
  doc.setFontSize(20)
  doc.setTextColor(44, 62, 80) // Color azul oscuro
  doc.text('Plan Anual del Establecimiento', doc.internal.pageSize.width / 2, 15, { align: 'center' })

  // Subtítulo con información del curso
  doc.setFontSize(14)
  doc.setTextColor(52, 73, 94)
  doc.text(`Curso: ${nombreCurso.value} - Año Escolar: 2025`, doc.internal.pageSize.width / 2, 25, { align: 'center' })

  // Fecha de generación del reporte
  doc.setFontSize(10)
  doc.setTextColor(127, 140, 141)
  doc.text(
    `Generado el: ${new Date().toLocaleDateString('es-CL')}`,
    doc.internal.pageSize.width - 15,
    10,
    { align: 'right' }
  )

 // Preparar datos para la tabla
  const datos = planificaciones.value?.map(p => [
    formatearFecha(p.fecha_planificacion),
    p.descripcion_planificacion
  ]) || []

  autoTable(doc, {
    head: [['Fecha', 'Descripción']],
    body: datos,
    startY: 35,
    theme: 'grid',
    styles: {
      fontSize: 11,
      cellPadding: 5,
      lineColor: [189, 195, 199],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 12,
      fontStyle: 'bold',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249]
    },
    columnStyles: {
      0: { cellWidth: 30 }, // Ancho de la columna fecha
      1: { cellWidth: 'auto' } // La descripción tomará el espacio restante
    },
    margin: { top: 35, right: 15, bottom: 15, left: 15 }
  })

  // Agregar pie de página
  const pageCount = doc.internal.getNumberOfPages()
  doc.setFontSize(8)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }

   // Agregar marca de agua o logo si lo tienes
  doc.addImage('https://jhzweohhdshzyvjmkhce.supabase.co/storage/v1/object/public/Logo//telbook_logo.png', 'PNG', 15, 5, 33, 11)


  doc.save(`Plan_anual_establecimiento_${nombreCurso.value}_${new Date().toISOString().split('T')[0]}.pdf`)
}

</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span> Plan Anual </span>

        <!-- botones -->
        <div class="space-x-2">
          <Button variant="outline"
                  @click="exportarPLP"
                  :disabled="!hayPlanificaciones"
          >
            <Download class="mr-2 h-4 w-4" />
            <span> Descargar reporte </span>
          </Button>

          <Dialog>
            <DialogTrigger as-child>
              <Button :disabled="!puedeRegistrarPLP"
              >
                <Plus />
                <span> Crear actividad </span>
              </Button>
            </DialogTrigger>

            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nueva actividad</DialogTitle>
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
              <Textarea v-model="nuevaPlanificacion" placeholder=" Ingresa acá la actividad." />

              <!-- boton de guardar -->
              <DialogFooter>
                <DialogClose>
                  <Button
                    @click="guardarPlanificacion"
                    :disabled="!nuevaPlanificacion.length || !fechaNuevaPlanificacion"
                  >
                    <Save />
                    <span>Guardar</span>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardTitle>
      <CardDescription>
        Crea ó visualiza el plan anual del establecimiento.
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
                    {{ formatearFecha(planificacion.fecha_planificacion) }}
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
          </div>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
