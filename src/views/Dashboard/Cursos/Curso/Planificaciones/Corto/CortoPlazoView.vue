<script setup lang="ts">
import { Goal, Save, Trash2, Plus, Download } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
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

const nuevaPlanificacion = ref({
  fecha: '',
  recursos: '',
  instrumentosEvaluacion: '',
  inicioDesarrolloCierre: '',
})

// oas
const queryBasesOrdenadas = supabase
  .from('tp_bases_curriculares')
  .select(
    `
    id,
    descripcion_ambito,
    descripcion_nucleo,
    descripcion_oa
    `,
  )
  .eq('nivel', props.nivel)
  .order('descripcion_ambito')
  .order('descripcion_nucleo')
  .order('descripcion_oa')
  .order('id')
type BasesOrdenadas = QueryData<typeof queryBasesOrdenadas>
const basesCurriculares = ref<BasesOrdenadas | null>(null)

const selectedAmbito = ref<string>('')
const selectedNucleo = ref<string>('')
const selectedOa = ref<string>('')

const oasAgregados = ref<BasesOrdenadas>([])

// otros
const formularioValido = computed(() => {
  return (
    nuevaPlanificacion.value.fecha &&
    nuevaPlanificacion.value.recursos &&
    nuevaPlanificacion.value.instrumentosEvaluacion &&
    nuevaPlanificacion.value.inicioDesarrolloCierre &&
    oasAgregados.value.length > 0
  )
})

const diaActual = obtenerFechaActualComoYYYMMDD()

/**
 * genera un array con los ambitos para usar en el select
 */
const optionsAmbitos = computed(() => {
  if (!basesCurriculares.value) return []
  return [...new Set(basesCurriculares.value.map((b) => b.descripcion_ambito))]
})

/**
 * genera un array con los nucleos que corresponden al ambito seleccionado para usar en el select
 */
const optionsNucleos = computed(() => {
  if (!basesCurriculares.value) return []
  const filteredNucleos = basesCurriculares.value
    .filter((n) => n.descripcion_ambito === selectedAmbito.value)
    .map((b) => b.descripcion_nucleo)
  return [...new Set(filteredNucleos)]
})

/**
 * genera un array con los oa que corresponden al ambito y nucleo seleccionado para usar en el select
 */
const optionsOas = computed(() => {
  if (!basesCurriculares.value) return []
  const filteredOas = basesCurriculares.value.filter(
    (b) =>
      b.descripcion_ambito === selectedAmbito.value &&
      b.descripcion_nucleo === selectedNucleo.value,
  )
  const ordenados = filteredOas.sort((a, b) => a.id - b.id)
  return ordenados
})

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
 * trae las bases curriculares para los select
 */
async function fetchBasesCurriculares() {
  const { data, error } = await queryBasesOrdenadas
  if (error) errorStore.setError({ error, customCode: 500 })
  else basesCurriculares.value = data
}

/**
 * agrega un oa a la planificacion que esta siendo creada
 */
function agregarOa() {
  if (!basesCurriculares.value) return
  if (!selectedOa.value) return
  const oa = basesCurriculares.value.find((b) => b.id == Number(selectedOa.value))
  if (oa && !oasAgregados.value.some((item) => item.id === oa.id)) {
    oasAgregados.value.push(oa)
  }
  // selectedAmbito.value = ''
  // selectedNucleo.value = ''
  selectedOa.value = ''
}

/**
 * quita un oa de la planificacion que esta siendo creada
 * @param id
 */
