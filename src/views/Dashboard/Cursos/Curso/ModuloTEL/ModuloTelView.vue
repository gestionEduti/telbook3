<script setup lang="ts">
import { Plus, NotebookText, Users, Calendar, X, Download , Trash2} from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useToast } from '@/components/ui/toast'
const toast = useToast()
import { obtenerFechaActualComoYYYMMDD } from '@/lib/formato'

const authStore = useAuthStore()
const errorStore = useErrorStore()

const props = defineProps<{
  nivel: string
  letra: string
}>()

const diaActual = obtenerFechaActualComoYYYMMDD()

const nombreCurso = computed(() => props.nivel + props.letra)

//JPS agrego computed que maneja los perfiles permitidos para que el botón esté hábilitado

const puedeAgregarRegistro = computed(() => {
  const perfilesPermitidos = [1,2, 4, 5] // Super Administrador JEFE UTP y Fonoaudiologo
  return perfilesPermitidos.includes(authStore.perfil?.codigo_perfil_usuario ?? -1)
})


// registros fonoaudiologicos
interface ResumenInterface {
  id: number
  alumnos: [
    {
      id: number
      rut_alumno: string
      nombre_completo: string
    },
  ]
  contenidos: [string]
  fecha_evaluacion: string
  modalidad_evaluacion: string
  observaciones_fonoaudiologicas: string
}

const registrosFonoaudiologicos = ref<ResumenInterface[] | null>(null)
async function fetchRegistros() {
  const { data, error } = await supabase.rpc('resumen_modulo_tel', {
    colegio: authStore.perfil!.rbd_usuario,
    curso: nombreCurso.value,
  })
  if (error) {
    errorStore.setError({ error })
  } else {
    registrosFonoaudiologicos.value = data as unknown as ResumenInterface[]
  }
}
fetchRegistros()

const filtroFecha = ref({
  desde: '',
  hasta: '',
})

const mostrarFiltroFecha = ref(false)

function limpiarFiltros() {
  mostrarFiltroFecha.value = false
  filtroFecha.value = {
    desde: '',
    hasta: '',
  }
}

// Modificar el computed registrosFiltrados
const registrosFiltrados = computed(() => {
  if (!registrosFonoaudiologicos.value) return []

  // Si no hay filtro activo, mostrar últimos 5 días
  if (!mostrarFiltroFecha.value) {
    const hoy = new Date()
    const cincoDiasAtras = new Date(hoy)
    cincoDiasAtras.setDate(hoy.getDate() - 5)

    return registrosFonoaudiologicos.value
      .filter(registro => {
        const fechaRegistro = new Date(registro.fecha_evaluacion)
        return fechaRegistro >= cincoDiasAtras && fechaRegistro <= hoy
      })
      .sort((a, b) => b.fecha_evaluacion.localeCompare(a.fecha_evaluacion))
  }

  // Aplicar filtros de fecha si están activos
  return registrosFonoaudiologicos.value
    .filter(registro => {
      const fecha = new Date(registro.fecha_evaluacion)
      const desde = filtroFecha.value.desde ? new Date(filtroFecha.value.desde) : null
      const hasta = filtroFecha.value.hasta ? new Date(filtroFecha.value.hasta) : null

      if (desde && hasta) {
        return fecha >= desde && fecha <= hasta
      } else if (desde) {
        return fecha >= desde
      } else if (hasta) {
        return fecha <= hasta
      }
      return true
    })
    .sort((a, b) => b.fecha_evaluacion.localeCompare(a.fecha_evaluacion))
})

/**
 * eliminar una planificacion del dia actual
 * @param id
 */
async function eliminarRegistroDelDia(id: number) {
  const { error } = await supabase.from('mv_tel_alumnos').delete().eq('id', id)

  if (error) {
    errorStore.setError({ error })
  } else {
    toast.toast({
      title: 'Planificación eliminada',
      description: 'La planificación se ha eliminado correctamente',
      duration: 3000,
      variant: 'destructive',
    })
    registrosFonoaudiologicos.value = registrosFonoaudiologicos.value!.filter((p) => p.id !== id)
  }
}

