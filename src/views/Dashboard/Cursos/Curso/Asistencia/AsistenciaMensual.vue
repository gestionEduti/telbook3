<script setup lang="ts">
const props = defineProps<{
  nivel: string
  letra: string
}>()

const errorStore = useErrorStore()
const authStore = useAuthStore()

// supabase
import type { Tables } from '@/types/supabase'

import { useDateFormat, useNow } from '@vueuse/core'

// data
const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)
const diasMes = ref<number>(0)

// methods
const fetchSupabase = async () => {
  const { data, error, status } = await supabase
    .from('mv_libro_matricula')
    .select()
    .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario)
    .ilike('nivel_alumno', props.nivel + props.letra)
    .order('apellidos_alumno', { ascending: true })
  if (error) errorStore.setError({ error: error, customCode: status })
  else alumnos.value = data
}

const obtenerCantidadDiasMes = () => {
  const now = useNow()
  const currentMonth = useDateFormat(now, 'MM')
  const currentYear = useDateFormat(now, 'YYYY')
  const lastDayOfMonth = computed(() => {
    return new Date(Number(currentYear.value), Number(currentMonth.value), 0).getDate()
  })
  return lastDayOfMonth.value
}

onMounted(async () => {
  diasMes.value = obtenerCantidadDiasMes()
  await fetchSupabase()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Asistencia mensual</CardTitle>
      <CardDescription>Descripcion asistencia mensual.</CardDescription>
      <Separator />
    </CardHeader>
    <CardContent>
      <!-- encabezados -->
      <div class="telbook-label mb-1 grid grid-cols-[repeat(36,minmax(0,1fr))] gap-1">
        <p class="col-span-5">Nombre</p>
        <p v-for="dia in diasMes" :key="dia" class="col-span-1 text-center">{{ dia }}</p>
      </div>

      <!-- alumnos -->
      <div
        class="mb-1 grid grid-cols-[repeat(36,minmax(0,1fr))] gap-1"
        v-for="alumno in alumnos"
        :key="alumno.rut_alumno"
      >
        <p class="col-span-5 truncate">{{ alumno.nombre_completo_alumno }}</p>
        <input v-for="dia in diasMes" :key="dia" type="checkbox" class="col-span-1" />
      </div>
    </CardContent>
  </Card>
</template>
