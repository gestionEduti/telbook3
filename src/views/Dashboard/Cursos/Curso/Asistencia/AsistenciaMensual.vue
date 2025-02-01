<script setup lang="ts">
import { Pencil, Save, LoaderCircle } from 'lucide-vue-next'

const props = defineProps<{
  nivel: string
  letra: string
}>()

const loading = ref(true) // trayendo alumnos y asistencias de supabase
const saving = ref(false) // guardando edicion asistencia
const otp = ref('')

const nombreCurso = computed(() => props.nivel + props.letra)

const store = useAsistenciaMensualStore()

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
        <CardTitle>Asistencia mensual</CardTitle>
        <CardDescription>Descripcion asistencia mensual.</CardDescription>
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
              <Button v-if="!store.modoEdicion" @click="handleComenzarEdicion" class="w-24">
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
