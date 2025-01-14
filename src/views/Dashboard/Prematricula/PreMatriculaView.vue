<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { supabase } from '@/services/supabaseClient'
import { useRouter } from 'vue-router'
const router = useRouter()

// shadcn
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button/Button.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import StepperIndicator from '@/components/ui/stepper/StepperIndicator.vue'
import Alert from '@/components/ui/alert/Alert.vue'
import AlertTitle from '@/components/ui/alert/AlertTitle.vue'
import AlertDescription from '@/components/ui/alert/AlertDescription.vue'
import AlertDialog from '@/components/ui/alert-dialog/AlertDialog.vue'
import AlertDialogTrigger from '@/components/ui/alert-dialog/AlertDialogTrigger.vue'
import AlertDialogContent from '@/components/ui/alert-dialog/AlertDialogContent.vue'
import AlertDialogTitle from '@/components/ui/alert-dialog/AlertDialogTitle.vue'
import AlertDialogDescription from '@/components/ui/alert-dialog/AlertDialogDescription.vue'
import AlertDialogHeader from '@/components/ui/alert-dialog/AlertDialogHeader.vue'
import AlertDialogFooter from '@/components/ui/alert-dialog/AlertDialogFooter.vue'
import AlertDialogCancel from '@/components/ui/alert-dialog/AlertDialogCancel.vue'
import AlertDialogAction from '@/components/ui/alert-dialog/AlertDialogAction.vue'
import RadioGroupItem from '@/components/ui/radio-group/RadioGroupItem.vue'
import RadioGroup from '@/components/ui/radio-group/RadioGroup.vue'
import Label from '@/components/ui/label/Label.vue'
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  FileCog,
  FileSpreadsheet,
  Info,
  Loader,
  SquareCheckBig,
} from 'lucide-vue-next'

// types
import type { FormKitFormDataXls, FormKitFormDataPdf } from '@/types/nomina'
// prematricula store
import { useErrorStore } from '@/stores/error'
import { usePrematriculaXlsStore } from '@/stores/prematriculaxls'
import { usePrematriculaPdfStore } from '@/stores/prematriculapdf'
const prematriculaXlsStore = usePrematriculaXlsStore()
const prematriculaPdfStore = usePrematriculaPdfStore()
const {
  loading: loadingXls,
  resultadoResumen: resultadoResumenXls,
  rbdEstablecimiento: rbdEstablecimientoXls,
  nombreEstablecimiento: nombreEstablecimientoXls,
  totalAlumnos: totalAlumnosXls,
  totalCursos: totalCursosXls,
} = storeToRefs(prematriculaXlsStore)
const {
  loading: loadingPdf,
  establecimiento: establecimientoPdf,
  resultadoResumen: resultadoResumenPdf,
  rbdEstablecimiento: rbdEstablecimientoPdf,
  nombreEstablecimiento: nombreEstablecimientoPdf,
  totalAlumnos: totalAlumnosPdf,
} = storeToRefs(prematriculaPdfStore)

// data
const pasoActual = ref(1)
const formatoArchivoSeleccionado = ref<string>('')
const establecimientosSelect = ref<{ value: number | null; label: string | null }[]>([])

// methods
const procesarArchivoPdf = async (data: FormKitFormDataPdf) => {
  establecimientoPdf.value = data.razon_social
  const primerArchivo = data.license[0].file // viene 1 o mas archivos en un array. este es el primero
  await prematriculaPdfStore.procesarArchivo(primerArchivo)
  pasoActual.value = 3
}
const procesarArchivoXls = async (data: FormKitFormDataXls) => {
  const primerArchivo = data.license[0].file // viene 1 o mas archivos en un array. este es el primero
  await prematriculaXlsStore.procesarArchivo(primerArchivo)
  pasoActual.value = 3
}
const enviarAlumnosSupabase = async () => {
  pasoActual.value = 4
  if (formatoArchivoSeleccionado.value === 'pdf') {
    await prematriculaPdfStore.cargarAlumnos()
  } else {
    await prematriculaXlsStore.cargarAlumnos()
  }
}
const reiniciarProceso = async () => {
  formatoArchivoSeleccionado.value = ''
  prematriculaXlsStore.reiniciarStore()
  prematriculaPdfStore.reiniciarStore()
  pasoActual.value = 1
}
const salir = () => {
  prematriculaXlsStore.reiniciarStore()
  prematriculaPdfStore.reiniciarStore()
  router.push({ name: 'dashboard' })
}

