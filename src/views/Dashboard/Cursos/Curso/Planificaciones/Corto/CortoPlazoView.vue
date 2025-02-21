<script setup lang="ts">
import { Goal, Trash2, Download, Calendar, X } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
const { toast } = useToast()

const errorStore = useErrorStore()
const authStore = useAuthStore()

import type { Tables } from '@/types/supabase'
import { obtenerFechaActualComoYYYMMDD } from '@/lib/formato'

const props = defineProps<{
  nivel: string
  letra: string
}>()

const nombreCurso = computed(() => props.nivel + props.letra)

// proyecto eje actual
const proyectoEje = ref<Tables<'mv_pla_mediano_plazo'> | null>(null)

// planificaciones corto plazo
const loadingPlanificaciones = ref(true)
const queryResumenPlanificaciones = supabase.rpc('resumen_pla_corto_curso', {
  colegio: authStore.perfil!.rbd_usuario,
  curso: nombreCurso.value,
})
type ResumenPlanificaciones = QueryData<typeof queryResumenPlanificaciones>
const resumenPlanificaciones = ref<ResumenPlanificaciones | null>(null)

// otros
const diaActual = obtenerFechaActualComoYYYMMDD()

// Solo mantener los refs para el filtro de fecha
const filtroFecha = ref({
  desde: '',
  hasta: '',
})
const mostrarFiltroFecha = ref(false)

