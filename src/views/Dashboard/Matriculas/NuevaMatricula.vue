<script setup lang="ts">
import { onMounted, ref } from 'vue'

// shadcn
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
// icons
import { FlaskConical, Loader } from 'lucide-vue-next'

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'

// store
import { useAuthStore } from '@/stores/auth'
import { useNuevaMatriculaLoaderStore } from '@/stores/loaders/nuevaMatricula'
const authStore = useAuthStore()
const loaderStore = useNuevaMatriculaLoaderStore()
import { useErrorStore } from '@/stores/error'
const errorStore = useErrorStore()

// formkit
import { reset } from '@formkit/vue'

// data
const loadersReady = ref(false)
const dataFormulario = ref<Tables<'mv_libro_matricula'>>()

// methods
const handleForm = async (data: Tables<'mv_libro_matricula'>) => {
  // replace empty fields with null
  // TODO: corregir tipos de TS
  for (const key in data) {
    if (data[key] === '') {
      data[key] = null
    }
  }

  // obtener ultimo numero de matricula
  const {
    data: dataUnm,
    error: errorUnm,
    status: statusUnm,
  } = await supabase
    .from('mv_libro_matricula')
    .select('numero_matricula_alumno')
    .order('numero_matricula_alumno', { ascending: false })
    .limit(1)

  const {
    data: dataUnl,
    error: errorUnl,
    status: statusUnl,
  } = await supabase
    .from('mv_libro_matricula')
    .select('numero_lista_nivel_alumno')
    .order('numero_lista_nivel_alumno', { ascending: false })
    .limit(1)

  if (errorUnm) {
    errorStore.setError({ error: errorUnm, customCode: statusUnm })
  } else if (errorUnl) {
    errorStore.setError({ error: errorUnl, customCode: statusUnl })
  } else {
    // seteando datos extras que no vienen del formulario
    data.estado_alumno = 'ACTIVO'
    data.nombre_completo_alumno = `${data.apellidos_alumno} ${data.nombres_alumno}`
    data.rbd_establecimiento = authStore.perfil?.rbd_usuario || 0
    data.numero_matricula_alumno = dataUnm[0].numero_matricula_alumno + 1 // TODO: corregir en la DB que sea NOT NULL
    data.numero_lista_nivel_alumno = dataUnl[0].numero_lista_nivel_alumno + 1 // TODO: corregir en la DB que sea NOT NULL
  }

  // insert en supabase
  const { error } = await supabase.from('mv_libro_matricula').insert(data)
  if (error) {
    console.error(error)
    toast({
      title: 'Error',
      description: 'Hubo un problema en la creacion de la matricula.',
      variant: 'destructive',
    })
  } else {
    toast({
      title: 'Exito',
      description: 'Matricula creada exitosamente.',
      variant: 'exitoso',
    })
    reset('nuevoAlumnoForm')
  }
}
const resetForm = () => {
  reset('nuevoAlumnoForm')
}

