<script setup lang="ts">
import InfoMensajeSinData from '@/components/InfoMensajeSinData.vue'
import { OctagonX, Goal, Download, Filter, Trash2 } from 'lucide-vue-next'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { obtenerFechaActualComoYYYMMDD } from '@/lib/formato'
import { useToast } from '@/components/ui/toast'
const { toast } = useToast()

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

// otros
const diaActual = obtenerFechaActualComoYYYMMDD()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span> Evaluaciones Personalizadas</span>
        <div class="flex items-end gap-2">
          <Button
                variant="outline">
            Nueva Evaluación
          </Button>


        </div>
      </CardTitle>
      <CardDescription>Descripcion evaluaciones personalizadas.</CardDescription>
      <Separator />
    </CardHeader>
    <CardContent>
    </CardContent>
    <Table >
      <TableBody>
        <TableRow  class="group flex min-h-20 ">
        <TableCell class="w-full">
          <Card class=" 'border-green-1000' : 'bg-gray-100'">
          <CardHeader>
            <CardTitle>
              <div class="flex justify-between items-center">
                <span>Proyecto Eje: PRUEBA JP</span>
                </div>
            </CardTitle>
             <CardDescription>
               <p>Planificación Fecha</p>
               <p>Cantidad de semanas </p>
             </CardDescription>
               <div class="flex">
                <Badge class="bg-green-600">
                  Activa
                </Badge>
               </div>
          </CardHeader>


            <CardContent>
                <div class="flex flex-col gap-4">
                  <p class="flex flex-col">
                  <span class="font-bold "> Objetivos Generales </span>
                    <span> AQUI VAN LOS OBJETIVOS PRINCIPALES </span>
                  </p>

                  <p class="flex flex-col">
                    <span class="font-bold "> Estrategias para alcanzar el proyecto </span>
                      <span> AQUI VAN LAS ESTRATEGIAS </span>
                  </p>

                  <p class="flex flex-col">
                   <span class="font-bold">Cierre del Proyecto</span>
                    <span> AQUI VAN LOS CIERRES DEL PROYECTO </span>
                  </p>


              <Accordion type="single" collapsible>
                <AccordionItem title="Evaluaciones"> HAHAHHAHA</AccordionItem>


              </Accordion>
             </div>
            </CardContent>
          </Card>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Card>
</template>
