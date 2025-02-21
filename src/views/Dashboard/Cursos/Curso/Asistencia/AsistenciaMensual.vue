<script setup lang="ts">
import { Pencil, Save, LoaderCircle, FileDown } from 'lucide-vue-next'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const props = defineProps<{
  nivel: string
  letra: string
}>()

const loading = ref(true) // trayendo alumnos y asistencias de supabase
const saving = ref(false) // guardando edicion asistencia
const otp = ref('')

const nombreCurso = computed(() => props.nivel + props.letra)

const store = useAsistenciaMensualStore()

//JPS computed que  genera restricción de perfil dependiendo del tipo

const authStore = useAuthStore()

const puedeEditarAsistencia = computed(() => {
  const perfilesPermitidos = [1, 2, 4] // Super Administrador, Administrador y  JEFE UTP
  return perfilesPermitidos.includes(authStore.perfil?.codigo_perfil_usuario ?? -1)
})



/**
 * accion cuando se presiona el boton editar
 */
async function handleComenzarEdicion() {
  store.modoEdicion = true
  saving.value = false
}

/**
 * accion cuando se confirma ó cancela el dialogo con el otp
 * @param accion
 */
async function handleDialogo(accion: 'guardar' | 'cancelar') {
  if (accion === 'guardar') {
    store.guardarModificacionesAsistencia(otp.value)
    otp.value = ''
  } else {
    store.cancelarEdicionAsistencia()
    otp.value = ''
  }
}

/**
 * Genera y descarga el PDF con la asistencia mensual
 */