// Agregar función para descargar registros
function descargarRegistros() {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Configuración inicial
  doc.setFont('helvetica')
  doc.addImage(
    'https://jhzweohhdshzyvjmkhce.supabase.co/storage/v1/object/public/Logo//telbook_logo.png',
    'PNG',
    15,
    5,
    33,
    11
  )

  // Título y subtítulo
  doc.setFontSize(20)
  doc.setTextColor(44, 62, 80)
  doc.text('Registros Fonoaudiológicos', doc.internal.pageSize.width / 2, 15, { align: 'center' })

  // Solo el curso
  doc.setFontSize(14)
  doc.text(`Curso: ${nombreCurso.value}`, doc.internal.pageSize.width / 2, 25, { align: 'center' })

  // Fecha de generación
  doc.setFontSize(10)
  doc.setTextColor(127, 140, 141)
  doc.text(
    `Generado el: ${new Date().toLocaleDateString('es-CL')}`,
    doc.internal.pageSize.width - 15,
    10,
    { align: 'right' }
  )

  // Línea separadora
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.1)
  doc.line(15, 30, doc.internal.pageSize.width - 15, 30)

  if (registrosFiltrados.value?.length) {
    registrosFiltrados.value.forEach((registro, index) => {
      if (index > 0) {
        doc.addPage()
        // Repetir encabezado en nuevas páginas
        doc.addImage(
          'https://jhzweohhdshzyvjmkhce.supabase.co/storage/v1/object/public/Logo//telbook_logo.png',
          'PNG',
          15,
          5,
          33,
          11
        )
      }

      // Fecha del registro
      autoTable(doc, {
        head: [['REGISTRO FONOAUDIOLÓGICO']],
        body: [[`Fecha: ${registro.fecha_evaluacion}`]],
        startY: index === 0 ? 40 : 20,
        theme: 'grid',
        styles: {
          fontSize: 12,
          cellPadding: 5,
          halign: 'left',
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontSize: 14,
        }
      })

      // Modalidad y Observaciones
      autoTable(doc, {
        body: [
          ['Modalidad de evaluación', registro.modalidad_evaluacion],
          ['Observaciones fonoaudiológicas', registro.observaciones_fonoaudiologicas]
        ],
        startY: doc.lastAutoTable.finalY + 5,
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [245, 247, 250], cellWidth: 60 },
          1: { cellWidth: 'auto' }
        }
      })

      // Alumnos
      autoTable(doc, {
        head: [['ALUMNOS EVALUADOS']],
        body: registro.alumnos.map(alumno => [alumno.nombre_completo]),
        startY: doc.lastAutoTable.finalY + 5,
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontSize: 11
        }
      })

      // Contenidos
      autoTable(doc, {
        head: [['CONTENIDOS TRABAJADOS']],
        body: registro.contenidos.map(contenido => [contenido]),
        startY: doc.lastAutoTable.finalY + 5,
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontSize: 11
        }
      })
    })
  } else {
    // Caso sin registros
    autoTable(doc, {
      body: [['No hay registros para mostrar']],
      startY: 40,
      styles: {
        fontSize: 12,
        cellPadding: 5,
        halign: 'center'
      }
    })
  }

  // Agregar pie de página con números de página
  const pageCount = doc.internal.getNumberOfPages()
  doc.setFontSize(8)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.1)
    doc.line(15, doc.internal.pageSize.height - 15, doc.internal.pageSize.width - 15, doc.internal.pageSize.height - 15)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }

  const nombreArchivo = `Registros_Fonoaudiologicos_${nombreCurso.value}_${new Date().toLocaleDateString('es-CL').replace(/\//g, '-')}`
  doc.save(`${nombreArchivo}.pdf`)
}

