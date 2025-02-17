<script setup lang="ts">
import type { Tables } from '@/types/supabase'
import { Plus } from 'lucide-vue-next'

const errorStore = useErrorStore()

defineProps<{
  nivel: string
  letra: string
}>()

// registros fonoaudiologicos
const registrosFonoaudiologicos = ref<Tables<'mv_tel_alumnos'>[] | null>(null)
async function fetchRegistros() {
  const { data, error } = await supabase.from('mv_tel_alumnos').select() // filtrar del curso
  if (error) {
    errorStore.setError({ error })
  } else {
    registrosFonoaudiologicos.value = data
  }
}
fetchRegistros()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span> Modulo TEL </span>

        <!-- botones -->
        <div class="space-x-2">
          <ModuloTelDialogoAgregar>
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
        <!-- si no hay registros -->
        <InfoMensajeSinData
          v-if="!registrosFonoaudiologicos.length"
          icono="mantencion"
          mensaje="No hay registros."
        />

        <!-- si hubiera -->
        <div>
          <!-- iterar registros -->
        </div>
      </CardContent>
    </Transition>
  </Card>
</template>
