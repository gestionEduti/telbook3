<script setup lang="ts">
import { OctagonX, Goal, Download, Filter, Trash2 } from 'lucide-vue-next'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { obtenerFechaActualComoYYYMMDD } from '@/lib/formato'
import { useToast } from '@/components/ui/toast'
const { toast } = useToast()

const props = defineProps<{
  nivel: string
  letra: string
}>()

const nombreCurso = computed(() => props.nivel + props.letra)

const errorStore = useErrorStore()
const authStore = useAuthStore()

// planificaciones
const loadingPlanificaciones = ref(true)
interface ResumenPlanificaciones {
  id: number
  proyecto_eje: string
  objetivos_generales: string
  estrategias: string
  cierre_proyecto: string
  cantidad_semanas: number
  fecha: string
  estado: number
  oas: [
    {
      id_base_curricular: number
      descripcion_ambito: string
      descripcion_nucleo: string
      descripcion_oa: string
    },
  ]
}
const resumenPlanificaciones = ref<ResumenPlanificaciones[] | null>(null)

// computed
const cursoTienePlanificacionActiva = computed(() => {
  return resumenPlanificaciones.value?.some((p) => p.estado === 1) || false
})

// otros
const diaActual = obtenerFechaActualComoYYYMMDD()

//JPS computed que guarda solo los perfiles permitidos para elimnar planificaciones
  const puedeEliminarPMP = computed(() => {
  const perfilesPermitidos = [1, 2, 3, 4, 6]
  return perfilesPermitidos.includes(authStore.perfil?.codigo_perfil_usuario ?? -1)
})


const hayPlanificaciones = computed(() => {
  return resumenPlanificaciones.value !== null && resumenPlanificaciones.value.length > 0
})

// Agregar después de las interfaces existentes
const filtroProyectoEje = ref('todos')

// Modificar el computed existente y agregar uno nuevo
const proyectosEjesUnicos = computed(() => {
  if (!resumenPlanificaciones.value) return []
  return [...new Set(resumenPlanificaciones.value.map(p => p.proyecto_eje))].sort()
})

const planificacionesFiltradas = computed(() => {
  if (!resumenPlanificaciones.value) return []
  if (filtroProyectoEje.value === 'todos') return resumenPlanificaciones.value

  return resumenPlanificaciones.value.filter(p =>
    p.proyecto_eje === filtroProyectoEje.value
  )
})

// Agregar ref para controlar la visibilidad del select
const mostrarSelect = ref(false)

/**
 * trae las planificaciones+oas del curso desde una funcion de supabase
 */
async function fetchPlanificaciones() {
  const { data, error } = await supabase.rpc('resumen_pla_med_curso', {
    colegio: authStore.perfil!.rbd_usuario,
    curso: nombreCurso.value,
  })
  if (error) errorStore.setError({ error, customCode: 500 })
  else resumenPlanificaciones.value = data as unknown as ResumenPlanificaciones[]
  loadingPlanificaciones.value = false
}

async function finalizarPlanificacion(id: number) {
  const { error } = await supabase
    .from('mv_pla_mediano_plazo')
    .update({ estado_planificacion: 0 })
    .eq('id_planificacion', id)
    .select()
  if (error) errorStore.setError({ error, customCode: 500 })
  else await fetchPlanificaciones()
}

/**
 * eliminar una planificacion del dia actual
 * @param id
 */
async function eliminarPlanificacionDelDia(id: number) {
  const { error } = await supabase.from('mv_pla_mediano_plazo').delete().eq('id_planificacion', id)

  if (error) {
    errorStore.setError({ error })
  } else {
    toast({
      title: 'Planificación eliminada',
      description: 'La planificación se ha eliminado correctamente',
      duration: 3000,
      variant: 'destructive',
    })
    resumenPlanificaciones.value = resumenPlanificaciones.value!.filter((p) => p.id !== id)
  }
}


/**
 * Genera y descarga un PDF con el reporte de planificaciones
 */
