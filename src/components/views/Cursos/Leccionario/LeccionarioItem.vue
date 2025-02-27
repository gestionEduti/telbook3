<script setup lang="ts">
import { ThumbsUp, ThumbsDown, Save, Goal, ClipboardPenLine, Download } from 'lucide-vue-next'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ResumenPlanificacionesItem {
  id: number
  estado: number
  recursos: string
  instrumentos: string
  inicioDesarrolloCierre: string
  oas: [
    {
      codigo_oa: number
      descripcion_oa: string
      descripcion_ambito: string
      descripcion_nucleo: string
    },
  ]
  fecha: string
}

const props = defineProps<{
  planificacion: ResumenPlanificacionesItem
}>()

const errorStore = useErrorStore()
const authStore = useAuthStore()
const mineducStore = useMineducStore()


const loading = ref(true)
const evaluacionInicial = ref<string>('') // evaluacion cuando carga el componente
const evaluacionComentario = ref<string>('')

// formulario
const evaluacionCombobox = ref<string>('') // evaluacion seleccionada
const otp = ref('') // codigo de verificacion
const comentario = ref('')

const colorCard = computed(() => {
  if (evaluacionInicial.value === 'positiva') return 'bg-green-100'
  if (evaluacionInicial.value === 'negativa') return 'bg-red-100'
  if (evaluacionInicial.value === '') return 'bg-gray-100'
})

async function fetchEvaluacion() {
  const { data, error } = await supabase
    .from('mv_leccionario')
    .select()
    .eq('id_planificacion', props.planificacion.id)
    .maybeSingle()
  if (error) errorStore.setError({ error, customCode: 500 })
  else {
    evaluacionInicial.value = data?.evaluacion || ''
    evaluacionComentario.value = data?.comentario || ''
  }
}

// JPS computed que guarda solo los perfiles permitidos para Registrar Leccionario
const puedeRegistrarLeccionario = computed(() => {
  const perfilesPermitidos = [1, 2, 3, 4, 6]
  return perfilesPermitidos.includes(authStore.perfil?.codigo_perfil_usuario ?? -1)
})

async function guardarEvaluacion() {
  evaluacionInicial.value = evaluacionCombobox.value

  // llamada a la api de mineduc
  const respuestaOTP = await mineducStore.validarOTP(otp.value)

  // guardar leccionario en supabase
  const { error } = await supabase.from('mv_leccionario').insert({
    id_planificacion: props.planificacion.id,
    evaluacion: evaluacionCombobox.value,
    comentario: comentario.value,
    otp: Number(otp.value),
    respuesta_otp: respuestaOTP,
    rut_usuario: authStore.perfil!.rut_usuario,
  })
  if (error) errorStore.setError({ error, customCode: 500 })

  await fetchEvaluacion()
  // Descargar PDF automáticamente después de guardar

}