async function handleExportarPDF() {
  if (!store.asistencias || !store.alumnos?.length) return

  try {
    const doc = new jsPDF('l', 'mm', 'a4')

    // Obtener el año actual
    const año = new Date().getFullYear()

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

    // Encabezado
    doc.setFontSize(16)
    doc.text(`Asistencia Mensual - ${nombreCurso.value} - ${año}`, 15, 25)

    // Información adicional
    doc.setFontSize(12)
    doc.text(`RBD: ${authStore.perfil?.rbd_usuario}`, 15, 32)
    doc.text(`Mes: ${meses[store.mesSeleccionado]}`, 15, 39)

    // Preparar datos para la tabla
    const headers = ['Nombre']
    for (let i = 1; i <= store.cantidadDiasMesActual; i++) {
      headers.push(i.toString())
    }
    headers.push('T', 'P', 'A', '%P', '%A')

    // Generar datos de la tabla
    const data = store.alumnos.map(alumno => {
      const row = [alumno.nombre_completo_alumno]
      const asistenciasAlumno = store.asistencias[alumno.rut_alumno] || {}

      // Agregar estado de cada día
      for (let i = 1; i <= store.cantidadDiasMesActual; i++) {
        const estado = asistenciasAlumno[i]
        row.push(estado === 1 ? 'P' : estado === 0 ? 'A' : '-')
      }

      // Calcular totales
      let presentes = 0, ausentes = 0, total = 0
      Object.values(asistenciasAlumno).forEach(v => {
        if (v === 1) presentes++
        if (v === 0) ausentes++
        if (v === 0 || v === 1) total++
      })

      // Agregar totales
      row.push(
        total.toString(),
        presentes.toString(),
        ausentes.toString(),
        total ? Math.round((presentes/total)*100).toString() + '%' : '0%',
        total ? Math.round((ausentes/total)*100).toString() + '%' : '0%'
      )

      return row
    })

    // Generar tabla
    doc.autoTable({
      head: [headers],
      body: data,
      foot: [
        // Agregar filas de totales
        ['Presente', ...Array(store.cantidadDiasMesActual).fill(0).map((_, i) =>
          Object.values(store.asistencias).reduce((sum, alumno) =>
            alumno[i + 1] === 1 ? sum + 1 : sum, 0
          )
        )],
        ['Ausente', ...Array(store.cantidadDiasMesActual).fill(0).map((_, i) =>
          Object.values(store.asistencias).reduce((sum, alumno) =>
            alumno[i + 1] === 0 ? sum + 1 : sum, 0
          )
        )],
        ['Total', ...Array(store.cantidadDiasMesActual).fill(0).map((_, i) =>
          Object.values(store.asistencias).reduce((sum, alumno) =>
            (alumno[i + 1] === 0 || alumno[i + 1] === 1) ? sum + 1 : sum, 0
          )
        )]
      ],
      startY: 45,
      styles: {
        fontSize: 8,
        cellPadding: 1,
        lineColor: [80, 80, 80],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      footStyles: {
        fillColor: [245, 245, 245],
        textColor: [70, 70, 70],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 40 },
      },
      didDrawCell: function(data) {
        if (data.section === 'body' && data.column.index > 0 && data.column.index <= store.cantidadDiasMesActual) {
          const cellText = data.cell.text[0];
          if (cellText === 'P') {
            doc.setFillColor(34, 197, 94); // Verde
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
            doc.setTextColor(255, 255, 255);
            doc.text('P', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, { align: 'center', baseline: 'middle' });
          } else if (cellText === 'A') {
            doc.setFillColor(248, 113, 113); // Rojo
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
            doc.setTextColor(255, 255, 255);
            doc.text('A', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, { align: 'center', baseline: 'middle' });
          } else {
            doc.setFillColor(209, 213, 219); // Gris
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
            doc.setTextColor(0, 0, 0);
            doc.text('-', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, { align: 'center', baseline: 'middle' });
          }
        }
      },
      didDrawPage: function(data) {
        // Agregar leyenda al pie de página
        const pageHeight = doc.internal.pageSize.height
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')

        // Posicionar la leyenda más abajo para dar espacio a los totales
        const startY = pageHeight - 25
        doc.text('Leyenda:', 15, startY)

        doc.setFont('helvetica', 'normal')
        doc.text('T: Días Trabajados', 15, startY + 5)
        doc.text('P: Días Presente', 15, startY + 10)
        doc.text('A: Días Ausentes', 15, startY + 15)
        doc.text('%P: Porcentaje de asistencia', 80, startY + 5)
        doc.text('%A: Porcentaje de Inasistencia', 80, startY + 10)
      }
    })

    doc.save(`asistencia_${nombreCurso.value}_${meses[store.mesSeleccionado]}.pdf`)
  } catch (error) {
    console.error('Error al exportar PDF:', error)
  }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([
    store.fetchAlumnosCurso(nombreCurso.value),
    store.fetchAsistenciasMes(nombreCurso.value),
  ])
  loading.value = false
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <Card v-if="store.alumnos" :class="store.modoEdicion ? 'bg-red-50' : ''">
      <CardHeader>
        <div class="flex justify-between items-center">
          <div>
            <CardTitle>Asistencia mensual</CardTitle>
            <CardDescription>Descripcion asistencia mensual.</CardDescription>
          </div>

          <!-- Botón de exportar simplificado -->
          <Button
            variant="outline"
            class="gap-2"
            @click="handleExportarPDF"
            :disabled="!store.asistencias || !store.alumnos?.length"
          >
            <FileDown class="h-4 w-4" />
            <span>Exportar PDF</span>
          </Button>
        </div>
        <Separator />
      </CardHeader>

      <CardContent v-if="store.alumnos.length">
        <!-- selector mes -->
        <div class="mb-6 flex items-end justify-between gap-0">
          <div>
            <Select
              :disabled="store.modoEdicion"
              v-model="store.mesSeleccionado"
              @update:model-value="store.fetchAsistenciasMes(nombreCurso)"
            >
            <SelectTrigger class="w-48 border-gray-400">
              <SelectValue placeholder="Selecciona un mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mes</SelectLabel>
                  <SelectItem value="1">Enero</SelectItem>
                  <SelectItem value="2">Febrero</SelectItem>
                  <SelectItem value="3">Marzo</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Mayo</SelectItem>
                  <SelectItem value="6">Junio</SelectItem>
                  <SelectItem value="7">Julio</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Septiembre</SelectItem>
                  <SelectItem value="10">Octubre</SelectItem>
                  <SelectItem value="11">Noviembre</SelectItem>
                  <SelectItem value="12">Diciembre</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Transition name="fade" mode="out-in">
            <div v-if="store.asistencias">
              <!-- boton para comenzar a editar -->
              <Button v-if="!store.modoEdicion"
                      @click="handleComenzarEdicion" class="w-24"
                      :disabled="!puedeEditarAsistencia">
                <Pencil />
                <span>editar</span>
              </Button>

              <!-- boton de guardar -->
              <AlertDialog v-else>
                <AlertDialogTrigger>
                  <Button
                    class="w-42 bg-red-500 hover:bg-red-700"
                    :disabled="saving"
                    @click="saving = true"
                  >
                    <Save v-if="!saving" />
                    <LoaderCircle v-else class="animate-spin" />
                    <span v-if="!saving">Guardar cambios</span>
                    <span v-else>Guardando cambios</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirma los cambios?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Debes ingresar el codigo de verificacion para poder firmar la edición.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                      <Label for="codigo" class="text-right"> Codigo </Label>
                      <Input id="codigo" class="col-span-3" v-model="otp" maxlength="6" />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel @click="handleDialogo('cancelar')">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction @click="handleDialogo('guardar')">
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Transition>
        </div>

        <!-- asistencias -->
        <Transition name="fade" mode="out-in">
          <div v-if="!loading">
            <Transition name="fade" mode="out-in">
              <div v-if="store.asistencias">
                <!-- encabezados superiores -->
                <div :class="`telbook-label mb-1 grid grid-cols-[repeat(43,minmax(0,1fr))] gap-1`">
                  <p class="col-span-5 pr-2 text-right">Nombre</p>
                  <p
                    v-for="dia in store.cantidadDiasMesActual"
                    :key="dia"
                    class="col-span-1 text-center"
                  >
                    {{ dia }}
                  </p>
                  <p class="col-span-1 -col-start-8 text-center">T</p>
                  <p class="col-span-1 -col-start-7 text-center">P</p>
                  <p class="col-span-1 -col-start-6 text-center">A</p>
                  <p class="col-span-2 -col-start-5 text-center">%P</p>
                  <p class="col-span-2 -col-start-3 text-center">%A</p>
                </div>

                <!-- alumnos -->
                <AsistenciaMensualAlumno
                  v-for="alumno in store.alumnos"
                  :key="alumno.rut_alumno"
                  :alumno
                />

                <!-- encabezados inferiores -->
                <div :class="`telbook-label mb-1 grid grid-cols-[repeat(43,minmax(0,1fr))] gap-1`">
                  <p class="col-span-5 pr-2 text-right"></p>
                  <p
                    v-for="dia in store.cantidadDiasMesActual"
                    :key="dia"
                    class="col-span-1 text-center"
                  >
                    {{ dia }}
                  </p>
                </div>

                <!-- resumen por dia -->
                <AsistenciaMensualResumenPorDia />
              </div>

              <InfoMensajeSinData v-else icono="vacio" mensaje="No hay asistencias este mes" />
            </Transition>
          </div>
        </Transition>
      </CardContent>

      <CardContent v-else>
        <InfoMensajeSinData
          icono="vacio"
          mensaje="No hay alumnos en el curso"
          :dias="store.cantidadDiasMesActual || 31"
        />
      </CardContent>
    </Card>
  </Transition>
</template>