function descargarTodasLasPlanificaciones() {
  // Validación más estricta
  if (!resumenPlanificaciones.value || resumenPlanificaciones.value.length === 0) {
    console.warn('No hay planificaciones para descargar');
    return;
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Configuración de fuentes y colores
  doc.setFont('helvetica')

  // Agregar logo
  doc.addImage(
    'https://jhzweohhdshzyvjmkhce.supabase.co/storage/v1/object/public/Logo//telbook_logo.png',
    'PNG',
    15,
    5,
    33,
    11
  )

  // Título principal centrado
  doc.setFontSize(20)
  doc.setTextColor(44, 62, 80)
  doc.text('Planificaciones de Mediano Plazo', doc.internal.pageSize.width / 2, 15, { align: 'center' })

  // Subtítulo con información del curso
  doc.setFontSize(14)
  doc.setTextColor(52, 73, 94)
  doc.text(`Curso: ${nombreCurso.value}`, doc.internal.pageSize.width / 2, 25, { align: 'center' })

  // Fecha de generación del reporte
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

  resumenPlanificaciones.value.forEach((planificacion, index) => {
    if (!planificacion) return; // Skip si la planificación es null

    if (index > 0) {
      doc.addPage();
      // Repetir encabezado en nuevas páginas
      doc.addImage(
        'https://jhzweohhdshzyvjmkhce.supabase.co/storage/v1/object/public/Logo//telbook_logo.png',
        'PNG',
        15,
        5,
        33,
        11
      );
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.1);
      doc.line(15, 30, doc.internal.pageSize.width - 15, 30);
    }

    // Asegurarse de que oas existe y es un array
    const oasData = planificacion.oas?.map(oa => [
      `${oa.descripcion_ambito} - ${oa.descripcion_nucleo}`,
      oa.descripcion_oa
    ]) || [];

    autoTable(doc, {
      head: [['PROYECTO EJE']],
      body: [[planificacion.proyecto_eje]],
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 14,
        cellPadding: 8,
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 16,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [235, 245, 251],
        textColor: [44, 62, 80],
        fontStyle: 'bold'
      }
    })

    // Información general de la planificación
    autoTable(doc, {
      body: [
        ['Fecha', planificacion.fecha],
        ['Duración', `${planificacion.cantidad_semanas} semanas`],
        ['Estado', planificacion.estado === 1 ? 'En curso' : 'Finalizado']
      ],
      startY: doc.lastAutoTable.finalY + 5,
      theme: 'grid',
      styles: {
        fontSize: 11,
        cellPadding: 5
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [245, 247, 250], cellWidth: 40 },
        1: { cellWidth: 'auto' }
      }
    })

    autoTable(doc, {
      head: [['OBJETIVOS GENERALES DEL PROYECTO']],
      body: [[planificacion.objetivos_generales]],
      startY: doc.lastAutoTable.finalY + 10,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold'
      }
    })

    autoTable(doc, {
      head: [['ESTRATEGIAS PARA ALCANZAR EL PROYECTO']],
      body: [[planificacion.estrategias]],
      startY: doc.lastAutoTable.finalY + 10,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold'
      }
    })

    autoTable(doc, {
      head: [['OBJETIVOS DE APRENDIZAJE ASOCIADOS AL PROYECTO']],
      body: [['']],
      startY: doc.lastAutoTable.finalY + 10,
      styles: {
        fontSize: 12,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        fontStyle: 'bold'
      }
    })

    autoTable(doc, {
      head: [['Ámbito - Núcleo', 'Objetivo de Aprendizaje']],
      body: oasData,
      startY: doc.lastAutoTable.finalY + 2,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontSize: 11
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold' },
        1: { cellWidth: 'auto' }
      }
    })
  })

  // Agregar pie de página con números de página
  const pageCount = doc.internal.getNumberOfPages()
  doc.setFontSize(8)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)

    // Línea separadora para el pie de página
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

  // Nombre del archivo y guardado
  const nombreArchivo = `PlaMedianoPlazo_Reporte_Completo_${nombreCurso.value}_${new Date().toLocaleDateString('es-CL').replace(/\//g, '-')}`;
  doc.save(`${nombreArchivo}.pdf`);
}

/**
 * Genera y descarga un PDF con una planificación individual
 */
