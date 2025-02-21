<script setup lang="ts">
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
        <CardDescription>Muestra las planificaciones de los últimos 5 días.</CardDescription>
        <Separator />
      </CardHeader>

      <CardContent>
        <p v-if="!planificacionesDiaSeleccionado.length">
          <InfoMensajeSinData
            icono="vacio"
            mensaje="No hay planificaciones en los últimos 5 días."
          />
        </p>
        <Table v-else>
          <TableBody>
            <TableRow
              v-for="planificacion in planificacionesDiaSeleccionado"
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
