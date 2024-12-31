<script setup lang="ts">
import { onMounted, ref } from 'vue'

// components
import FormularioMatricula from '@/components/FormularioMatricula.vue'

// props
const props = defineProps<{
  matriculaId: string
}>()

// data
const matricula = ref<Tables<'mv_libro_matricula'> | null>(null)

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
const query = supabase.from('mv_libro_matricula').select().eq('id', props.matriculaId).single()

// methods
const fetchMatricula = async () => {
  const { data, error } = await query
  if (error) console.error(error)
  else matricula.value = data
}

// lifecycle
onMounted(async () => {
  await fetchMatricula()
})
</script>

<template>
  <FormularioMatricula v-if="matricula" :matriculaParaEditar="matricula" />
</template>
