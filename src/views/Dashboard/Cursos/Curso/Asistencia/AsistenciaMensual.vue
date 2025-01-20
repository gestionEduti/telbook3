<script setup lang="ts">
// props
const props = defineProps<{
  nivel: string
  letra: string
}>()

// store
const errorStore = useErrorStore()
const authStore = useAuthStore()

// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Separator from '@/components/ui/separator/Separator.vue'

// supabase
import { supabase } from '@/services/supabaseClient'
import InfoMensajeSinData from '@/components/InfoMensajeSinData.vue'
const querySelect = supabase
  .from('mv_libro_matricula')
  .select()
  .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario)
  .ilike('nivel_alumno', props.nivel + props.letra)
  .order('apellidos_alumno', { ascending: true })

// data
const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)

// methods
const fetchSupabase = async () => {
  const { data, error, status } = await querySelect
  if (error) errorStore.setError({ error: error, customCode: status })
  else alumnos.value = data
}

// lifecycle
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