function descargarPlanificacionIndividual(planificacion: ResumenPlanificaciones) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Configuración de fuentes y colores
  doc.setFont('helvetica')

  // Agregar logo
  doc.addImage(
    'https://jhzweohhdshzyvjmkhce.supabase.co/storage/v1/object/public/Logo//telbook_logo.png',
    'PNG',
    15,
    5,
    33,
    11
  )

  // Título principal centrado
  doc.setFontSize(20)
  doc.setTextColor(44, 62, 80)
  doc.text('Planificación de Mediano Plazo', doc.internal.pageSize.width / 2, 15, { align: 'center' })

  // Subtítulo con información del curso
  doc.setFontSize(14)
  doc.setTextColor(52, 73, 94)
  doc.text(`Curso: ${nombreCurso.value}`, doc.internal.pageSize.width / 2, 25, { align: 'center' })

  // Fecha de generación del reporte
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

  // Proyecto Eje
  autoTable(doc, {
    head: [['PROYECTO EJE']],
    body: [[planificacion.proyecto_eje]],
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 14,
      cellPadding: 8,
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 16,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fillColor: [235, 245, 251],
      textColor: [44, 62, 80],
      fontStyle: 'bold'
    }
  })

  // Información general
  autoTable(doc, {
    body: [
      ['Fecha', planificacion.fecha],
      ['Duración', `${planificacion.cantidad_semanas} semanas`],
      ['Estado', planificacion.estado === 1 ? 'En curso' : 'Finalizado']
    ],
    startY: doc.lastAutoTable.finalY + 5,
    theme: 'grid',
    styles: {
      fontSize: 11,
      cellPadding: 5
    },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [245, 247, 250], cellWidth: 40 },
      1: { cellWidth: 'auto' }
    }
  })

  // Objetivos y estrategias
  autoTable(doc, {
    head: [['OBJETIVOS GENERALES DEL PROYECTO']],
    body: [[planificacion.objetivos_generales]],
    startY: doc.lastAutoTable.finalY + 10,
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 12,
      fontStyle: 'bold'
    }
  })

  autoTable(doc, {
    head: [['ESTRATEGIAS PARA ALCANZAR EL PROYECTO']],
    body: [[planificacion.estrategias]],
    startY: doc.lastAutoTable.finalY + 10,
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 12,
      fontStyle: 'bold'
    }
  })

  // Objetivos de Aprendizaje
  const oasData = planificacion.oas.map(oa => [
    `${oa.descripcion_ambito} - ${oa.descripcion_nucleo}`,
    oa.descripcion_oa
  ])

  autoTable(doc, {
    head: [['Ámbito - Núcleo', 'Objetivo de Aprendizaje']],
    body: oasData,
    startY: doc.lastAutoTable.finalY + 10,
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: 255,
      fontSize: 11
    },
    columnStyles: {
      0: { cellWidth: 70, fontStyle: 'bold' },
      1: { cellWidth: 'auto' }
    }
  })

  // Nombre del archivo para planificación individual
  const nombreArchivo = `PlaMedianoPlazo_${planificacion.proyecto_eje.replace(/[^a-zA-Z0-9]/g, '_')}_${nombreCurso.value}_${new Date().toLocaleDateString('es-CL').replace(/\//g, '-')}`
  doc.save(`${nombreArchivo}.pdf`)
}

