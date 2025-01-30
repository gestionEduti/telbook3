<script setup lang="ts">
import { Pencil, Save } from 'lucide-vue-next'

const props = defineProps<{
  nivel: string
  letra: string
}>()

const loading = ref(true)

const nombreCurso = computed(() => props.nivel + props.letra)

const store = useAsistenciaMensualStore()

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
            <Label>Mes seleccionado</Label>
            <Select
              :disabled="store.modoEdicion"
              v-model="store.mesSeleccionado"
              @update:model-value="store.fetchAsistenciasMes(nombreCurso)"
            >
              <SelectTrigger class="w-64">
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
              <Button v-if="!store.modoEdicion" @click="store.modoEdicion = true" class="w-24">
                <Pencil />
                <span>editar</span>
              </Button>

              <!-- boton de guardar -->
              <AlertDialog v-else>
                <AlertDialogTrigger>
                  <Button class="w-42 bg-red-500 hover:bg-red-700">
                    <Save />
                    <span>Guardar cambios</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirma los cambios?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction @click="store.guardarModificacionesAsistencia">
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
                <!-- encabezados -->
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

                <!-- encabezados -->
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
