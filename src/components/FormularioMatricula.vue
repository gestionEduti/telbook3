<script setup lang="ts">
import type { Tables } from '@/types/supabase' // types de supabase
import { useMatriculaValidacionStore } from '@/stores/matriculaValidacionStore'




const router = useRouter()

const authStore = useAuthStore()
const errorStore = useErrorStore()
const loaderStore = useNuevaMatriculaLoaderStore()
const matriculaValidacionStore = useMatriculaValidacionStore()

const props = defineProps<{
  matriculaParaEditar?: Tables<'mv_libro_matricula'>
}>()

import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

import { Loader } from 'lucide-vue-next' // iconos

import { reset } from '@formkit/vue' // funcion de formkit para reiniciar el formulario

// data
const loadersReady = ref(false)
const dataFormulario = ref<Tables<'mv_libro_matricula'>>()

// computed
const formularioSeEstaEditando = computed(() => !!props.matriculaParaEditar)

// Modificar el computed para el mensaje
const mensajeError = computed(() => {
  if (!dataFormulario.value?.numero_matricula_alumno) return ''
  return !matriculaValidacionStore.numeroMatriculaDisponible
    ? 'Este número de matrícula no está disponible'
    : '✓ Número de matrícula disponible'
})

// Agregar método de validación
const validarMatricula = async (value: any) => {
  if (!value) return
  await matriculaValidacionStore.validarNumeroMatricula(value, props.matriculaParaEditar?.id)
}

const formatearPalabrasMayusculas = (event: Event) => {
  const input = event.target as HTMLInputElement
  input.value = input.value.toUpperCase()
}


// methods
const handleForm = async (formData: Tables<'mv_libro_matricula'>) => {
  // si hay data para editar, entonces es una edicion y se hara un UPDATE
  if (formularioSeEstaEditando.value) {
    // seteando datos extras que no vienen del formulario
    formData.nombre_completo_alumno = `${formData.apellidos_alumno} ${formData.nombres_alumno}` // TODO (modelo) tratar de quitar estos campos redundantes
    const { error: updateError } = await supabase
      .from('mv_libro_matricula')
      .update(formData)
      .eq('id', formData.id)
      .select()
    if (updateError?.code == '23505') {
      toast({
        title: 'Error',
        description: 'El numero de matricula ya existe.',
        variant: 'destructive',
        duration: 3000,
      })
    } else if (updateError) {
      errorStore.setError({ error: updateError })
    } else {
      toast({
        title: 'Exito',
        description: 'Matricula actualizada exitosamente.',
        variant: 'exitoso',
        duration: 3000,
      })
      router.push({ name: 'matriculas' })
    }
  }

  // si no, es un nuevo registro y se hara un INSERT
  else {
    // obtener ultimo numero de matricula
    const {
      data: dataUnm,
      error: errorUnm,
      status: statusUnm,
    } = await supabase
      .from('mv_libro_matricula')
      .select('numero_matricula_alumno')
      .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario)
      .order('numero_matricula_alumno', { ascending: false })
      .limit(1)

    const {
      data: dataUnl,
      error: errorUnl,
      status: statusUnl,
    } = await supabase
      .from('mv_libro_matricula')
      .select('numero_lista_nivel_alumno')
      .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario)
      .eq('nivel_alumno', formData.nivel_alumno)
      .order('numero_lista_nivel_alumno', { ascending: false })
      .limit(1)

    if (errorUnm) {
      errorStore.setError({ error: errorUnm, customCode: statusUnm })
    } else if (errorUnl) {
      errorStore.setError({ error: errorUnl, customCode: statusUnl })
    } else {
      // seteando datos extras que no vienen del formulario
      formData.anio_libro = 2025 // TODO cambiar a año sacado desde la futura tabla de configuraciones
      formData.created_at = new Date().toISOString() // TODO (model) tiene q ser creado por la DB
      formData.estado_alumno = 'ACTIVO' // en duro porque siempre empiezan activos
      formData.codigo_estado_alumno = 1 // en duro porque siempre empiezan activos
      formData.nombre_completo_alumno = `${formData.apellidos_alumno} ${formData.nombres_alumno}`
      formData.rbd_establecimiento = authStore.perfil?.rbd_usuario || 0
      formData.numero_matricula_alumno = dataUnm[0]?.numero_matricula_alumno
        ? dataUnm[0].numero_matricula_alumno + 1
        : 1 // si existe, asignar +1, si no, asignar 1
      formData.numero_lista_nivel_alumno = dataUnl[0]?.numero_lista_nivel_alumno
        ? dataUnl[0]?.numero_lista_nivel_alumno + 1
        : 1 // el ultimo numero, ó 1 si no hay
    }

    // insert en supabase
    const { error } = await supabase.from('mv_libro_matricula').insert(formData)
    if (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Hubo un problema en la creación de la matricula.',
        variant: 'destructive',
        duration: 3000,
      })
    } else {
      toast({
        title: 'Exito',
        description: 'Matricula creada exitósamente.',
        variant: 'exitoso',
        duration: 3000,
      })
      reset('nuevoAlumnoForm')
    }
  }
}
const resetForm = () => {
  reset('nuevoAlumnoForm')
}