// Agregar función para descargar registro individual
function descargarRegistroIndividual(registro: ResumenInterface) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Configuración inicial
  doc.setFont('helvetica')
  doc.addImage(
    'https://jhzweohhdshzyvjmkhce.supabase.co/storage/v1/object/public/Logo//telbook_logo.png',
    'PNG',
    15,
    5,
    33,
    11
  )

  // Título y subtítulo
  doc.setFontSize(20)
  doc.setTextColor(44, 62, 80)
  doc.text('Registro Fonoaudiológico', doc.internal.pageSize.width / 2, 15, { align: 'center' })

  // Solo el curso
  doc.setFontSize(14)
  doc.text(`Curso: ${nombreCurso.value}`, doc.internal.pageSize.width / 2, 25, { align: 'center' })

  let startY = 40  // Ajustar el startY inicial ya que eliminamos una línea

  // Fecha del registro
  autoTable(doc, {
    head: [['REGISTRO FONOAUDIOLÓGICO']],
    body: [[`Fecha: ${registro.fecha_evaluacion}`]],
    startY,
    theme: 'grid',
    styles: {
      fontSize: 12,
      cellPadding: 5,
      halign: 'left',
    },
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: 255,
      fontSize: 14,
    }
  })

  startY += 30 // Incrementar la posición Y

  // Modalidad y Observaciones
  autoTable(doc, {
    body: [
      ['Modalidad de evaluación', registro.modalidad_evaluacion],
      ['Observaciones fonoaudiológicas', registro.observaciones_fonoaudiologicas]
    ],
    startY,
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [245, 247, 250], cellWidth: 60 },
      1: { cellWidth: 'auto' }
    }
  })

  startY += 40 // Incrementar la posición Y

  // Alumnos
  autoTable(doc, {
    head: [['ALUMNOS EVALUADOS']],
    body: registro.alumnos.map(alumno => [alumno.nombre_completo]),
    startY,
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: 255,
      fontSize: 11
    }
  })

  startY += 40 + (registro.alumnos.length * 8) // Incrementar basado en cantidad de alumnos

  // Contenidos
  autoTable(doc, {
    head: [['CONTENIDOS TRABAJADOS']],
    body: registro.contenidos.map(contenido => [contenido]),
    startY,
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: 255,
      fontSize: 11
    }
  })

  const nombreArchivo = `Registro_Fonoaudiologico_${registro.fecha_evaluacion.replace(/[^a-zA-Z0-9]/g, '_')}_${nombreCurso.value}`
  doc.save(`${nombreArchivo}.pdf`)
}