// Agregar función para descargar PDF
async function descargarPDF() {
  try {
    const doc = new jsPDF()

    // Configuración inicial y logo
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
    doc.text('Leccionario', doc.internal.pageSize.width / 2, 15, { align: 'center' })

    // Subtítulo con información del curso
    doc.setFontSize(14)
    doc.setTextColor(52, 73, 94)
    //doc.text(`Curso: ${props.planificacion.}`, doc.internal.pageSize.width / 2, 25, { align: 'center' })

    // Fecha del leccionario
    autoTable(doc, {
      head: [['LECCIONARIO DIARIO']],
      body: [[`Fecha: ${props.planificacion.fecha}`]],
      startY: 35,
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

    // Detalles del leccionario
    autoTable(doc, {
      body: [
        ['Recursos', props.planificacion.recursos],
        ['Instrumentos', props.planificacion.instrumentos],
        ['Inicio, desarrollo y cierre', props.planificacion.inicioDesarrolloCierre]
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
    if (props.planificacion.oas && props.planificacion.oas.length > 0) {
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

      autoTable(doc, {
        head: [['Ámbito y Núcleo', 'Descripción del Objetivo']],
        body: props.planificacion.oas.map(oa => [
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
        }
      })
    }

    // Evaluación
    autoTable(doc, {
      head: [['EVALUACIÓN']],
      body: evaluacionInicial.value ? [
        [`Evaluación: ${evaluacionInicial.value}`],
        evaluacionComentario.value ? [`Observación: ${evaluacionComentario.value}`] : ['Sin observaciones']
      ] : [['Sin evaluación registrada']],
      startY: doc.lastAutoTable.finalY + 5,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontSize: 14,
        halign: 'left'
      }
    })

    // Pie de página con números de página
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

    // Guardar el PDF
    const nombreArchivo = `Leccionario_${props.planificacion.id}_${props.planificacion.fecha.replace(/\//g, '-')}`
    doc.save(`${nombreArchivo}.pdf`)

  } catch (error) {
    errorStore.setError({ error, customCode: 500 })
  }
}

onMounted(async () => {
  await fetchEvaluacion()
  loading.value = false
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div v-if="loading === false" class="group flex min-h-20 items-center">
      <div class="w-full">
        <Card>
          <CardHeader>
            <CardDescription class="flex items-center justify-between">
              <p>{{ planificacion.fecha }}</p>
              <Button
                variant="outline"
                size="sm"
                @click="descargarPDF"
                class="text-black hover:text-black hover:bg-gray-100"
              >
                <Download class="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
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

              <Card>
                <CardHeader :class="colorCard">
                  <CardTitle>Evaluación</CardTitle>
                </CardHeader>

                <CardContent :class="colorCard">
                  <!-- si es que tiene evaluacion -->
                  <div v-if="evaluacionInicial !== ''">
                    <div class="flex items-center gap-4">
                      <ThumbsUp v-if="evaluacionInicial === 'positiva'" />
                      <ThumbsDown v-else />
                      <span class="text-lg capitalize">{{ evaluacionInicial }}</span>
                    </div>
                    <p class="mt-4" v-if="evaluacionComentario !== ''">
                      <span class="font-bold">Observación: </span>
                      {{ evaluacionComentario }}
                    </p>
                  </div>

                  <div v-else>
                    <p class="mb-2 tracking-tight text-gray-700">
                      Este leccionario aún no tiene evaluación.
                    </p>

                    <Dialog>
                      <DialogTrigger
                                    as-child :disabled="!puedeRegistrarLeccionario"

                      >
                        <Button>
                          <ClipboardPenLine />
                          <span>Evaluar</span>
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogTitle>Evaluación</DialogTitle>
                        <DialogDescription>
                          Selecciona tu evaluación del leccionario
                        </DialogDescription>

                        <RadioGroup
                          v-model="evaluacionCombobox"
                          class="mb-2 grid w-48 grid-cols-2 gap-2"
                        >
                          <div>
                            <RadioGroupItem id="positiva" value="positiva" class="peer sr-only" />
                            <Label
                              for="positiva"
                              class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <span>Positiva</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem id="negativa" value="negativa" class="peer sr-only" />
                            <Label
                              for="negativa"
                              class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <span>Negativa</span>
                            </Label>
                          </div>
                        </RadioGroup>

                        <!-- text area con la planificacion -->
                        <Textarea
                          v-model="comentario"
                          placeholder=" Ingresa un comentario acerca de la evaluación."
                        />

                        <!-- input con el otp -->
                        <div class="grid gap-4 py-4">
                          <div class="grid grid-cols-4 items-center gap-4">
                            <Label for="codigo" class="text-right"> Codigo OTP </Label>
                            <Input id="codigo" class="col-span-3" v-model="otp" maxlength="6" />
                          </div>
                        </div>

                        <DialogFooter>
                          <DialogClose>
                            <Button
                              :disabled="evaluacionCombobox === '' || otp === '' || otp.length !== 6"
                              @click="guardarEvaluacion"
                            >
                              <Save />
                              <span>Guardar</span>
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </Transition>
</template>

<style></style>
