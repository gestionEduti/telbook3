<script setup lang="ts">
import { Save, Plus } from 'lucide-vue-next'

const errorStore = useErrorStore()
const authStore = useAuthStore()

const emit = defineEmits(['planificacionCreada'])
const props = defineProps<{ existeProyectoEje: boolean }>()

// nombre del curso
const route = useRoute()
const { nivel, letra } = route.params
const nombreCurso = computed(() => String(nivel) + String(letra))

const nuevaPlanificacion = ref({
  fecha: '',
  recursos: '',
  instrumentosEvaluacion: '',
  inicioDesarrolloCierre: '',
  oas: [],
})

const formularioValido = computed(() => {
  return (
    nuevaPlanificacion.value.fecha &&
    nuevaPlanificacion.value.recursos &&
    nuevaPlanificacion.value.instrumentosEvaluacion &&
    nuevaPlanificacion.value.inicioDesarrolloCierre &&
    nuevaPlanificacion.value.oas.length > 0
  )
})

// JPS computed que guarda solo los perfiles permitidos para Registrar Planificación Corto Plazo
const puedeRegistrarPCP = computed(() => {
  const perfilesPermitidos = [1, 2, 3, 4, 6]
  return perfilesPermitidos.includes(authStore.perfil?.codigo_perfil_usuario ?? -1)
})

// Agregar ref para controlar el diálogo
const dialogoAbierto = ref(false)

/**
 * guarda la planificacion en supabase
 */
async function guardarPlanificacion() {
  const { data, error } = await supabase.rpc('tx_crear_plan_corto', {
    planificacion: {
      rbd: authStore.perfil!.rbd_usuario,
      curso: nombreCurso.value,
      rut: authStore.perfil!.rut_usuario,
      ...nuevaPlanificacion.value,
    },
  })

  if (error) {
    errorStore.setError({ error, customCode: 500 })
    return
  }

  emit('planificacionCreada')
  limpiarFormulario()
  dialogoAbierto.value = false  // Cerrar el diálogo después de guardar
}

// Nueva función
function limpiarFormulario() {
  nuevaPlanificacion.value = {
    fecha: '',
    recursos: '',
    instrumentosEvaluacion: '',
    inicioDesarrolloCierre: '',
    oas: [],
  }
}
</script>

<template>
  <Dialog v-model:open="dialogoAbierto">
    <DialogTrigger as-child>
      <Button :disabled="!props.existeProyectoEje || !puedeRegistrarPCP"
      >
        <Plus />
        <span> Crear planificacion </span>
      </Button>
    </DialogTrigger>

    <DialogScrollContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nueva planificacion</DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>

      <!-- calendario -->
      <FormKit
        type="date"
        label="Fecha"
        validation="required"
        validation-visibility="dirty"
        v-model="nuevaPlanificacion.fecha"
      />

      <!-- oas agregados -->
      <!-- oas agregados -->
      <div class="mb-4 flex flex-col gap-2">
        <Label for="codigo" class="text-left"> OAS </Label>
        <div class="flex items-center gap-4">
          <MedianoPlazoDialogoAgregarOas @oasSeleccionados="nuevaPlanificacion.oas = $event" />
          <p class="text-sm">{{ nuevaPlanificacion.oas.length }} seleccionado(s)</p>
        </div>
      </div>

      <!-- text area con la planificacion -->
      <div class="w-full">
        <Label> <p class="mb-2">Recursos</p></Label>
        <FormKit
          v-model="nuevaPlanificacion.recursos"
          type="textarea"
          placeholder="Ingresa acá los recursos"
          validation="required"
          validation-visibility="dirty"
          outer-class="min-w-full"
        />
      </div>
      <div>
        <Label> <p class="mb-2">Instrumentos de evaluación</p></Label>
        <FormKit
          v-model="nuevaPlanificacion.instrumentosEvaluacion"
          type="textarea"
          placeholder=" Ingresa acá los instrumentos de evaluación."
          validation="required"
          validation-visibility="dirty"
          outer-class="min-w-full"
        />
      </div>
      <div>
        <Label> <p class="mb-2">Inicio, desarrollo, y cierre</p></Label>
        <FormKit
          v-model="nuevaPlanificacion.inicioDesarrolloCierre"
          type="textarea"
          placeholder=" Ingresa acá el inicio, desarrollo, y cierre."
          validation="required"
          validation-visibility="dirty"
          outer-class="min-w-full"
        />
      </div>

      <!-- boton de guardar -->
      <DialogFooter>
        <!-- Removido DialogClose que envolvía el Button -->
    <Button @click="guardarPlanificacion" :disabled="!formularioValido">
      <Save />
      <span>Guardar</span>
    </Button>
  </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
