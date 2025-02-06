<script setup lang="ts">
import { OctagonX, Goal, Trash2, CalendarPlus2, Pen, Plus } from 'lucide-vue-next'

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

const dataFormulario = ref({
  semanas: '1',
  proyectoEje: '',
  objetivosGenerales: '',
  estrategias: '',
  cierre: '',
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
    dataFormulario.value.objetivosGenerales &&
    dataFormulario.value.estrategias &&
    dataFormulario.value.cierre &&
    oasAgregados.value.length > 0
  )
})

const cursoTienePlanificacionActiva = computed(() => {
  return resumenPlanificaciones.value?.some((p) => p.estado === 1)
})

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
  return filteredOas
})

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
  selectedAmbito.value = ''
  selectedNucleo.value = ''
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
 * guarda la planificacion en supabase
 */
async function guardarPlanificacion() {
  const { error } = await supabase.rpc('tx_crear_plan_mediano', {
    planificacion: {
      rbd: authStore.perfil!.rbd_usuario,
      curso: nombreCurso.value,
      ...dataFormulario.value,
      oas: [...oasAgregados.value.map((oa) => oa.id)],
    },
  })
  if (error) errorStore.setError({ error, customCode: 500 })
  else await fetchPlanificaciones()
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

onMounted(async () => {
  await fetchPlanificaciones()
  fetchBasesCurriculares()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span>Planificacion mediano plazo</span>

        <!-- botones -->
        <Dialog>
          <!-- boton de trigger del dialog -->
          <DialogTrigger as-child>
            <!-- habilitado -->
            <Button v-if="!cursoTienePlanificacionActiva">
              <CalendarPlus2 />
              <span> Crear planificacion </span>
            </Button>

            <!-- deshabilitado -->
            <TooltipProvider v-else>
              <Tooltip :delay-duration="0">
                <TooltipTrigger class="cursor-not-allowed">
                  <Button disabled>
                    <CalendarPlus2 />
                    <span> Crear planificacion </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ya existe un proyecto activo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva planificacion</DialogTitle>
              <DialogDescription> </DialogDescription>
            </DialogHeader>

            <!-- semanas -->
            <div>
              <Label> <p class="mb-2">Semanas</p></Label>
              <FormKit v-model="dataFormulario.semanas" type="number" value="1" step="1" />
            </div>

            <!-- proyecto eje -->
            <div>
              <Label> <p class="mb-2">Proyecto eje</p></Label>
              <FormKit
                v-model="dataFormulario.proyectoEje"
                type="text"
                placeholder="Ingresa acá el proyecto eje"
                validation="required"
                validation-visibility="dirty"
                outer-class="min-w-full"
              />
            </div>

            <!-- oas agregados -->
            <div class="mb-4">
              <Label> <p class="mb-2">Objetivos de aprendizaje</p></Label>

              <div class="border p-2">
                <p v-if="!oasAgregados.length" class="mb-3 text-sm tracking-tight text-gray-600">
                  * Esta planificacion aun no tiene OAS
                </p>
                <ul v-else class="mb-3 grid grid-cols-5 gap-2">
                  <li v-for="oa in oasAgregados" :key="oa.id">
                    <HoverCard>
                      <HoverCardTrigger>
                        <div class="flex cursor-help items-center text-xs">
                          <span
                            class="w-12 rounded-bl rounded-tl bg-gray-800 p-2 text-center font-bold text-white"
                          >
                            {{ oa.id }}
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
                          <CardHeader>
                            <CardTitle>№ {{ oa.id }}</CardTitle>
                          </CardHeader>
                          <CardContent class="flex flex-col gap-2">
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
                  </li>
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
              <Label> <p class="mb-2">Objetivos generales</p></Label>
              <FormKit
                v-model="dataFormulario.objetivosGenerales"
                type="textarea"
                placeholder="Ingresa acá los objetivos generales"
                validation="required"
                validation-visibility="dirty"
                outer-class="min-w-full"
              />
            </div>
            <div>
              <Label> <p class="mb-2">Estrategias para alcanzar el proyecto</p></Label>
              <FormKit
                v-model="dataFormulario.estrategias"
                type="textarea"
                placeholder=" Ingresa acá las estrategias."
                validation="required"
                validation-visibility="dirty"
                outer-class="min-w-full"
              />
            </div>
            <div>
              <Label> <p class="mb-2">Cierre del proyecto</p></Label>
              <FormKit
                v-model="dataFormulario.cierre"
                type="textarea"
                placeholder=" Ingresa acá el cierre del proyecto."
                validation="required"
                validation-visibility="dirty"
                outer-class="min-w-full"
              />
            </div>

            <!-- boton de guardar -->
            <DialogFooter>
              <DialogClose>
                <Button @click="guardarPlanificacion" :disabled="!formularioValido">
                  <Pen />
                  <span>Crear planificacion</span>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardTitle>
      <CardDescription>Descripcion planificacion mediano plazo.</CardDescription>
      <Separator />
    </CardHeader>

    <Transition name="fade" mode="out-in">
      <CardContent v-if="!loadingPlanificaciones">
        <!-- si no hay planificaciones -->
        <InfoMensajeSinData
          v-if="!resumenPlanificaciones || !resumenPlanificaciones.length"
          icono="vacio"
          mensaje="No hay planificaciones"
        />

        <Table v-else>
          <TableBody>
            <TableRow
              v-for="planificacion in resumenPlanificaciones"
              :key="planificacion.id"
              class="group flex min-h-20 items-center"
            >
              <TableCell class="w-full">
                <Card :class="planificacion.estado === 1 ? 'border-green-500' : 'bg-gray-100'">
                  <CardHeader>
                    <CardTitle> Proyecto eje: {{ planificacion.proyecto_eje }} </CardTitle>

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
