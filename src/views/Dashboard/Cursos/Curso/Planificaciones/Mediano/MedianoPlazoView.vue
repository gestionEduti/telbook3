<script setup lang="ts">
import { OctagonX, Goal } from 'lucide-vue-next'

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

onMounted(async () => {
  await fetchPlanificaciones()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span>Planificacion mediano plazo</span>

        <!-- botones -->
        <MedianoPlazoDialogoAgregar
          :buttonDisabled="cursoTienePlanificacionActiva"
          @planificacion-creada="fetchPlanificaciones()"
        />
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