// Mantener el computed solo con la lógica de filtrado por fecha
const planificacionesFiltradas = computed(() => {
  if (!resumenPlanificaciones.value) return null

  // Si no hay filtro activo, mostrar últimos 5 días
  if (!mostrarFiltroFecha.value) {
    const hoy = new Date()
    const cincoDiasAtras = new Date(hoy)
    cincoDiasAtras.setDate(hoy.getDate() - 5)

    return resumenPlanificaciones.value
      .filter(planificacion => {
        const fechaPlanificacion = new Date(planificacion.fecha)
        return fechaPlanificacion >= cincoDiasAtras && fechaPlanificacion <= hoy
      })
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }

  // Aplicar filtros de fecha si están activos
  return resumenPlanificaciones.value
    .filter(planificacion => {
      const fecha = new Date(planificacion.fecha)
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
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
})

function limpiarFiltros() {
  mostrarFiltroFecha.value = false
  filtroFecha.value = {
    desde: '',
    hasta: '',
  }
}

/**
 *
 */
async function fetchProyectoEje() {
  const { data, error } = await supabase
    .from('mv_pla_mediano_plazo')
    .select('*')
    .eq('rbd', authStore.perfil!.rbd_usuario)
    .eq('nivel_planificacion', nombreCurso.value)
    .eq('estado_planificacion', 1)
    .maybeSingle()
  if (error) errorStore.setError({ error, customCode: 500 })
  else proyectoEje.value = data
}

/**
 * trae las planificaciones+oas del curso desde una funcion de supabase
 */
async function fetchPlanificaciones() {
  const { data, error } = await queryResumenPlanificaciones
  if (error) errorStore.setError({ error, customCode: 500 })
  else resumenPlanificaciones.value = data
  loadingPlanificaciones.value = false
}

/**
 * eliminar una planificacion del dia actual
 * @param id
 */
async function eliminarPlanificacionDelDia(id: number) {
  const { error } = await supabase.from('mv_pla_corto_plazo').delete().eq('id_planificacion', id)

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
 * Genera y descarga un PDF con todas las planificaciones de corto plazo
 */
function descargarTodasLasPlanificaciones() {
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
  doc.text('Planificaciones de Corto Plazo', doc.internal.pageSize.width / 2, 15, { align: 'center' })

  // Subtítulo con información del curso
  doc.setFontSize(14)
  doc.setTextColor(52, 73, 94)
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

  if (proyectoEje.value && planificacionesFiltradas.value?.length) {
    // Primero, mostrar información del proyecto eje
    autoTable(doc, {
      head: [['PROYECTO EJE EN CURSO']],
      body: [[proyectoEje.value.proyecto_eje]],
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

    // Luego, mostrar cada planificación diaria
    planificacionesFiltradas.value.forEach((planificacion, index) => {
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
        // Repetir información del proyecto eje en cada página
        autoTable(doc, {
          head: [['PROYECTO EJE EN CURSO']],
          body: [[proyectoEje.value!.proyecto_eje]],
          startY: 40,
          theme: 'grid',
          styles: {
            fontSize: 12,
            cellPadding: 5,
            halign: 'center',
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontSize: 14,
          }
        })
      }

      // Fecha de la planificación
      autoTable(doc, {
        head: [['PLANIFICACIÓN DIARIA']],
        body: [[`Fecha: ${planificacion.fecha}`]],
        startY: index === 0 ? doc.lastAutoTable.finalY + 10 : doc.lastAutoTable.finalY + 5,
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

      // Detalles de la planificación
      autoTable(doc, {
        body: [
          ['Recursos', planificacion.recursos],
          ['Instrumentos', planificacion.instrumentos],
          ['Inicio, desarrollo y cierre', planificacion.inicioDesarrolloCierre]
        ],
        startY: doc.lastAutoTable.finalY + 5,
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [245, 247, 250], cellWidth: 40 },
          1: { cellWidth: 'auto' }
        }
      })

      // Objetivos de Aprendizaje
      autoTable(doc, {
        head: [['OBJETIVOS DE APRENDIZAJE']],
        body: [['']],
        startY: doc.lastAutoTable.finalY + 5,
        styles: {
          fontSize: 12,
          cellPadding: 5
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontSize: 14,
          halign: 'center'
        }
      })

      // Tabla con los detalles de los OAs
      autoTable(doc, {
        head: [['Ámbito y Núcleo', 'Descripción del Objetivo']],
        body: planificacion.oas.map(oa => [
          {
            content: `${oa.descripcion_ambito}\n${oa.descripcion_nucleo}`,
            styles: { fontStyle: 'bold' }
          },
          oa.descripcion_oa
        ]),
        startY: doc.lastAutoTable.finalY + 2,
        styles: {
          fontSize: 10,
          cellPadding: 5,
          valign: 'middle'
        },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: 255,
          fontSize: 11,
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 'auto' }
        },
        margin: { left: 15 },
        tableWidth: 'auto'
      })
    })
  } else {
    // Caso sin planificaciones
    autoTable(doc, {
      body: [['No hay planificaciones registradas para este proyecto eje']],
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

  const nombreArchivo = `PlaCortoPlazo_${proyectoEje.value?.proyecto_eje.replace(/[^a-zA-Z0-9]/g, '_')}_${nombreCurso.value}_${new Date().toLocaleDateString('es-CL').replace(/\//g, '-')}`
  doc.save(`${nombreArchivo}.pdf`)
}

/**
 * Genera y descarga un PDF con una planificación individual
 */
function descargarPlanificacionIndividual(planificacion: ResumenPlanificaciones[0]) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Configuración inicial igual que en descargarTodasLasPlanificaciones
  doc.setFont('helvetica')
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
  doc.text('Planificación de Corto Plazo', doc.internal.pageSize.width / 2, 15, { align: 'center' })

  // Subtítulo con información del curso
  doc.setFontSize(14)
  doc.setTextColor(52, 73, 94)
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

  if (proyectoEje.value) {
    // Mostrar información del proyecto eje
    autoTable(doc, {
      head: [['PROYECTO EJE EN CURSO']],
      body: [[proyectoEje.value.proyecto_eje]],
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

    // Fecha de la planificación
    autoTable(doc, {
      head: [['PLANIFICACIÓN DIARIA']],
      body: [[`Fecha: ${planificacion.fecha}`]],
      startY: doc.lastAutoTable.finalY + 10,
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

    // Detalles de la planificación
    autoTable(doc, {
      body: [
        ['Recursos', planificacion.recursos],
        ['Instrumentos', planificacion.instrumentos],
        ['Inicio, desarrollo y cierre', planificacion.inicioDesarrolloCierre]
      ],
      startY: doc.lastAutoTable.finalY + 5,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [245, 247, 250], cellWidth: 40 },
        1: { cellWidth: 'auto' }
      }
    })

    // Objetivos de Aprendizaje
    autoTable(doc, {
      head: [['OBJETIVOS DE APRENDIZAJE']],
      body: [['']],
      startY: doc.lastAutoTable.finalY + 5,
      styles: {
        fontSize: 12,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontSize: 14,
        halign: 'center'
      }
    })

    // Tabla con los detalles de los OAs
    autoTable(doc, {
      head: [['Ámbito y Núcleo', 'Descripción del Objetivo']],
      body: planificacion.oas.map(oa => [
        {
          content: `${oa.descripcion_ambito}\n${oa.descripcion_nucleo}`,
          styles: { fontStyle: 'bold' }
        },
        oa.descripcion_oa
      ]),
      startY: doc.lastAutoTable.finalY + 2,
      styles: {
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontSize: 11,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 'auto' }
      },
      margin: { left: 15 },
      tableWidth: 'auto'
    })
  }

  // Agregar pie de página con números de página
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.1)
  doc.line(15, doc.internal.pageSize.height - 15, doc.internal.pageSize.width - 15, doc.internal.pageSize.height - 15)
  doc.setFontSize(8)
  doc.text(
    'Página 1 de 1',
    doc.internal.pageSize.width / 2,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  )

  const nombreArchivo = `PlaCortoPlazo_${planificacion.fecha.replace(/[^a-zA-Z0-9]/g, '_')}_${nombreCurso.value}`
  doc.save(`${nombreArchivo}.pdf`)
}

// Agregar nueva función para descargar planificaciones filtradas
function descargarPlanificacionesFiltradas() {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Configuración inicial igual que en descargarTodasLasPlanificaciones
  doc.setFont('helvetica')
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
  doc.text('Planificaciones de Corto Plazo (Filtradas)', doc.internal.pageSize.width / 2, 15, { align: 'center' })

  // Subtítulo con información del curso
  doc.setFontSize(14)
  doc.setTextColor(52, 73, 94)
  doc.text(`Curso: ${nombreCurso.value}`, doc.internal.pageSize.width / 2, 25, { align: 'center' })

  // Información del filtro
  doc.setFontSize(12)
  doc.setTextColor(52, 73, 94)
  const rangoFechas = `Desde: ${filtroFecha.value.desde || 'Sin fecha inicial'} - Hasta: ${filtroFecha.value.hasta || 'Sin fecha final'}`
  doc.text(rangoFechas, doc.internal.pageSize.width / 2, 35, { align: 'center' })

  // Línea separadora
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.1)
  doc.line(15, 40, doc.internal.pageSize.width - 15, 40)

  if (proyectoEje.value && planificacionesFiltradas.value?.length) {
    // Mostrar información del proyecto eje
    autoTable(doc, {
      head: [['PROYECTO EJE EN CURSO']],
      body: [[proyectoEje.value.proyecto_eje]],
      startY: 50,
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

    // Mostrar cada planificación filtrada
    planificacionesFiltradas.value.forEach((planificacion, index) => {
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

      // Fecha de la planificación
      autoTable(doc, {
        head: [['PLANIFICACIÓN DIARIA']],
        body: [[`Fecha: ${planificacion.fecha}`]],
        startY: index === 0 ? doc.lastAutoTable.finalY + 10 : 40,
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

      // Detalles de la planificación
      autoTable(doc, {
        body: [
          ['Recursos', planificacion.recursos],
          ['Instrumentos', planificacion.instrumentos],
          ['Inicio, desarrollo y cierre', planificacion.inicioDesarrolloCierre]
        ],
        startY: doc.lastAutoTable.finalY + 5,
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [245, 247, 250], cellWidth: 40 },
          1: { cellWidth: 'auto' }
        }
      })

      // Objetivos de Aprendizaje - Primero verificamos si hay OAs
      if (planificacion.oas && planificacion.oas.length > 0) {
        // Título de la sección
        autoTable(doc, {
          head: [['OBJETIVOS DE APRENDIZAJE']],
          body: [['']],
          startY: doc.lastAutoTable.finalY + 5,
          styles: {
            fontSize: 12,
            cellPadding: 5
          },
          headStyles: {
            fillColor: [52, 152, 219],
            textColor: 255,
            fontSize: 14,
            halign: 'center'
          }
        })

        // Contenido de los OAs
        autoTable(doc, {
          head: [['Ámbito y Núcleo', 'Descripción del Objetivo']],
          body: planificacion.oas.map(oa => [
            {
              content: `${oa.descripcion_ambito || ''}\n${oa.descripcion_nucleo || ''}`,
              styles: { fontStyle: 'bold' }
            },
            oa.descripcion_oa || ''
          ]),
          startY: doc.lastAutoTable.finalY + 2,
          styles: {
            fontSize: 10,
            cellPadding: 5,
            valign: 'middle',
            overflow: 'linebreak',
            cellWidth: 'wrap'
          },
          headStyles: {
            fillColor: [52, 152, 219],
            textColor: 255,
            fontSize: 11,
            halign: 'left'
          },
          columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 'auto' }
          },
          margin: { left: 15, right: 15 },
          tableWidth: 'auto',
          didDrawCell: (data) => {
            // Para debugging
            if (data.row.index === 0) {
              console.log('OA Data:', data.cell.text);
            }
          }
        })
      }

      // Para debugging
      console.log('Planificación OAs:', planificacion.oas);
    })
  } else {
    // Caso sin planificaciones
    autoTable(doc, {
      body: [['No hay planificaciones registradas para este rango de fechas']],
      startY: 50,
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

  const nombreArchivo = `PlaCortoPlazo_Filtradas_${nombreCurso.value}_${new Date().toLocaleDateString('es-CL').replace(/\//g, '-')}`
  doc.save(`${nombreArchivo}.pdf`)
}

onMounted(async () => {
  await fetchProyectoEje()
  await fetchPlanificaciones()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span>Planificación corto plazo</span>

        <!-- botones -->
        <div class="space-x-2">
          <Button
            variant="outline"
            @click="descargarTodasLasPlanificaciones"
            :disabled="!planificacionesFiltradas?.length"
          >
            <Download class="mr-2 h-4 w-4" />
            Descargar Reporte Completo
          </Button>

          <!-- Botón para descargar planificaciones filtradas -->
          <Button
            v-if="mostrarFiltroFecha"
            variant="outline"
            @click="descargarPlanificacionesFiltradas"
            :disabled="!planificacionesFiltradas?.length || !filtroFecha.desde || !filtroFecha.hasta"
          >
            <Download class="mr-2 h-4 w-4" />
            Descargar Planificaciones Filtradas
          </Button>

          <CortoPlazoDialogoAgregar
            :existe-proyecto-eje="!!proyectoEje"
            @planificacion-creada="fetchPlanificaciones()"
          />
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
        {{ mostrarFiltroFecha ? 'Mostrando planificaciones filtradas por fecha' : 'Mostrando planificaciones de los últimos 5 días' }}
      </CardDescription>
      <Separator />
    </CardHeader>

    <Transition name="fade" mode="out-in">
      <CardContent v-if="!loadingPlanificaciones">
        <!-- si no hay un proyecto mediano plazo activo -->
        <InfoMensajeSinData
          v-if="!proyectoEje"
          icono="mantencion"
          mensaje="No hay un proyecto eje activo."
        />

        <div v-else class="flex flex-col gap-4">
          <Card class="border-green-500">
            <CardHeader>
              <CardDescription>Proyecto Eje en curso:</CardDescription>
              <CardTitle>{{ proyectoEje.proyecto_eje }}</CardTitle>
            </CardHeader>
          </Card>

          <div>
            <!-- si no hay planificaciones -->
            <InfoMensajeSinData
              v-if="!resumenPlanificaciones"
              icono="mantencion"
              mensaje="Aún no hay planificaciones a corto plazo."
            />

            <!-- si hay -->
            <div>
              <InfoMensajeSinData
                v-if="!planificacionesFiltradas || planificacionesFiltradas.length === 0"
                icono="mantencion"
                :mensaje="mostrarFiltroFecha ? 'No hay planificaciones en el rango seleccionado.' : 'No hay planificaciones en los últimos 5 días.'"
              />

              <Table v-else>
                <TableBody>
                  <TableRow
                    v-for="planificacion in planificacionesFiltradas"
                    :key="planificacion.id"
                    class="group flex min-h-20 items-center"
                  >
                    <TableCell class="w-full">
                      <Card>
                        <CardHeader>
                          <CardDescription>
                            <div class="flex items-start justify-between">
                              <p>{{ planificacion.fecha }}</p>
                              <div class="flex gap-2">
                                <Button
                                  variant="outline"
                                  class="hover:bg-primary/10 text-foreground"
                                  @click="descargarPlanificacionIndividual(planificacion)"
                                >
                                  <Download class="mr-2 h-4 w-4" />
                                  Descargar PDF
                                </Button>

                                <Dialog v-if="planificacion.fecha === diaActual">
                                  <DialogTrigger as-child>
                                    <Button variant="destructive">
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
                            </div>
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div class="flex flex-col gap-4">
                            <p class="flex flex-col">
                              <span class="font-bold">Recursos: </span>
                              <span>{{ planificacion.recursos }}</span>
                            </p>
                            <p class="flex flex-col">
                              <span class="font-bold">Instrumentos: </span>
                              <span>{{ planificacion.instrumentos }}</span>
                            </p>
                            <p class="flex flex-col">
                              <span class="font-bold">Inicio, desarrollo, y cierre: </span>
                              <span>{{ planificacion.inicioDesarrolloCierre }}</span>
                            </p>

                            <div class="border p-4">
                              <p class="flex flex-col">
                                <span class="font-bold">Objetivos de aprendizaje: </span>
                              </p>

                              <Accordion type="single" collapsible>
                                <AccordionItem
                                  v-for="oa in planificacion.oas"
                                  :key="oa.codigo_oa"
                                  :value="String(oa.codigo_oa)"
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
                      </Card>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Transition>
  </Card>
</template>
