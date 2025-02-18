<script setup lang="ts">
import { Goal, Trash2, Download } from 'lucide-vue-next'
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

// otros
const diaActual = obtenerFechaActualComoYYYMMDD()

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

onMounted(async () => {
  await fetchProyectoEje()
  await fetchPlanificaciones()
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

          <CortoPlazoDialogoAgregar
            :existe-proyecto-eje="!!proyectoEje"
            @planificacion-creada="fetchPlanificaciones()"
          />
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
