<script setup lang="ts">
import { reset } from '@formkit/vue'

import { Loader } from 'lucide-vue-next' // iconos

const formData = ref<FormDataType>({
  apellido_usuario: '',
  codigo_estado_usuario: 1,
  codigo_perfil_usuario: 1,
  email: '',
  nombre_usuario: '',
  password: '',
  rbd_usuario: 1,
  rut_usuario: '',
  telefono: '',
})

// data
interface FormDataType {
  apellido_usuario: string
  codigo_estado_usuario: number
  codigo_perfil_usuario: number
  email: string
  nombre_usuario: string
  password: string
  rbd_usuario: number
  rut_usuario: string
  telefono: string
}

const handleForm = async (formData: FormDataType) => {
  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })
  if (error) console.log(error)
  // else {
  //   const { error } = await supabase.from('mv_usuario').insert([])
  //   if (error) errorStore.setError({ error: error, customCode: 500 })
  //   else resetForm()
  // }
  resetForm()
}

const resetForm = () => {
  reset('nuevoUsuarioForm')
}
</script>

<template>
  <FormKit
    v-model="formData"
    type="form"
    id="nuevoUsuarioForm"
    @submit="handleForm"
    :config="{ validationVisibility: 'dirty' }"
    :actions="false"
  >
    <template #default>
      <FormKit type="text" name="email" id="email" label="Email" validation="required" />
      <FormKit type="text" name="password" id="password" label="Password" validation="required" />
      <FormKit type="text" name="rut_usuario" id="rut" label="Rut" validation="required" />
      <FormKit type="text" name="nombre" id="nombre" label="Nombre" validation="required" />
      <FormKit
        type="text"
        name="apellido_usuario"
        id="apellido"
        label="Apellido"
        validation="required"
      />
      <FormKit type="text" name="telefono" id="telefono" label="Telefono" validation="required" />
      <FormKit type="text" name="rbd" id="rbd" label="rbd" validation="required" />
      <FormKit
        type="text"
        name="codigo_estado"
        id="codigo_estado"
        label="codigo_estado"
        validation="required"
      />
      <FormKit
        type="text"
        name="codigo_perfil"
        id="codigo_perfil"
        label="codigo_perfil"
        validation="required"
      />
    </template>
    <template #actions="{ state }">
      <div class="flex gap-2 place-self-start">
        <Button type="submit" :disabled="state.loading" class="mx-auto">
          <Loader v-if="state.loading" class="mr-2 h-6 w-6 animate-spin" />
          Crear matricula
        </Button>
        <Button @click="resetForm" class="mx-auto" variant="outline"> Limpiar formulario </Button>
      </div>
    </template>
  </FormKit>
</template>

<style></style>
