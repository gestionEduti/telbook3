<script setup lang="ts">
import { Plus, Save } from 'lucide-vue-next'

const errorStore = useErrorStore()
const authStore = useAuthStore()

const emit = defineEmits(['planificacionCreada'])
const props = defineProps<{ buttonDisabled: boolean }>()

// nombre del curso
const route = useRoute()
const { nivel, letra } = route.params
const nombreCurso = computed(() => String(nivel) + String(letra))

// formulario
const dataFormulario = ref({
  semanas: '1',
  proyectoEje: '',
  oas: [],
  objetivosGenerales: '',
  estrategias: '',
  cierre: '',
})

// otros
const formularioValido = computed(() => {
  return (
    dataFormulario.value.objetivosGenerales &&
    dataFormulario.value.estrategias &&
    dataFormulario.value.cierre &&
    dataFormulario.value.oas.length > 0
  )
})

// JPS computed que guarda solo los perfiles permitidos para Registrar Planificación Mediano Plazo
const puedeRegistrarPMP = computed(() => {
  const perfilesPermitidos = [1, 2, 3, 4, 6]
  return perfilesPermitidos.includes(authStore.perfil?.codigo_perfil_usuario ?? -1)
})

/**
 * guarda la planificacion en supabase
 */
async function guardarPlanificacion() {
  const { error } = await supabase.rpc('tx_crear_plan_mediano', {
    planificacion: {
      rbd: authStore.perfil!.rbd_usuario,
      curso: nombreCurso.value,
      ...dataFormulario.value,
    },
  })
  if (error) errorStore.setError({ error, customCode: 500 })
  else {
    emit('planificacionCreada')
  }
}
</script>

<template>
  <Dialog>
    <!-- boton de trigger del dialog -->
    <DialogTrigger as-child>
      <!-- habilitado -->
      <Button v-if="!props.buttonDisabled"
              :disabled="!puedeRegistrarPMP"

      >
        <Plus />
        <span> Crear planificación </span>
      </Button>

      <!-- deshabilitado -->
      <TooltipProvider v-else>
        <Tooltip :delay-duration="0">
          <TooltipTrigger class="cursor-not-allowed">
            <Button disabled>
              <Plus />
              <span> Crear planificacion </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ya existe un proyecto activo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Nueva planificacion</DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>

      <!-- forulario -->
      <div class="flex flex-col gap-8">
        <!-- semanas -->
        <div>
          <Label> <p class="mb-2">Semanas</p></Label>
          <FormKit v-model="dataFormulario.semanas" type="number" value="1" step="1" />
        </div>

        <!-- proyecto eje -->
        <div>
          <Label><p class="mb-2">Proyecto eje</p></Label>
          <FormKit
            v-model="dataFormulario.proyectoEje"
            type="text"
            placeholder="Ingresa acá el proyecto eje"
            validation="required"
            validation-visibility="dirty"
            outer-class="min-w-full"
          />
        </div>

        <!-- oas agregados -->
        <div class="mb-4 flex flex-col gap-2">
          <Label for="codigo" class="text-left"> OAS </Label>
          <div class="flex items-center gap-4">
            <MedianoPlazoDialogoAgregarOas @oasSeleccionados="dataFormulario.oas = $event" />
            <p class="text-sm">{{ dataFormulario.oas.length }} seleccionado(s)</p>
          </div>
        </div>

        <!-- text area con la planificacion -->
        <div class="w-full">
          <Label> <p class="mb-2">Objetivos generales</p></Label>
          <FormKit
            v-model="dataFormulario.objetivosGenerales"
            type="textarea"
            placeholder="Ingresa acá los objetivos generales"
            validation="required"
            validation-visibility="dirty"
            outer-class="min-w-full"
          />
        </div>
        <div>
          <Label> <p class="mb-2">Estrategias para alcanzar el proyecto</p></Label>
          <FormKit
            v-model="dataFormulario.estrategias"
            type="textarea"
            placeholder=" Ingresa acá las estrategias."
            validation="required"
            validation-visibility="dirty"
            outer-class="min-w-full"
          />
        </div>
        <div>
          <Label> <p class="mb-2">Cierre del proyecto</p></Label>
          <FormKit
            v-model="dataFormulario.cierre"
            type="textarea"
            placeholder=" Ingresa acá el cierre del proyecto."
            validation="required"
            validation-visibility="dirty"
            outer-class="min-w-full"
          />
        </div>
      </div>

      <!-- boton de guardar -->
      <DialogFooter>
        <DialogClose>
          <Button @click="guardarPlanificacion" :disabled="!formularioValido">
            <Save />
            <span>Guardar</span>
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style></style>
