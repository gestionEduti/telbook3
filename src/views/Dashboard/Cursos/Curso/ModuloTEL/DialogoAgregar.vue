<script setup lang="ts">
import { Pen } from 'lucide-vue-next'

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

const modalidades = ref(['online', 'presencial'])
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
            <DialogoAgregarAlumnos @alumnosSeleccionados="formData.alumnos = $event">
              <Button>Agregar / Quitar alumnos</Button>
            </DialogoAgregarAlumnos>
            <p class="text-sm">{{ formData.alumnos.length }} seleccionado(s)</p>
          </div>
        </div>

        <!-- contenidos -->
        <div class="flex flex-col gap-2">
          <Label for="codigo" class="text-left"> Niveles fonoaudiologios / Contenidos </Label>
          <div class="flex items-center gap-4">
            <DialogoAgregarContenidos @contenidosSeleccionados="formData.contenidos = $event">
              <Button>Agregar / Quitar contenidos</Button>
            </DialogoAgregarContenidos>
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
            <Pen />
            <span>Crear</span>
          </Button>
          <DialogClose v-else>
            <Button>
              <Pen />
              <span>Crear</span>
            </Button>
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogScrollContent>
  </Dialog>
</template>
