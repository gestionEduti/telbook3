<script setup lang="ts">
import type { Tables } from '@/types/supabase'

const props = defineProps<{
  matriculaId: string
}>()

// data
const matricula = ref<Tables<'mv_libro_matricula'> | null>(null)

// methods
const fetchMatricula = async () => {
  const { data, error } = await supabase
    .from('mv_libro_matricula')
    .select()
    .eq('id', props.matriculaId)
    .single()
  if (error) console.error(error)
  else matricula.value = data
}

onMounted(async () => {
  await fetchMatricula()
})
</script>

<template>
  <FormularioMatricula v-if="matricula" :matriculaParaEditar="matricula" />
</template>