// lifecycle
onMounted(async () => {
  await loaderStore.fetchAllSelectsData()
  loadersReady.value = true
})
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <Transition name="fade" mode="out-in">
      <Card v-if="loadersReady">
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span> Nueva Matricula </span>
          </CardTitle>
          <CardDescription>Matricula un nuevo alumno en el establecimiento.</CardDescription>
          <Separator />
        </CardHeader>
        <CardContent class="mt-0 space-y-2">
          <Button
            @click="dataFormulario = loaderStore.datos_ejemplo"
            variant="destructive"
            class="mb-4"
          >
            <FlaskConical />
            auto-rellenar formulario
          </Button>
          <FormKit
            v-model="dataFormulario"
            type="form"
            id="nuevoAlumnoForm"
            @submit="handleForm"
            :config="{ validationVisibility: 'dirty' }"
            :actions="false"
          >
            <!-- slot que contiene los input -->
            <template #default>
              <p class="text-sm font-semibold tracking-tighter text-gray-400">
                Sección Datos personales
              </p>
              <Separator class="mb-4" />
              <FormKit
                type="text"
                name="rut_alumno"
                id="rut"
                label="RUT"
                help="Ingresa el rut en este formato: 12345678-9"
                placeholder="Ingresa el rut"
                validation="required"
              />
              <div class="flex gap-4">
                <FormKit
                  type="text"
                  name="nombres_alumno"
                  id="nombres"
                  label="Nombres"
                  placeholder="Ingresa los nombres"
                  validation="required"
                />
                <FormKit
                  type="text"
                  name="apellidos_alumno"
                  id="apellidos"
                  label="Apellidos"
                  placeholder="Ingresa los apellidos"
                  validation="required"
                />
              </div>
              <FormKit
                type="date"
                label="Fecha nacimiento"
                name="fecha_nacimiento_alumno"
                validation="required"
              />
              <div class="flex gap-4">
                <FormKit
                  type="select"
                  name="nacionalidad_alumno"
                  id="nacionalidad_alumno"
                  label="Nacionalidad"
                  placeholder="Selecciona la nacionalidad"
                  validation="required"
                  :options="loaderStore.tp_nacionalidad_alumno"
                />
                <FormKit
                  type="select"
                  label="Sexo"
                  name="sexo_alumno"
                  placeholder="Selecciona el sexo"
                  validation="required"
                  :options="loaderStore.tp_genero_alumno"
                />
              </div>

              <p class="mt-8 text-sm font-semibold tracking-tighter text-gray-400">
                Sección Incorporacion
              </p>
              <Separator class="mb-4" />
              <FormKit
                type="date"
                label="Fecha incorporacion"
                name="fecha_incorporacion_alumno"
                validation="required"
              />
              <div class="flex gap-4">
                <FormKit
                  type="select"
                  label="Curso"
                  name="nivel_alumno"
                  placeholder="Selecciona el curso"
                  validation="required"
                  :options="loaderStore.tp_cursos"
                />
                <FormKit
                  type="select"
                  label="Jornada"
                  name="jornada_alumno"
                  placeholder="Selecciona la jornada"
                  validation="required"
                  :options="loaderStore.tp_jornada_alumno"
                />
              </div>

              <p class="mt-8 text-sm font-semibold tracking-tighter text-gray-400">
                Sección Domicilio
              </p>
              <Separator class="mb-4" />
              <FormKit
                label="Direccion"
                name="domicilio_alumno"
                placeholder="Ingresa la direccion"
                help="Calle, numero, departamento"
                validation="required"
              />
              <FormKit
                type="select"
                label="Comuna"
                name="comuna_alumno"
                placeholder="Selecciona la comuna"
                validation="required"
                :options="loaderStore.tp_regiones_comunas_chile"
              />

              <p class="mt-8 text-sm font-semibold tracking-tighter text-gray-400">
                Sección Situacion alumno
              </p>
              <Separator class="mb-4" />
              <FormKit
                type="select"
                label="Pueblo originario"
                name="pueblo_originario_alumno"
                placeholder="Selecciona si es pueblo originario"
                validation="required"
                :options="loaderStore.tp_pueblo_originario"
              />
              <div class="flex gap-4">
                <FormKit
                  type="select"
                  label="Situacion social"
                  name="situacion_social_alumno"
                  placeholder="Selecciona la situacion social del alumno"
                  validation="required"
                  :options="loaderStore.tp_situacion_social"
                />
                <FormKit
                  type="select"
                  label="Procedencia"
                  name="procedencia_alumno"
                  placeholder="Selecciona la procedencia"
                  validation="required"
                  :options="loaderStore.tp_procedencia_alumno"
                />
              </div>
              <div class="flex gap-4">
                <FormKit
                  type="select"
                  label="Tipo TEL"
                  name="tipo_tel_alumno"
                  placeholder="Selecciona el tipo TEL"
                  validation="required"
                  :options="loaderStore.tp_tipo_tel"
                />
                <FormKit
                  type="select"
                  label="Problemas aprendizaje"
                  name="problema_aprendizaje_alumno"
                  placeholder="Selecciona los problemas de aprendizaje"
                  validation="required"
                  :options="loaderStore.tp_problemas_aprendizaje"
                />
              </div>

              <!--  -->
              <p class="mt-8 text-sm font-semibold tracking-tighter text-gray-400">
                Sección Familia
              </p>
              <Separator class="mb-4" />
              <FormKit
                type="select"
                label="Vive con"
                name="vive_con_alumno"
                placeholder="Selecciona con quien vive"
                validation="required"
                :options="loaderStore.tp_vive_con"
              />
              <div class="flex gap-4">
                <FormKit
                  type="text"
                  label="Nombre apoderado"
                  placeholder="Ingresa el nombre y apellido"
                  name="nombre_apoderado_alumno"
                  validation="required"
                />
                <FormKit
                  type="select"
                  label="Parentezco"
                  name="parentezco_con_alumno"
                  placeholder="Selecciona el parentezco"
                  validation="required"
                  :options="loaderStore.tp_parentezco_alumno"
                />
              </div>
              <div class="flex gap-4">
                <FormKit
                  type="text"
                  label="Telefono apoderado"
                  name="telefono_apoderado_alumno"
                  help="Ingresa el numero en este formato: +56981234567"
                  placeholder="Ingresa el telefono"
                  validation="required"
                />
                <FormKit
                  type="email"
                  name="email_apoderado_alumno"
                  id="email"
                  label="Email"
                  placeholder="Ingresa el email"
                  validation="required|email"
                />
              </div>
              <div class="flex gap-4">
                <FormKit
                  type="select"
                  label="Nivel educacional padre"
                  name="nivel_educacional_padre"
                  placeholder="Selecciona el nivel educacional del padre"
                  validation="required"
                  :options="loaderStore.tp_nivel_educacional_padres"
                />
                <FormKit
                  type="select"
                  label="Nivel educacional madre"
                  name="nivel_educacional_madre"
                  placeholder="Selecciona el nivel educacional de la madre"
                  validation="required"
                  :options="loaderStore.tp_nivel_educacional_padres"
                />
              </div>
            </template>

            <!-- slot que contiene los botones de accion -->
            <template #actions="{ state }">
              <div class="flex gap-2 place-self-start">
                <Button :disabled="state.loading" class="mx-auto">
                  <Loader v-if="state.loading" class="mr-2 h-6 w-6 animate-spin" />
                  Crear matricula
                </Button>
                <Button @click="resetForm" class="mx-auto" variant="outline">
                  Limpiar formulario
                </Button>
              </div>
            </template>
          </FormKit>
        </CardContent>
      </Card>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
