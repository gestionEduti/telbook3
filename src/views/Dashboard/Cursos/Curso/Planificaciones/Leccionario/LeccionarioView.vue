<script setup lang="ts">
import { Calendar as CalendarIcon, X } from 'lucide-vue-next'

const errorStore = useErrorStore()
const authStore = useAuthStore()

const props = defineProps<{
  nivel: string
  letra: string
}>()

const nombreCurso = computed(() => props.nivel + props.letra)

// planificaciones corto
interface ResumenPlanificacionesItem {
  id: number
  estado: number
  recursos: string
  instrumentos: string
  inicioDesarrolloCierre: string
  oas: [
    {
      codigo_oa: number
      descripcion_oa: string
      descripcion_ambito: string
      descripcion_nucleo: string
    },
  ]
  fecha: string
}

const loading = ref(true)

const resumenPlanificaciones = ref<ResumenPlanificacionesItem[] | null>(null)

const diaSeleccionado = ref(new Date().toISOString().split('T')[0])

// Añadir computed para obtener los últimos 5 días
const ultimosCincoDias = computed(() => {
  const dias = []
  for (let i = 0; i < 5; i++) {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - i)
    dias.push(fecha.toISOString().split('T')[0])
  }
  return dias
})

// Modificar el computed para filtrar por los últimos 5 días
const planificacionesDiaSeleccionado = computed(() => {
  if (!resumenPlanificaciones.value) return []
  return resumenPlanificaciones.value.filter(
    (planificacion) => ultimosCincoDias.value.includes(planificacion.fecha)
  ).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
})

// Agregar refs para las fechas del filtro
const fechaDesde = ref('')
const fechaHasta = ref('')
const mostrandoFiltro = ref(false)

// Modificar el computed para usar el filtro por fechas
const planificacionesFiltradas = computed(() => {
  if (!resumenPlanificaciones.value) return []

  // Si no hay filtro activo, mostrar últimos 5 días
  if (!mostrandoFiltro.value) {
    return planificacionesDiaSeleccionado.value
  }

  // Si está en modo filtro pero no hay fechas seleccionadas, retornar array vacío
  if (!fechaDesde.value || !fechaHasta.value) {
    return []
  }

  // Filtrar por rango de fechas
  return resumenPlanificaciones.value
    .filter((planificacion) => {
      const fecha = new Date(planificacion.fecha)
      const desde = new Date(fechaDesde.value)
      const hasta = new Date(fechaHasta.value)
      return fecha >= desde && fecha <= hasta
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
})

// Función para limpiar el filtro
function limpiarFiltro() {
  fechaDesde.value = ''
  fechaHasta.value = ''
  mostrandoFiltro.value = false
}

/**
 * trae las planificaciones+oas del curso desde una funcion de supabase
 */
async function fetchPlanificaciones() {
  const { data, error } = await supabase.rpc('resumen_pla_corto_curso', {
    colegio: authStore.perfil!.rbd_usuario,
    curso: nombreCurso.value,
  })
  if (error) errorStore.setError({ error, customCode: 500 })
  else resumenPlanificaciones.value = data as unknown as ResumenPlanificacionesItem[]
}

onMounted(async () => {
  await fetchPlanificaciones() // TODO: fetch planificaciones solo al cambiar de dia
  loading.value = false
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <Card v-if="loading === false">
      <CardHeader>
        <CardTitle>Leccionario</CardTitle>
        <CardDescription>
          {{ mostrandoFiltro
            ? (fechaDesde && fechaHasta
                ? 'Mostrando planificaciones filtradas por fecha'
                : 'Seleccione las fechas para mostrar leccionarios')
            : 'Muestra las planificaciones de los últimos 5 días.'
          }}
        </CardDescription>

        <!-- Agregar filtro por fechas -->
        <div class="flex items-center gap-2 mt-4">
          <Button variant="outline" @click="mostrandoFiltro = true">
            <CalendarIcon class="mr-2 h-4 w-4" />
            Filtrar por fecha
          </Button>

          <div v-if="mostrandoFiltro" class="flex items-center gap-2">
            <span>Desde:</span>
            <Input
              type="date"
              v-model="fechaDesde"
              class="w-40"
            />

            <span>Hasta:</span>
            <Input
              type="date"
              v-model="fechaHasta"
              class="w-40"
            />

            <Button variant="ghost" size="sm" @click="limpiarFiltro">
              <X class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />
      </CardHeader>

      <CardContent>
        <p v-if="mostrandoFiltro && (!fechaDesde || !fechaHasta)">
          <InfoMensajeSinData
            icono="vacio"
            mensaje="Seleccione las fechas para mostrar leccionarios"
          />
        </p>
        <p v-else-if="!planificacionesFiltradas.length">
          <InfoMensajeSinData
            icono="vacio"
            mensaje="No hay planificaciones para el período seleccionado."
          />
        </p>
        <Table v-else>
          <TableBody>
            <TableRow
              v-for="planificacion in planificacionesFiltradas"
              :key="planificacion.id"
            >
              <TableCell>
                <LeccionarioItem :planificacion="planificacion" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </Transition>
</template>