onMounted(async () => {
  const { data, error, status } = await supabase
    .from('tp_establecimientos')
    .select('rbd,razon_social')
    .order('razon_social')
  if (error) useErrorStore().setError({ error: error, customCode: status })
  else
    establecimientosSelect.value = data.map((item) => ({
      value: item.rbd,
      label: item.razon_social,
    }))
})
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <Card>
      <CardHeader>
        <CardTitle>
          <p>Pre matricula</p>
        </CardTitle>
        <CardDescription>
          Realiza la carga de una nomina de alumnos para la pre-matricula.
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent>
        <!-- stepper -->
        <Stepper v-model="pasoActual">
          <StepperItem :step="1" disabled class="w-32 justify-center text-center">
            <StepperTrigger>
              <StepperIndicator>
                <FileSpreadsheet />
              </StepperIndicator>
              <StepperTitle>Paso 1</StepperTitle>
              <StepperDescription>Tipo archivo</StepperDescription>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
          <StepperItem :step="2" disabled class="w-32 justify-center text-center">
            <StepperTrigger>
              <StepperIndicator>
                <!-- <ListTodo /> -->
                <FileCog />
              </StepperIndicator>
              <StepperTitle>Paso 2</StepperTitle>
              <StepperDescription>Procesar archivo</StepperDescription>
            </StepperTrigger>
          </StepperItem>
          <StepperItem :step="3" disabled class="w-32 justify-center text-center">
            <StepperTrigger>
              <StepperIndicator>
                <SquareCheckBig />
              </StepperIndicator>
              <StepperTitle>Paso 3</StepperTitle>
              <StepperDescription>Confirmar</StepperDescription>
            </StepperTrigger>
          </StepperItem>
          <StepperItem :step="4" disabled class="w-32 justify-center text-center">
            <StepperTrigger>
              <StepperIndicator>
                <CheckCheck />
              </StepperIndicator>
              <StepperTitle>Paso 4</StepperTitle>
              <StepperDescription>Finalizar</StepperDescription>
            </StepperTrigger>
          </StepperItem>
        </Stepper>
        <Separator class="my-4" />

        <!-- stepper content -->
        <div v-if="pasoActual === 1">
          <p class="formkit-label mb-2 text-sm font-bold text-neutral-700 dark:text-neutral-300">
            Selecciona el tipo de nomina:
          </p>
          <RadioGroup v-model="formatoArchivoSeleccionado" class="mb-2 grid w-48 grid-cols-2 gap-2">
            <div>
              <RadioGroupItem id="pdf" value="pdf" class="peer sr-only" />
              <Label
                for="pdf"
                class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>PDF</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem id="excel" value="xls" class="peer sr-only" />
              <Label
                for="excel"
                class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Excel</span>
              </Label>
            </div>
          </RadioGroup>
          <Button v-if="formatoArchivoSeleccionado" class="mx-auto" @click="pasoActual = 2">
            <span>Continuar</span>
            <ArrowRight />
          </Button>
        </div>

        <div v-if="pasoActual === 2">
          <!-- formulario para pdf -->
          <FormKit
            v-if="formatoArchivoSeleccionado === 'pdf'"
            id="licenseForm"
            type="form"
            @submit="procesarArchivoPdf"
            :actions="false"
            :config="{ validationVisibility: 'submit' }"
          >
            <template #default="{ state }">
              <FormKit
                type="select"
                label="Selecciona un establecimiento"
                name="razon_social"
                help="La prematricula se realizará para el establecimiento seleccionado"
                validation="required"
                :options="establecimientosSelect"
              />
              <FormKit
                type="file"
                label="Selecciona un archivo"
                name="license"
                help="Solo un archivo a la vez del tipo .pdf"
                accept=".pdf"
                validation="required"
              />
              <div class="flex space-x-2">
                <Button variant="outline" @click="reiniciarProceso">
                  <ArrowLeft class="mr-2" />
                  Volver
                </Button>
                <Button :disabled="state.loading || !state.valid" class="mx-auto">
                  <Loader v-if="state.loading" class="mr-2 h-6 w-6 animate-spin" />
                  Procesar archivo
                  <ArrowRight />
                </Button>
              </div>
            </template>
          </FormKit>

          <!-- formulario para xls -->
          <FormKit
            v-else
            id="licenseForm"
            type="form"
            @submit="procesarArchivoXls"
            :actions="false"
            :config="{ validationVisibility: 'submit' }"
          >
            <template #default="{ state }">
              <FormKit
                type="file"
                label="Selecciona un archivo"
                name="license"
                :help="`Solo un archivo a la vez del tipo ${formatoArchivoSeleccionado === 'pdf' ? '.pdf' : '.xls'}`"
                :accept="formatoArchivoSeleccionado === 'pdf' ? '.pdf' : '.xls'"
                validation="required"
              />
              <div class="flex space-x-2">
                <Button variant="outline" @click="reiniciarProceso">
                  <ArrowLeft class="mr-2" />
                  Volver
                </Button>
                <Button :disabled="state.loading || !state.valid" class="mx-auto">
                  <Loader v-if="state.loading" class="mr-2 h-6 w-6 animate-spin" />
                  Procesar archivo
                  <ArrowRight />
                </Button>
              </div>
            </template>
          </FormKit>
          <Separator class="my-4" />
        </div>

        <div v-else-if="pasoActual === 3" class="space-y-4">
          <Alert>
            <Info class="h-4 w-4" color="black" />
            <AlertTitle>
              A continuacion un resumen de la informacion extraida de la nomina que sera agregada a
              la base de datos:
            </AlertTitle>
            <AlertDescription class="pt-4">
              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card v-if="formatoArchivoSeleccionado === 'xls'">
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium"> Establecimiento </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold capitalize">
                      <span>
                        {{ nombreEstablecimientoXls }}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium"> RBD </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold capitalize">
                      <span v-if="formatoArchivoSeleccionado === 'pdf'">
                        {{ establecimientoPdf }}
                      </span>
                      <span v-else>
                        {{ rbdEstablecimientoXls }}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card v-if="formatoArchivoSeleccionado === 'xls'">
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium"> Cursos </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold">
                      <span>
                        {{ totalCursosXls }}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium"> Alumnos </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold capitalize">
                      <span v-if="formatoArchivoSeleccionado === 'pdf'">
                        {{ totalAlumnosPdf }}
                      </span>
                      <span v-else>
                        {{ totalAlumnosXls }}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AlertDescription>
          </Alert>

          <div class="flex space-x-2">
            <Button variant="outline" @click="reiniciarProceso">
              <ArrowLeft />
              Volver
            </Button>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button>Confirmar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirma la observacion?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta accion va a reemplazar todos los alumnos del libro actual del
                    establecimiento indicado.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction as-child>
                    <Button :disabled="loadingPdf || loadingXls" @click="enviarAlumnosSupabase">
                      <Loader v-if="loadingPdf || loadingXls" class="mr-2 h-6 w-6 animate-spin" />
                      Confirmar
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div v-else-if="pasoActual === 4" class="space-y-4">
          <Alert v-if="loadingPdf || loadingXls">
            <Loader v-if="loadingPdf || loadingXls" class="h-4 w-4 animate-spin" />
            <AlertTitle> Procesando </AlertTitle>
            <AlertDescription>
              Se estan cargando los alumnos y cursos en el sistema.
            </AlertDescription>
          </Alert>
          <Alert v-else>
            <Check class="h-4 w-4" />
            <AlertTitle> Finalizado </AlertTitle>
            <AlertDescription>
              <!-- caso pdf -->
              <template v-if="formatoArchivoSeleccionado == 'pdf'">
                <p class="py-2">Archivo PDF cargado exitosamente</p>
              </template>

              <!-- caso xls -->
              <template v-else>
                <p class="py-2">Resumen de los datos cargados:</p>
                <Alert>
                  <AlertDescription>
                    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader
                          class="flex flex-row items-center justify-between space-y-0 pb-2"
                        >
                          <CardTitle class="text-sm font-medium"> Establecimiento </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div class="text-2xl font-bold capitalize">
                            <span v-if="formatoArchivoSeleccionado === 'pdf'">
                              {{ nombreEstablecimientoPdf }}
                            </span>
                            <span v-else>
                              {{ nombreEstablecimientoXls }}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader
                          class="flex flex-row items-center justify-between space-y-0 pb-2"
                        >
                          <CardTitle class="text-sm font-medium"> RBD </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div class="text-2xl font-bold capitalize">
                            <span v-if="formatoArchivoSeleccionado === 'pdf'">
                              {{ rbdEstablecimientoPdf }}
                            </span>
                            <span v-else>
                              {{ rbdEstablecimientoXls }}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader
                          class="flex flex-row items-center justify-between space-y-0 pb-2"
                        >
                          <CardTitle class="text-sm font-medium"> Cursos </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div class="flex items-center space-x-2 text-2xl font-bold">
                            <span v-if="formatoArchivoSeleccionado === 'pdf'">
                              {{ resultadoResumenPdf.cursos }}
                            </span>
                            <span v-else>
                              {{ resultadoResumenXls.cursos }}
                            </span>
                            <Check class="text-green-500" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader
                          class="flex flex-row items-center justify-between space-y-0 pb-2"
                        >
                          <CardTitle class="text-sm font-medium"> Alumnos </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div class="flex items-center space-x-2 text-2xl font-bold capitalize">
                            <span v-if="formatoArchivoSeleccionado === 'pdf'">
                              {{ resultadoResumenPdf.alumnos }}
                            </span>
                            <span v-else>
                              {{ resultadoResumenXls.alumnos }}
                            </span>
                            <Check class="text-green-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </AlertDescription>
                </Alert>
                <div class="flex space-x-2 pt-4">
                  <Button variant="outline" @click="reiniciarProceso"> Comenzar de nuevo </Button>
                  <Button @click="salir">Finalizar y volver al libro</Button>
                </div>
              </template>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
