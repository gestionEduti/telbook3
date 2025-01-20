<script setup lang="ts">
// components
import FormularioObservacionesFonoaudiologicas from './AlumnoComponenteObservacionesFonoaudiologicas.vue'
import FormularioObservacionesConvivencia from './AlumnoComponenteObservacionesConvivencia.vue'
import InfoMensajeSinData from '@/components/InfoMensajeSinData.vue'

import type { Tables } from '@/types/supabase' // types de supabase

const errorStore = useErrorStore()

const props = defineProps<{
  rut: string
}>()

import { formatearFechaNacimiento, formatearNacionalidad } from '@/lib/formato' // utilidades para formatear

import { ArrowLeft, Map, NotebookPen, User, Users } from 'lucide-vue-next' // iconos

// data
const alumno = ref<Tables<'mv_libro_matricula'> | null>(null)

// methods
const fetchAlumno = async () => {
  const { data, error, status } = await supabase
    .from('mv_libro_matricula')
    .select()
    .eq('rut_alumno', props.rut)
    .single()
  if (error) errorStore.setError({ error: error, customCode: status })
  else alumno.value = data
}

onMounted(async () => {
  await fetchAlumno()
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <!-- Main card -->
    <Card v-if="alumno" class="shadow-xl">
      <CardHeader>
        <CardTitle class="flex items-end justify-between">
          <span> Ficha del alumno </span>
          <RouterLink :to="{ name: 'alumnos' }">
            <Button>
              <ArrowLeft />
              <span> Volver al curso </span>
            </Button>
          </RouterLink>
        </CardTitle>
        <CardDescription>Informacion y observaciones del alumno.</CardDescription>
        <Separator />
      </CardHeader>

      <!-- content -->
      <CardContent class="flex flex-col gap-4">
        <!-- cards con informacion del alumno -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <!-- datos personales -->
          <Card>
            <CardHeader>
              <CardTitle class="flex space-x-2">
                <User />
                <span>Datos personales</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <template
                v-if="
                  !alumno.nombres_alumno &&
                  !alumno.apellidos_alumno &&
                  !alumno.nacionalidad_alumno &&
                  !alumno.sexo_alumno &&
                  !alumno.fecha_nacimiento_alumno
                "
              >
                <InfoMensajeSinData icono="vacio" mensaje="No hay datos personales" />
              </template>
              <template v-else>
                <div v-if="alumno.nombres_alumno">
                  <p class="telbook-label">Nombres</p>
                  <p class="mb-3 capitalize">
                    {{ alumno.nombres_alumno?.toLocaleLowerCase() }}
                  </p>
                </div>
                <div v-if="alumno.apellidos_alumno">
                  <p class="telbook-label">Apellidos</p>
                  <p class="mb-3 capitalize">
                    {{ alumno.apellidos_alumno?.toLocaleLowerCase() }}
                  </p>
                </div>
                <div v-if="alumno.nacionalidad_alumno">
                  <p class="telbook-label">Nacionalidad</p>
                  <p class="mb-3 capitalize">
                    {{ formatearNacionalidad(alumno.nacionalidad_alumno?.toLowerCase() || '') }}
                  </p>
                </div>
                <div v-if="alumno.sexo_alumno">
                  <p class="telbook-label">Sexo</p>
                  <p class="mb-3 capitalize">
                    {{ alumno.sexo_alumno === 'MASCULINO' ? 'Masculino ♂' : 'Femenino ♀' }}
                  </p>
                </div>
                <div v-if="alumno.fecha_nacimiento_alumno">
                  <p class="telbook-label">Fecha nacimiento</p>
                  <p class="mb-3 capitalize">
                    {{ formatearFechaNacimiento(alumno.fecha_nacimiento_alumno) }}
                  </p>
                </div>
              </template>
            </CardContent>
          </Card>

          <!-- datos familia -->
          <Card>
            <CardHeader>
              <CardTitle class="flex space-x-2">
                <Users />
                <span>Datos familia</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <template
                v-if="
                  !alumno.apoderado_tutor_alumno &&
                  !alumno.email_apoderado_alumno &&
                  !alumno.vive_con_alumno
                "
              >
                <InfoMensajeSinData icono="vacio" mensaje="No hay datos de familia" />
              </template>
              <template v-else>
                <div v-if="alumno.apoderado_tutor_alumno">
                  <p class="telbook-label">Nombre apoderado</p>
                  <p class="mb-3 capitalize">
                    {{ alumno.apoderado_tutor_alumno?.toLowerCase() }}
                  </p>
                </div>
                <div v-if="alumno.email_apoderado_alumno">
                  <p class="telbook-label">Email apoderado</p>
                  <p class="mb-3">
                    <!-- TODO: truncate ó elipsis porque a veces es muy largo. revisar en toda la app el caso -->
                    {{ alumno.email_apoderado_alumno?.toLowerCase() }}
                  </p>
                </div>
                <div v-if="alumno.vive_con_alumno">
                  <p class="telbook-label">Vive con</p>
                  <p class="mb-3 capitalize">
                    {{ alumno.vive_con_alumno?.toLocaleLowerCase() }}
                  </p>
                </div>
              </template>
            </CardContent>
          </Card>

          <!--  -->
          <Card>
            <CardHeader>
              <CardTitle class="flex space-x-2">
                <Map />
                <span>Datos demograficos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <template v-if="!alumno.domicilio_alumno && !alumno.comuna_alumno">
                <InfoMensajeSinData icono="vacio" mensaje="No hay datos demograficos" />
              </template>
              <template v-else>
                <p class="telbook-label">Dirección</p>
                <div class="mb-3">
                  <p class="capitalize" v-if="alumno.domicilio_alumno">
                    {{ alumno.domicilio_alumno?.toLowerCase() }}
                  </p>
                  <p class="capitalize" v-if="alumno.comuna_alumno">
                    {{ alumno.comuna_alumno?.toLowerCase() }}
                  </p>
                  <p class="capitalize" v-if="alumno.region_alumno">
                    {{ alumno.region_alumno?.toLowerCase() }}
                  </p>
                </div>
              </template>
            </CardContent>
          </Card>
        </div>

        <!-- card con los formularios -->
        <Card>
          <CardHeader>
            <CardTitle class="flex space-x-2">
              <NotebookPen />
              <span> Observaciones </span>
            </CardTitle>
          </CardHeader>
          <CardContent class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <!-- Observaciones fonoaudiológicas -->
            <FormularioObservacionesFonoaudiologicas :alumno />

            <!-- Registro de convivencia escolar -->
            <FormularioObservacionesConvivencia :alumno />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  </Transition>
</template>
