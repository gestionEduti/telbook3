<script setup lang="ts">
// vue imports
import { onMounted, ref } from 'vue'

// store
import { useErrorStore } from '@/stores/error'
const errorStore = useErrorStore()

// props
const props = defineProps<{ rutAlumno: string }>()

// utils
import { formatearFechaNacimiento, formatearNacionalidad } from '@/lib/formato'

// components
import FormularioObservacionesFonoaudiologicas from './AlumnoComponenteObservacionesFonoaudiologicas.vue'
import FormularioObservacionesConvivencia from './AlumnoComponenteObservacionesConvivencia.vue'

// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import Button from '@/components/ui/button/Button.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
// icons
import { ArrowLeft, Map, NotebookPen, User, Users } from 'lucide-vue-next'

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
const querySelect = supabase
  .from('mv_libro_matricula')
  .select('*')
  .eq('rut_alumno', props.rutAlumno)
  .single()

// data
const alumno = ref<Tables<'mv_libro_matricula'> | null>(null)

// methods
const fetchAlumno = async () => {
  const { data, error, status } = await querySelect
  if (error) errorStore.setError({ error: error, customCode: status })
  else alumno.value = data
}

// lifecycle
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
              <div v-if="alumno.nombres_alumno">
                <p class="text-sm font-semibold tracking-tighter text-gray-400">Nombres</p>
                <p class="mb-3 capitalize">
                  {{ alumno.nombres_alumno?.toLocaleLowerCase() }}
                </p>
              </div>
              <div v-if="alumno.apellidos_alumno">
                <p class="text-sm font-semibold tracking-tighter text-gray-400">Apellidos</p>
                <p class="mb-3 capitalize">
                  {{ alumno.apellidos_alumno?.toLocaleLowerCase() }}
                </p>
              </div>
              <div v-if="alumno.nacionalidad_alumno">
                <p class="text-sm font-semibold tracking-tighter text-gray-400">Nacionalidad</p>
                <p class="mb-3 capitalize">
                  {{ formatearNacionalidad(alumno.nacionalidad_alumno?.toLowerCase() || '') }}
                </p>
              </div>
              <div v-if="alumno.sexo_alumno">
                <p class="text-sm font-semibold tracking-tighter text-gray-400">Sexo</p>
                <p class="mb-3 capitalize">
                  {{ alumno.sexo_alumno === 'MASCULINO' ? 'Masculino ♂' : 'Femenino ♀' }}
                </p>
              </div>
              <div v-if="alumno.fecha_nacimiento_alumno">
                <p class="text-sm font-semibold tracking-tighter text-gray-400">Fecha nacimiento</p>
                <p class="mb-3 capitalize">
                  {{ formatearFechaNacimiento(alumno.fecha_nacimiento_alumno) }}
                </p>
              </div>
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
              <div v-if="alumno.apoderado_tutor_alumno">
                <p class="text-sm font-semibold tracking-tighter text-gray-400">Nombre apoderado</p>
                <p class="mb-3 capitalize">
                  {{ alumno.apoderado_tutor_alumno?.toLowerCase() }}
                </p>
              </div>
              <div v-if="alumno.email_apoderado_alumno">
                <p class="text-sm font-semibold tracking-tighter text-gray-400">Email apoderado</p>
                <p class="mb-3">
                  {{ alumno.email_apoderado_alumno?.toLowerCase() }}
                </p>
              </div>
              <div v-if="alumno.vive_con_alumno">
                <p class="text-sm font-semibold tracking-tighter text-gray-400">Vive con</p>
                <p class="mb-3 capitalize">
                  {{ alumno.vive_con_alumno?.toLocaleLowerCase() }}
                </p>
              </div>
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
              <div v-if="alumno.domicilio_alumno && alumno.comuna_alumno">
                <p class="text-sm font-semibold tracking-tighter text-gray-400">Dirección</p>
                <p class="mb-3 capitalize">
                  {{
                    alumno.domicilio_alumno?.toLowerCase() +
                    ', ' +
                    alumno.comuna_alumno?.toLowerCase() +
                    ', ' +
                    alumno.region_alumno?.toLowerCase()
                  }}
                  <!-- TODO: manejar de mejor manera cuando no venga un dato como la region por que me aparee UNDEFINED -->
                </p>
              </div>
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