</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span> Modulo TEL </span>

        <!-- botones -->
        <div class="space-x-2">
          <Button
            variant="outline"
            @click="descargarRegistros"
            :disabled="!registrosFiltrados?.length"
          >
            <Download class="mr-2 h-4 w-4" />
            Descargar Reporte Completo
          </Button>

          <!-- Botón para descargar registros filtrados -->
          <Button
            v-if="mostrarFiltroFecha"
            variant="outline"
            @click="descargarRegistros"
            :disabled="!registrosFiltrados?.length || !filtroFecha.desde || !filtroFecha.hasta"
          >
            <Download class="mr-2 h-4 w-4" />
            Descargar Registros Filtrados
          </Button>

          <ModuloTelDialogoAgregar @registro-creado="fetchRegistros()">
            <Button
              :disabled="!puedeAgregarRegistro"
              :title="!puedeAgregarRegistro ?
              'No tienes permisos para agregar registros fonoaudiológicos' : ''"
            >
              <Plus />
              <span>Agregar registro fonoaudiologico</span>
            </Button>
          </ModuloTelDialogoAgregar>
        </div>
      </CardTitle>

      <!-- Agregar sección de filtros -->
      <div class="mt-4 flex items-center gap-4">
        <Button
          variant="outline"
          @click="mostrarFiltroFecha = !mostrarFiltroFecha"
          :class="{ 'bg-primary/10': mostrarFiltroFecha }"
        >
          <Calendar class="mr-2 h-4 w-4" />
          Filtrar por fecha
        </Button>

        <div v-if="mostrarFiltroFecha" class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <Label>Desde:</Label>
            <Input type="date" v-model="filtroFecha.desde" />
          </div>
          <div class="flex items-center gap-2">
            <Label>Hasta:</Label>
            <Input type="date" v-model="filtroFecha.hasta" />
          </div>
          <Button variant="ghost" @click="limpiarFiltros">
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardDescription>
        {{ mostrarFiltroFecha ? 'Mostrando registros filtrados por fecha' : 'Mostrando registros de los últimos 5 días' }}
      </CardDescription>
      <Separator />
    </CardHeader>

    <Transition name="fade" mode="out-in">
      <CardContent v-if="registrosFonoaudiologicos">
        <!-- si no hay registros -->
        <InfoMensajeSinData
          v-if="!registrosFiltrados.length"
          icono="mantencion"
          mensaje="No hay registros para el rango de fechas seleccionado."
        />

        <!-- si hubiera -->
        <Table v-else>
          <TableBody>
            <TableRow
              v-for="planificacion in registrosFiltrados"
              :key="planificacion.id"
              class="group flex min-h-20 items-center"
            >
              <TableCell class="w-full">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div class="flex items-start justify-between">
                        <span>{{ planificacion.fecha_evaluacion }}</span>
                        <div class="flex items-center gap-2">
                          <Button
                            variant="outline"
                            class="hover:bg-primary/10 text-foreground"
                            @click="descargarRegistroIndividual(planificacion)"
                          >
                            <Download class="mr-2 h-4 w-4" />
                            Descargar PDF
                          </Button>

                          <Dialog v-if="planificacion.fecha_evaluacion === diaActual">
                            <DialogTrigger asChild>
                              <Button variant="destructive"
                              :disabled="!puedeAgregarRegistro"
                                >
                                <Trash2 class="mr-2 h-4 w-4" />
                                Eliminar
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirmar eliminación</DialogTitle>
                                <DialogDescription>
                                  Esta acción no se puede deshacer.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <Button
                                  variant="destructive"
                                  @click="eliminarRegistroDelDia(planificacion.id)"
                                >
                                  Aceptar
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardTitle>

                    <CardDescription> </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div class="mb-4 rounded border p-4">
                      <p class="text-md font-bold">Obervaciones</p>
                      <p>{{ planificacion.observaciones_fonoaudiologicas }}</p>
                    </div>

                    <Accordion type="multiple" collapsible>
                      <AccordionItem value="Alumnos">
                        <AccordionTrigger>
                          <p class="flex items-center gap-2">
                            <Users class="mr-2 inline" />
                            <span>Alumnos</span>
                          </p>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p v-for="alumno in planificacion.alumnos" :key="alumno.id">
                            {{ alumno.nombre_completo }}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="Contenidos">
                        <AccordionTrigger>
                          <p class="flex items-center gap-2">
                            <NotebookText class="mr-2 inline" />
                            <span>Contenidos</span>
                          </p>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p v-for="contenido in planificacion.contenidos" :key="contenido">
                            {{ contenido }}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter class="flex justify-end">
                    <!-- Comentar todo este bloque ya que 'estado' no existe en la interfaz ResumenInterface
                         y 'finalizarPlanificacion' no está definido -->
                    <!--
                    <Dialog v-if="planificacion.estado === 1">
                      <DialogTrigger as-child>
                        <Button variant="destructive">
                          <OctagonX />
                          <span>Finalizar planificación</span>
                        </Button>
                      </DialogTrigger>

                      <DialogContent class="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Confirmar</DialogTitle>
                          <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                          <DialogClose>
                            <Button @click.stop="finalizarPlanificacion(planificacion.id)">
                              <OctagonX />
                              <span>Finalizar planificación</span>
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    -->
                  </CardFooter>
                </Card>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Transition>
  </Card>
</template>
