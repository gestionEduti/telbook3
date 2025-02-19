<script setup lang="ts">
import { Plus, OctagonX, NotebookText, Users } from 'lucide-vue-next'

const authStore = useAuthStore()
const errorStore = useErrorStore()

const props = defineProps<{
  nivel: string
  letra: string
}>()

const nombreCurso = computed(() => props.nivel + props.letra)

// registros fonoaudiologicos
interface ResumenInterface {
  id: number
  alumnos: [
    {
      id: number
      rut_alumno: string
      nombre_completo: string
    },
  ]
  contenidos: [string]
  fecha_evaluacion: string
  modalidad_evaluacion: string
  observaciones_fonoaudiologicas: string
}

const registrosFonoaudiologicos = ref<ResumenInterface[] | null>(null)
async function fetchRegistros() {
  const { data, error } = await supabase.rpc('resumen_modulo_tel', {
    colegio: authStore.perfil!.rbd_usuario,
    curso: nombreCurso.value,
  })
  if (error) {
    errorStore.setError({ error })
  } else {
    registrosFonoaudiologicos.value = data as unknown as ResumenInterface[]
  }
}
fetchRegistros()

const diaSeleccionado = ref(new Date().toISOString().split('T')[0])

const registrosDiaSeleccionado = computed(() => {
  if (!registrosFonoaudiologicos.value) return []
  return registrosFonoaudiologicos.value.filter(
    (registro) => registro.fecha_evaluacion === diaSeleccionado.value,
  )
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span> Modulo TEL </span>

        <!-- botones -->
        <div class="space-x-2">
          <ModuloTelDialogoAgregar @registro-creado="fetchRegistros()">
            <Button>
              <Plus />
              <span>Agregar registro fonoaudiologico</span>
            </Button>
          </ModuloTelDialogoAgregar>
        </div>
      </CardTitle>
      <CardDescription>Descripcion modulo tel.</CardDescription>
      <Separator />
    </CardHeader>

    <Transition name="fade" mode="out-in">
      <CardContent v-if="registrosFonoaudiologicos">
        <FormKit
          type="date"
          v-model="diaSeleccionado"
          value="1999-01-01"
          label="Selecciona un dia"
          validation-visibility="live"
        />

        <!-- si no hay registros -->
        <InfoMensajeSinData
          v-if="!registrosDiaSeleccionado.length"
          icono="mantencion"
          mensaje="No hay registros para el dia seleccionado."
        />

        <!-- si hubiera -->
        <Table v-else>
          <TableBody>
            <TableRow
              v-for="planificacion in registrosDiaSeleccionado"
              :key="planificacion.id"
              class="group flex min-h-20 items-center"
            >
              <TableCell class="w-full">
                <Card>
                  <CardHeader>
                    <CardTitle> {{ planificacion.fecha_evaluacion }} </CardTitle>

                    <CardDescription> </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div class="mb-4 rounded border p-4">
                      <p class="text-md font-bold">Obervaciones</p>
                      <p>{{ planificacion.observaciones_fonoaudiologicas }}</p>
                    </div>

                    <Accordion type="multiple" collapsible>
                      <AccordionItem value="Alumnos">
                        <AccordionTrigger>
                          <p class="flex items-center gap-2">
                            <Users class="mr-2 inline" />
                            <span>Alumnos</span>
                          </p>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p v-for="alumno in planificacion.alumnos" :key="alumno.id">
                            {{ alumno.nombre_completo }}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="Contenidos">
                        <AccordionTrigger>
                          <p class="flex items-center gap-2">
                            <NotebookText class="mr-2 inline" />
                            <span>Contenidos</span>
                          </p>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p v-for="contenido in planificacion.contenidos" :key="contenido">
                            {{ contenido }}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
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