function quitarOa(id: number) {
  oasAgregados.value = oasAgregados.value.filter((oa) => oa.id !== id)
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
 * guarda la planificacion en supabase
 */
async function guardarPlanificacion() {
  const { error } = await supabase.rpc('tx_crear_plan_corto', {
    planificacion: {
      rbd: authStore.perfil!.rbd_usuario,
      curso: nombreCurso.value,
      rut: authStore.perfil!.rut_usuario,
      ...nuevaPlanificacion.value,
      oas: [...oasAgregados.value.map((oa) => oa.id)],
    },
  })
  if (error) errorStore.setError({ error, customCode: 500 })
  else await fetchPlanificaciones()

  // limpiar formulario
  nuevaPlanificacion.value.fecha = ''
  nuevaPlanificacion.value.recursos = ''
  nuevaPlanificacion.value.instrumentosEvaluacion = ''
  nuevaPlanificacion.value.inicioDesarrolloCierre = ''
  oasAgregados.value = []
}

onMounted(async () => {
  await fetchProyectoEje()
  await fetchPlanificaciones()
  await fetchBasesCurriculares()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span> Planificacion corto plazo </span>

        <!-- botones -->
        <div class="space-x-2">
          <Button variant="secondary" disabled>
            <Download />
            <span> Descargar reporte </span>
          </Button>

          <Dialog>
            <DialogTrigger as-child>
              <Button :disabled="!proyectoEje">
                <Plus />
                <span> Crear planificacion </span>
              </Button>
            </DialogTrigger>

            <DialogScrollContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nueva planificacion</DialogTitle>
                <DialogDescription> </DialogDescription>
              </DialogHeader>

              <!-- calendario -->
              <FormKit
                type="date"
                label="Fecha"
                validation="required"
                validation-visibility="dirty"
                v-model="nuevaPlanificacion.fecha"
              />

              <!-- oas agregados -->
              <div class="mb-4">
                <Label> <p class="mb-2">Objetivos de aprendizaje</p></Label>

                <div class="border p-2">
                  <p v-if="!oasAgregados.length" class="mb-3 text-sm tracking-tight text-gray-600">
                    * Esta planificacion aun no tiene OAS
                  </p>
                  <ul v-else class="mb-3 grid grid-cols-1 gap-2">
                    <!-- <li v-for="oa in oasAgregados" :key="oa.id">
                      <HoverCard>
                        <HoverCardTrigger>
                          <div class="flex cursor-help items-center text-xs">
                            <span
                              class="truncate rounded-bl rounded-tl bg-gray-800 p-2 text-center font-bold text-white"
                            >
                              {{ oa.descripcion_oa }}
                            </span>
                            <button
                              @click="quitarOa(oa.id)"
                              class="rounded-br rounded-tr bg-red-700 px-2 py-2 text-white"
                            >
                              <Trash2 :size="16" />
                            </button>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <Card>
                            <CardContent class="flex flex-col gap-2 pt-4">
                              <p>
                                <span class="font-medium underline">Ambito:</span>
                                {{ oa.descripcion_ambito.toLocaleLowerCase() }}
                              </p>
                              <p>
                                <span class="font-medium underline">Nucleo:</span>
                                {{ oa.descripcion_nucleo.toLocaleLowerCase() }}
                              </p>
                              <p>
                                <span class="font-medium underline">OA:</span>
                                {{ oa.descripcion_oa.toLocaleLowerCase() }}
                              </p>
                            </CardContent>
                          </Card>
                        </HoverCardContent>
                      </HoverCard>
                    </li> -->
                    <Accordion type="single" collapsible>
                      <AccordionItem
                        value="COMUNICACION INTEGRAL"
                        v-if="
                          oasAgregados.find(
                            (oa) => oa.descripcion_ambito === 'COMUNICACION INTEGRAL',
                          )
                        "
                      >
                        <AccordionTrigger>
                          <p>
                            <span>
                              <Badge>
                                {{
                                  oasAgregados.filter(
                                    (o) => o.descripcion_ambito === 'COMUNICACION INTEGRAL',
                                  ).length
                                }}
                              </Badge>
                            </span>
                            Comunicación integral
                          </p>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p
                            class="mb-2"
                            v-for="oa in oasAgregados.filter(
                              (o) => o.descripcion_ambito === 'COMUNICACION INTEGRAL',
                            )"
                            :key="oa.id"
                          >
                            <button
                              @click="quitarOa(oa.id)"
                              class="bg-red-700 px-2 py-2 text-white"
                            >
                              <Trash2 :size="16" />
                            </button>
                            {{ oa.descripcion_oa.toLocaleLowerCase() }}
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="DESARROLLO PERSONAL Y SOCIAL"
                        v-if="
                          oasAgregados.find(
                            (oa) => oa.descripcion_ambito === 'DESARROLLO PERSONAL Y SOCIAL',
                          )
                        "
                      >
                        <AccordionTrigger>
                          <p>
                            <span>
                              <Badge>
                                {{
                                  oasAgregados.filter(
                                    (o) => o.descripcion_ambito === 'DESARROLLO PERSONAL Y SOCIAL',
                                  ).length
                                }}
                              </Badge>
                            </span>
                            Desarrollo personal y social
                          </p>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p
                            class="mb-2"
                            v-for="oa in oasAgregados.filter(
                              (o) => o.descripcion_ambito === 'DESARROLLO PERSONAL Y SOCIAL',
                            )"
                            :key="oa.id"
                          >
                            <button
                              @click="quitarOa(oa.id)"
                              class="bg-red-700 px-2 py-2 text-white"
                            >
                              <Trash2 :size="16" />
                            </button>
                            {{ oa.descripcion_oa.toLocaleLowerCase() }}
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="INTERACCION Y COMPRENSION DEL ENTORNO"
                        v-if="
                          oasAgregados.find(
                            (oa) =>
                              oa.descripcion_ambito === 'INTERACCION Y COMPRENSION DEL ENTORNO',
                          )
                        "
                      >
                        <AccordionTrigger>
                          <p>
                            <span>
                              <Badge>
                                {{
                                  oasAgregados.filter(
                                    (o) =>
                                      o.descripcion_ambito ===
                                      'INTERACCION Y COMPRENSION DEL ENTORNO',
                                  ).length
                                }}
                              </Badge>
                            </span>
                            Interacción y comprensión del entorno
                          </p>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p
                            class="mb-2"
                            v-for="oa in oasAgregados.filter(
                              (o) =>
                                o.descripcion_ambito === 'INTERACCION Y COMPRENSION DEL ENTORNO',
                            )"
                            :key="oa.id"
                          >
                            <button
                              @click="quitarOa(oa.id)"
                              class="bg-red-700 px-2 py-2 text-white"
                            >
                              <Trash2 :size="16" />
                            </button>
                            {{ oa.descripcion_oa.toLocaleLowerCase() }}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </ul>

                  <Dialog>
                    <DialogTrigger as-child>
                      <Button>
                        <Plus />
                        <span>Agregar</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Agregar OA</DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>

                      <div class="flex flex-col gap-4">
                        <!-- select ambito -->
                        <Select v-model="selectedAmbito">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un ambito" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem v-for="item in optionsAmbitos" :value="item" :key="item">
                                {{ item }}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        <!-- select nucleo -->
                        <Select v-model="selectedNucleo" :disabled="!selectedAmbito">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un nucleo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem v-for="item in optionsNucleos" :value="item" :key="item">
                                {{ item }}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        <!-- select oa -->
                        <Select v-model="selectedOa" :disabled="!selectedNucleo" class="w-[100px]">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un oa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem
                                v-for="item in optionsOas"
                                :value="String(item.id)"
                                :key="item.id"
                              >
                                <p class="max-w-xs text-ellipsis">
                                  {{ item.id }}. {{ item.descripcion_oa }}
                                </p>
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        <DialogFooter>
                          <DialogClose>
                            <Button
                              :disable="!selectedAmbito && !selectedNucleo && !selectedOa"
                              @click="agregarOa"
                            >
                              Agregar
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <!-- text area con la planificacion -->
              <div class="w-full">
                <Label> <p class="mb-2">Recursos</p></Label>
                <FormKit
                  v-model="nuevaPlanificacion.recursos"
                  type="textarea"
                  placeholder="Ingresa acá los recursos"
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="min-w-full"
                />
              </div>
              <div>
                <Label> <p class="mb-2">Instrumentos de evaluación</p></Label>
                <FormKit
                  v-model="nuevaPlanificacion.instrumentosEvaluacion"
                  type="textarea"
                  placeholder=" Ingresa acá los instrumentos de evaluación."
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="min-w-full"
                />
              </div>
              <div>
                <Label> <p class="mb-2">Inicio, desarrollo, y cierre</p></Label>
                <FormKit
                  v-model="nuevaPlanificacion.inicioDesarrolloCierre"
                  type="textarea"
                  placeholder=" Ingresa acá el inicio, desarrollo, y cierre."
                  validation="required"
                  validation-visibility="dirty"
                  outer-class="min-w-full"
                />
              </div>

              <!-- boton de guardar -->
              <DialogFooter>
                <DialogClose>
                  <Button @click="guardarPlanificacion" :disabled="!formularioValido">
                    <Save />
                    <span>Guardar</span>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogScrollContent>
          </Dialog>
        </div>
      </CardTitle>
      <CardDescription>Descripcion planificacion corto plazo.</CardDescription>
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
            <Table v-else>
              <TableBody>
                <TableRow
                  v-for="planificacion in resumenPlanificaciones"
                  :key="planificacion.id"
                  class="group flex min-h-20 items-center"
                >
                  <TableCell class="w-full">
                    <Card>
                      <CardHeader>
                        <CardDescription>
                          <div class="flex items-start justify-between">
                            <p>{{ planificacion.fecha }}</p>

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
      </CardContent>
    </Transition>
  </Card>
</template>