onMounted(async () => {
  await loaderStore.fetchAllSelectsData()
  loadersReady.value = true
  if (formularioSeEstaEditando.value) dataFormulario.value = props.matriculaParaEditar
})

// Agregar este watcher
watch(() => dataFormulario.value?.numero_matricula_alumno, (newValue) => {
  console.log('🔄 Cambió número matrícula:', newValue)
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
          <FormKit
            v-model="dataFormulario"
            type="form"
            id="nuevoAlumnoForm"
            @submit="handleForm"
            :config="{ validationVisibility: 'live' }"
            :actions="false"
          >
            <!-- slot que contiene los input -->
            <template #default>
              <div class="flex gap-4">
                <FormKit
                  v-if="formularioSeEstaEditando"
                  type="number"
                  name="numero_matricula_alumno"
                  id="numero_matricula"
                  label="Numero de matricula"
                  validation="required"
                  @input="validarMatricula"
                  :help="mensajeError"
                  :validation-messages="{
                    required: 'Este campo es requerido'
                  }"
                  :classes="{
                    input: !matriculaValidacionStore.numeroMatriculaDisponible ? 'border-red-500' : 'border-green-500',
                    help: !matriculaValidacionStore.numeroMatriculaDisponible ? 'text-red-500' : 'text-green-500'
                  }"
                />
                <!-- <FormKit
                  v-else
                  type="number"
                  name="numero_matricula_alumno"
                  id="numero_matricula"
                  label="Numero de matricula (opcional)"
                  validation-visibility="live"
                  :validation-rules="{
                    async disponible(value) {
                      if (!value) return true
                      const disponible = await matriculaValidacionStore.validarNumeroMatricula(value)
                      return disponible || 'Este número de matrícula no está disponible'
                    }
                  }"
                /> -->
              </div>

              <p class="telbook-label" :class="[formularioSeEstaEditando ? 'mt-8' : '']">
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
                  @change="formatearPalabrasMayusculas"
                />
                <FormKit
                  type="text"
                  name="apellidos_alumno"
                  id="apellidos"
                  label="Apellidos"
                  placeholder="Ingresa los apellidos"
                  validation="required"
                  @change="formatearPalabrasMayusculas"
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
                  validation=""
                  :options="loaderStore.tp_nacionalidad_alumno"
                />
                <FormKit
                  type="select"
                  label="Sexo"
                  name="sexo_alumno"
                  placeholder="Selecciona el sexo"
                  validation=""
                  :options="loaderStore.tp_genero_alumno"
                />
              </div>

              <p class="telbook-label mt-8">Sección Incorporación</p>
              <Separator class="mb-4" />
              <FormKit
                type="date"
                label="Fecha incorporación"
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
                  validation=""
                  :options="loaderStore.tp_jornada_alumno"
                />
              </div>

              <p class="telbook-label mt-8">Sección Domicilio</p>
              <Separator class="mb-4" />
              <FormKit
                label="Direccion"
                name="domicilio_alumno"
                placeholder="Ingresa la direccion"
                help="Calle, numero, departamento"
                validation=""
              />
              <div class="flex gap-4">
                <FormKit
                  type="select"
                  label="Región"
                  name="region_alumno"
                  placeholder="Selecciona la región"
                  validation=""
                  :options="loaderStore.tp_regiones_chile"
                />
                <FormKit
                  type="select"
                  label="Comuna"
                  name="comuna_alumno"
                  placeholder="Selecciona la comuna"
                  validation=""
                  :options="loaderStore.tp_regiones_comunas_chile"
                />
              </div>

              <p class="telbook-label mt-8">Sección Situacion alumno</p>
              <Separator class="mb-4" />
              <FormKit
                type="select"
                label="Pueblo originario"
                name="pueblo_originario_alumno"
                placeholder="Selecciona si es pueblo originario"
                validation=""
                :options="loaderStore.tp_pueblo_originario"
              />
              <div class="flex gap-4">
                <FormKit
                  type="select"
                  label="Situacion social"
                  name="situacion_social_alumno"
                  placeholder="Selecciona la situacion social del alumno"
                  validation=""
                  :options="loaderStore.tp_situacion_social"
                />
                <FormKit
                  type="select"
                  label="Procedencia"
                  name="procedencia_alumno"
                  placeholder="Selecciona la procedencia"
                  validation=""
                  :options="loaderStore.tp_procedencia_alumno"
                />
              </div>
              <div class="flex gap-4">
                <FormKit
                  type="select"
                  label="Tipo TEL"
                  name="tipo_tel_alumno"
                  placeholder="Selecciona el tipo TEL"
                  validation=""
                  :options="loaderStore.tp_tipo_tel"
                />
                <FormKit
                  type="select"
                  label="Problemas aprendizaje"
                  name="problema_aprendizaje_alumno"
                  placeholder="Selecciona los problemas de aprendizaje"
                  validation=""
                  :options="loaderStore.tp_problemas_aprendizaje"
                />
              </div>

              <!--  -->
              <p class="telbook-label mt-8">Sección Familia</p>
              <Separator class="mb-4" />
              <FormKit
                type="select"
                label="Vive con"
                name="vive_con_alumno"
                placeholder="Selecciona con quien vive"
                validation=""
                :options="loaderStore.tp_vive_con"
              />
              <div class="flex gap-4">
                <FormKit
                  type="text"
                  label="Nombre apoderado"
                  placeholder="Ingresa el nombre y apellido"
                  name="nombre_apoderado_alumno"
                  validation=""
                />
                <FormKit
                  type="select"
                  label="Parentezco"
                  name="parentezco_con_alumno"
                  placeholder="Selecciona el parentezco"
                  validation=""
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
                  validation=""
                />
                <FormKit
                  type="email"
                  name="email_apoderado_alumno"
                  id="email"
                  label="Email"
                  placeholder="Ingresa el email"
                  validation="email"
                />
              </div>
              <div class="flex gap-4">
                <FormKit
                  type="select"
                  label="Nivel educacional padre"
                  name="nivel_educacional_padre"
                  placeholder="Selecciona el nivel educacional del padre"
                  validation=""
                  :options="loaderStore.tp_nivel_educacional_padres"
                />
                <FormKit
                  type="select"
                  label="Nivel educacional madre"
                  name="nivel_educacional_madre"
                  placeholder="Selecciona el nivel educacional de la madre"
                  validation=""
                  :options="loaderStore.tp_nivel_educacional_padres"
                />
              </div>
            </template>

            <!-- slot que contiene los botones de accion -->
            <template #actions="{ state }">
              <div class="flex gap-2 place-self-start">
                <Button
                  v-if="formularioSeEstaEditando"
                  :disabled="state.loading || !matriculaValidacionStore.numeroMatriculaDisponible"
                  class="mx-auto"
                >
                  <Loader v-if="state.loading" class="mr-2 h-6 w-6 animate-spin" />
                  Actualizar matricula
                </Button>
                <Button
                  v-else
                  :disabled="state.loading || !matriculaValidacionStore.numeroMatriculaDisponible"
                  class="mx-auto"
                >
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
