<script setup lang="ts">
import InfoMensajeSinData from '@/components/InfoMensajeSinData.vue'

const props = defineProps<{
  nivel: string
  letra: string
}>()

const errorStore = useErrorStore()
const authStore = useAuthStore()

// supabase
import type { Tables } from '@/types/supabase'

// data
const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)

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

onMounted(async () => {
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
      <InfoMensajeSinData icono="mantencion" mensaje="En mantención" />
    </CardContent>
  </Card>
</template>

<style></style>
