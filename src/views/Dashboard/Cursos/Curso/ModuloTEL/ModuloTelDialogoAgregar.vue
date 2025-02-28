<script setup lang="ts">
import { Save, MousePointerClick } from 'lucide-vue-next'

const errorStore = useErrorStore()
const authStore = useAuthStore()
const mineducStore = useMineducStore()

// nombre del curso
const route = useRoute()
const { nivel, letra } = route.params
const nombreCurso = computed(() => String(nivel) + String(letra))

const emit = defineEmits(['registroCreado'])

const formData = ref({
  modalidad: '',
  fecha: '',
  alumnos: [],
  contenidos: [],
  observaciones: '',
  otp: '',
})

const formularioInvalido = computed(
  () =>
    !formData.value.modalidad ||
    formData.value.alumnos.length === 0 ||
    formData.value.contenidos.length === 0 ||
    !formData.value.otp ||
    formData.value.otp.length !== 6 ||
    formData.value.fecha === '',
)

const modalidades = ref(['PRESENCIAL'])

async function guardarRegistro() {
  // llamada a la api de mineduc
  const respuestaOTP = await mineducStore.validarOTP(formData.value.otp)

  const { error } = await supabase.rpc('tx_crear_registro_tel', {
    registro: {
      rbd: authStore.perfil!.rbd_usuario,
      curso: nombreCurso.value,
      rut: authStore.perfil!.rut_usuario,
      ...formData.value,
      otpRespuesta: respuestaOTP,
    },
  })

  if (error) {
    errorStore.setError({ error, customCode: 500 })
  } else {
    emit('registroCreado')
  }

  // limpiar formulario
  formData.value.modalidad = ''
  formData.value.fecha = ''
  formData.value.alumnos = []
  formData.value.contenidos = []
  formData.value.observaciones = ''
  formData.value.otp = ''
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot></slot>
    </DialogTrigger>

    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>Nuevo registro</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <div class="flex flex-col gap-8">
        <!-- modalidad -->
        <div class="flex flex-col gap-2">
          <Label for="codigo" class="text-left"> Modalidad </Label>
          <Select v-model="formData.modalidad">
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="modalidad in modalidades" :key="modalidad" :value="modalidad">
                  {{ modalidad }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <!-- fecha -->
        <div class="flex flex-col gap-2">
          <Label for="codigo" class="text-left"> Fecha </Label>
          <FormKit
            type="date"
            locale="es"
            validation="required"
            validation-visibility="dirty"
            v-model="formData.fecha"
          />
        </div>

        <!-- alumnos -->
        <div class="flex flex-col gap-2">
          <Label for="codigo" class="text-left"> Alumnos </Label>
          <div class="flex items-center gap-4">
            <ModuloTelDialogoAgregarAlumnos @alumnosSeleccionados="formData.alumnos = $event">
              <Button>
                <MousePointerClick />
                <span>Seleccionar alumnos</span>
              </Button>
            </ModuloTelDialogoAgregarAlumnos>
            <p class="text-sm">{{ formData.alumnos.length }} seleccionado(s)</p>
          </div>
        </div>

        <!-- contenidos -->
        <div class="flex flex-col gap-2">
          <Label for="codigo" class="text-left"> Niveles fonoaudiologios / Contenidos </Label>
          <div class="flex items-center gap-4">
            <ModuloTelDialogoAgregarContenidos
              @contenidosSeleccionados="formData.contenidos = $event"
            >
              <Button>
                <MousePointerClick />
                <span>Seleccionar contenidos</span>
              </Button>
            </ModuloTelDialogoAgregarContenidos>
            <p class="text-sm">{{ formData.contenidos.length }} seleccionado(s)</p>
          </div>
        </div>

        <!-- observaciones -->
        <div class="flex flex-col gap-2">
          <Label for="codigo" class="text-left"> Registro / Observaciones </Label>
          <Textarea v-model="formData.observaciones" />
        </div>

        <!-- otp -->
        <div class="flex flex-col gap-2">
          <Label for="codigo" class="text-left"> Codigo OTP </Label>
          <Input id="codigo" class="col-span-3" v-model="formData.otp" maxlength="6" />
        </div>

        <DialogFooter>
          <Button v-if="formularioInvalido" :disabled="formularioInvalido">
            <Save />
            <span>Guardar</span>
          </Button>
          <DialogClose v-else>
            <Button @click="guardarRegistro">
              <Save />
              <span>Guardar</span>
            </Button>
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>
