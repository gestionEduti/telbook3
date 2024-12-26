<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// shadcn
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button/Button.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import Separator from '@/components/ui/separator/Separator.vue'
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
  FileSpreadsheet,
  Info,
  ListTodo,
  Loader,
} from 'lucide-vue-next'

// types
import type { FormKitFormData } from '@/types/nomina'

// prematricula store
import { usePrematriculaStore } from '@/stores/prematricula'
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
const prematriculaStore = usePrematriculaStore()

// data
const pasoActual = ref(1)

// methods
const procesarArchivo = async (data: FormKitFormData) => {
  const primerArchivo = data.license[0].file // viene 1 o mas archivos en un array. este es el primero
  await prematriculaStore.procesarArchivo(primerArchivo)
  pasoActual.value = 2
}
const cargarAlumnos = async () => {
  pasoActual.value = 3
  await prematriculaStore.cargarAlumnos()
}
const reiniciarProceso = async () => {
  pasoActual.value = 1
  prematriculaStore.reiniciarStore()
}
const salir = () => {
  prematriculaStore.reiniciarStore()
  router.push({ name: 'dashboard' })
}
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
          <StepperItem :step="1" disabled>
            <StepperTrigger>
              <StepperIndicator>
                <FileSpreadsheet />
              </StepperIndicator>
              <StepperTitle>Paso 1</StepperTitle>
              <StepperDescription>Cargar archivo</StepperDescription>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
          <StepperItem :step="2" disabled>
            <StepperTrigger>
              <StepperIndicator>
                <ListTodo />
              </StepperIndicator>
              <StepperTitle>Paso 2</StepperTitle>
              <StepperDescription>Confirmar</StepperDescription>
            </StepperTrigger>
          </StepperItem>
          <StepperItem :step="3" disabled>
            <StepperTrigger>
              <StepperIndicator>
                <Check />
              </StepperIndicator>
              <StepperTitle>Paso 3</StepperTitle>
              <StepperDescription>Finalizar</StepperDescription>
            </StepperTrigger>
          </StepperItem>
        </Stepper>
        <Separator class="my-4" />

        <!-- stepper content -->
        <div v-if="pasoActual === 1">
          <FormKit id="licenseForm" type="form" @submit="procesarArchivo" :actions="false">
            <template #default="{ state }">
              <FormKit
                type="file"
                label="Selecciona un archivo"
                name="license"
                help="Solo un archivo a la vez del tipo .xls"
                accept=".xls"
                validation="required"
              />
              <Button :disabled="state.loading" class="mx-auto">
                <Loader v-if="state.loading" class="mr-2 h-6 w-6 animate-spin" />
                Procesar archivo
                <ArrowRight />
              </Button>
            </template>
          </FormKit>
          <Separator class="my-4" />
        </div>

        <div v-else-if="pasoActual === 2" class="space-y-4">
          <Alert>
            <Info class="h-4 w-4" color="black" />
            <AlertTitle> Resumen </AlertTitle>
            <AlertDescription class="pt-4">
              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium"> Establecimiento </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold capitalize">
                      {{ prematriculaStore.nombreEstablecimiento }}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium"> RBD </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold capitalize">
                      {{ prematriculaStore.rbdEstablecimiento }}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium"> Cursos </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold">{{ prematriculaStore.totalCursos }}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium"> Alumnos </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-bold capitalize">
                      {{ prematriculaStore.totalAlumnos }}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AlertDescription>
          </Alert>

          <div class="flex space-x-2">
            <Button variant="outline" @click="pasoActual = 1">
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
                    <Button :disabled="prematriculaStore.loading" @click="cargarAlumnos">
                      <Loader v-if="prematriculaStore.loading" class="mr-2 h-6 w-6 animate-spin" />
                      Confirmar
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div v-else-if="pasoActual === 3" class="space-y-4">
          <Alert v-if="prematriculaStore.loading">
            <Loader v-if="prematriculaStore.loading" class="h-4 w-4 animate-spin" />
            <AlertTitle> Procesando </AlertTitle>
            <AlertDescription>
              Se estan cargando los alumnos y cursos en el sistema.
            </AlertDescription>
          </Alert>
          <Alert v-else>
            <Check class="h-4 w-4" />
            <AlertTitle> Finalizado </AlertTitle>
            <AlertDescription>
              <p class="py-2">Se han cargado exitosamente todos los alumnos.</p>
              <div class="flex space-x-2 pt-4">
                <Button variant="outline" @click="reiniciarProceso"> Comenzar de nuevo </Button>
                <Button @click="salir">Finalizar y volver al libro</Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