onMounted(async () => {
  await fetchPlanificaciones()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span>Planificacion mediano plazo</span>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            @click="descargarTodasLasPlanificaciones"
            :disabled="!hayPlanificaciones"
          >
            <Download class="mr-2 h-4 w-4" />
            Descargar Reporte Completo
          </Button>

          <MedianoPlazoDialogoAgregar
            :buttonDisabled="cursoTienePlanificacionActiva"
            @planificacion-creada="fetchPlanificaciones()"
          />
        </div>
      </CardTitle>
      <CardDescription>Descripcion planificacion mediano plazo.</CardDescription>
    </CardHeader>

    <div class="px-6 pb-4">
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          class="h-10"
          @click="mostrarSelect = !mostrarSelect"
        >
          <Filter class="mr-2 h-4 w-4" />
          Filtrar por proyecto eje
        </Button>
        <select
          v-if="mostrarSelect && hayPlanificaciones"
          v-model="filtroProyectoEje"
          class="h-10 w-[200px] rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="todos">Todos los proyectos</option>
          <option
            v-for="proyecto in proyectosEjesUnicos"
            :key="proyecto"
            :value="proyecto"
          >
            {{ proyecto }}
          </option>
        </select>
      </div>
      <p class="mt-2 text-sm text-muted-foreground">
        Mostrando planificaciones de {{ filtroProyectoEje === 'todos' ? 'todos los proyectos' : `proyecto "${filtroProyectoEje}"` }}
      </p>
    </div>

    <Separator />

    <Transition name="fade" mode="out-in">
      <CardContent v-if="!loadingPlanificaciones">
        <InfoMensajeSinData
          v-if="!resumenPlanificaciones || !resumenPlanificaciones.length"
          icono="vacio"
          mensaje="No hay planificaciones"
        />

        <Table v-else>
          <TableBody>
            <TableRow
              v-for="planificacion in planificacionesFiltradas"
              :key="planificacion.id"
              class="group flex min-h-20 items-center"
            >
              <TableCell class="w-full">
                <Card :class="planificacion.estado === 1 ? 'border-green-500' : 'bg-gray-100'">
                  <CardHeader>
                    <CardTitle>
                      <div class="flex justify-between items-center">
                        <span>Proyecto eje: {{ planificacion.proyecto_eje }}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          @click="descargarPlanificacionIndividual(planificacion)"
                        >
                          <Download class="mr-2 h-4 w-4" />
                          Descargar PDF
                        </Button>
                        <Dialog v-if="planificacion.fecha === diaActual">
                                  <DialogTrigger as-child>
                                    <Button :disabled="!puedeEliminarPMP"
                                      variant="destructive">
                                      <Trash2 />
                                      <span>Eliminar</span>
                                    </Button>
                                  </DialogTrigger>

                                  <DialogContent class="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Confirmar eliminacion</DialogTitle>
                                      <DialogDescription
                                        >Esta acción no se puede deshacer.</DialogDescription
                                      >
                                    </DialogHeader>

                                    <!-- boton de guardar -->
                                    <DialogFooter>
                                      <DialogClose>
                                        <Button
                                          @click.stop="eliminarPlanificacionDelDia(planificacion.id)"
                                        >
                                          <Trash2 />
                                          <span>Eliminar planificación</span>
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                      </div>
                    </CardTitle>

                    <CardDescription>
                      <p>{{ planificacion.fecha }}</p>
                      <p>{{ planificacion.cantidad_semanas }} semanas</p>
                    </CardDescription>

                    <div class="flex">
                      <Badge
                        :class="planificacion.estado === 1 ? 'bg-green-600' : 'bg-gray-700'"
                        class="flex"
                      >
                        {{
                          planificacion.estado === 1 ? 'proyecto en curso' : 'proyecto finalizado'
                        }}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div class="flex flex-col gap-4">
                      <p class="flex flex-col">
                        <span class="font-bold">Objetivos generales: </span>
                        <span>{{ planificacion.objetivos_generales }}</span>
                      </p>
                      <p class="flex flex-col">
                        <span class="font-bold">Estrategias para alcanzar el proyecto: </span>
                        <span>{{ planificacion.estrategias }}</span>
                      </p>
                      <p class="flex flex-col">
                        <span class="font-bold">Cierre del proyecto: </span>
                        <span>{{ planificacion.cierre_proyecto }}</span>
                      </p>
                      <div class="border p-4">
                        <p class="flex flex-col">
                          <span class="font-bold">Objetivos de aprendizaje: </span>
                        </p>

                        <Accordion type="single" collapsible>
                          <AccordionItem
                            v-for="oa in planificacion.oas"
                            :key="oa.id_base_curricular"
                            :value="String(oa.id_base_curricular)"
                          >
                            <AccordionTrigger>
                              <p class="flex items-center gap-2">
                                <Goal class="mr-2 inline" />
                                <span>{{ oa.descripcion_ambito }}</span>
                                <span> - </span>
                                <span>{{ oa.descripcion_nucleo }}</span>
                              </p>
                            </AccordionTrigger>
                            <AccordionContent>
                              <p>{{ oa.descripcion_oa }}</p>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter class="flex justify-end">
                    <Dialog v-if="planificacion.estado === 1">
                      <DialogTrigger as-child>
                        <Button :disabled="!puedeEliminarPMP"
                          variant="destructive">
                          <OctagonX />
                          <span>Finalizar planificación</span>
                        </Button>
                      </DialogTrigger>

                      <DialogContent class="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Confirmar</DialogTitle>
                          <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
                        </DialogHeader>

                        <!-- boton de guardar -->
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
