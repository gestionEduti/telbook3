<script setup lang="ts">
import { BookA, SquareUserRound } from 'lucide-vue-next'

const authStore = useAuthStore()

// supabase
const queryTotalCursos = supabase
  .from('tp_cursos')
  .select('id', { count: 'exact' })
  .eq('anio_curso', 2025) // TODO cambiar a año sacado desde la futura tabla de configuraciones
  .eq('rbd_establecimiento', String(authStore.establecimiento?.rbd)) // TODO: setear error si es que el perfil no existe
const queryTotalMatriculas = supabase
  .from('mv_libro_matricula')
  .select('id', { count: 'exact' })
  .eq('anio_libro', 2025) // TODO cambiar a año sacado desde la futura tabla de configuraciones
  .eq('rbd_establecimiento', String(authStore.establecimiento?.rbd)) // TODO: setear error si es que el perfil no existe

// data
const totalCursos = ref<number | null>(null)
const totalMatriculas = ref<number | null>(null)

// mehods
const obtenerTotalCursos = async () => {
  const { count, error, status } = await queryTotalCursos
  if (error) useErrorStore().setError({ error: error, customCode: status })
  else totalCursos.value = count
}
const obtenerTotalMatriculas = async () => {
  const { count, error, status } = await queryTotalMatriculas
  if (error) useErrorStore().setError({ error: error, customCode: status })
  else totalMatriculas.value = count
}

// lifecycle
onMounted(async () => {
  await obtenerTotalCursos()
  await obtenerTotalMatriculas()
})
</script>

<template>
  <div class="flex-1 space-y-4 px-4 py-8 pt-6">
    <div class="flex items-end justify-between space-y-2">
      <h2 data-test="dashboard-resumen-saludo" class="text-3xl font-bold tracking-tight">
        Hola {{ authStore.perfil?.nombre_usuario }}!
      </h2>
    </div>

    <Tabs default-value="overview" class="space-y-4">
      <TabsList>
        <TabsTrigger value="overview"> Alumnos </TabsTrigger>
        <TabsTrigger value="analytics"> Actividades </TabsTrigger>
        <TabsTrigger value="reports" disabled> Rendimiento </TabsTrigger>
      </TabsList>
      <Transition name="fade" mode="out-in">
        <TabsContent
          v-if="totalCursos !== null && totalMatriculas !== null"
          value="overview"
          class="space-y-4"
        >
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium"> Total cursos </CardTitle>
                <BookA class="text-gray-500" :size="19" />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">{{ totalCursos }}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium"> Total matriculas </CardTitle>
                <SquareUserRound class="text-gray-500" :size="19" />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">{{ totalMatriculas }}</div>
                <p class="text-xs text-muted-foreground">+23% desde el año pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium"> </CardTitle>
              </CardHeader>
              <CardContent> </CardContent>
            </Card>
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium"> </CardTitle>
              </CardHeader>
              <CardContent> </CardContent>
            </Card>
          </div>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card class="col-span-4 h-64">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium"> </CardTitle>
              </CardHeader>
              <CardContent> </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Transition>
    </Tabs>
  </div>
</template>
