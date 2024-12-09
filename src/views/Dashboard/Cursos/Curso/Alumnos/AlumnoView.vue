<script setup lang="ts">
// vue imports
import { onMounted, ref } from 'vue'

// props
const props = defineProps<{ rutAlumno: string }>()

// utils
import { formatearFecha, formatearNacionalidad } from '@/lib/formato'

// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
// icons
import { ArrowLeft, Map, NotebookPen, User, Users } from 'lucide-vue-next'

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import Label from '@/components/ui/label/Label.vue'
import Button from '@/components/ui/button/Button.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
const querySelect = supabase
  .from('mv_libro_matricula')
  .select('*')
  .eq('rut_alumno', props.rutAlumno)
  .single()

// data
const alumno = ref<Tables<'mv_libro_matricula'> | null>(null)

// methods
const fetchAlumnoSupabase = async () => {
  const { data, error } = await querySelect
  if (error) console.error(error)
  else alumno.value = data
}

// lifecycle
onMounted(async () => {
  await fetchAlumnoSupabase()
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <!-- Main card -->
    <Card v-if="alumno" class="shadow-xl">
      <CardHeader>
        <CardTitle class="flex items-end justify-between">
          <span> Ficha del alumno </span>
          <Button>
            <ArrowLeft />
            <RouterLink :to="{ name: 'alumnos' }">Volver al curso</RouterLink>
          </Button>
        </CardTitle>
        <CardDescription>Informacion y observaciones del alumno.</CardDescription>
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
              <div
                v-if="alumno.nombres_alumno"
                class="text-sm font-semibold tracking-tighter text-gray-400"
              >
                Nombres
              </div>
              <p v-if="alumno.nombres_alumno" class="mb-3 capitalize">
                {{ alumno.nombres_alumno?.toLocaleLowerCase() }}
              </p>
              <div
                v-if="alumno.apellidos_alumnos"
                class="text-sm font-semibold tracking-tighter text-gray-400"
              >
                Apellidos
              </div>
              <p v-if="alumno.apellidos_alumnos" class="mb-3 capitalize">
                {{ alumno.apellidos_alumnos?.toLocaleLowerCase() }}
              </p>
              <div
                v-if="alumno.nacionalidad_alumno"
                class="text-sm font-semibold tracking-tighter text-gray-400"
              >
                Nacionalidad
              </div>
              <p v-if="alumno.nacionalidad_alumno" class="mb-3 capitalize">
                {{ formatearNacionalidad(alumno.nacionalidad_alumno?.toLowerCase() || '') }}
              </p>
              <div
                v-if="alumno.sexo_alumno"
                class="text-sm font-semibold tracking-tighter text-gray-400"
              >
                Sexo
              </div>
              <p v-if="alumno.sexo_alumno" class="mb-3 capitalize">
                {{ alumno.sexo_alumno === 'MASCULINO' ? 'Masculino ♂' : 'Femenino ♀' }}
              </p>
              <div
                v-if="alumno.fecha_nacimiento_alumno"
                class="text-sm font-semibold tracking-tighter text-gray-400"
              >
                Fecha nacimiento
              </div>
              <p v-if="alumno.fecha_nacimiento_alumno" class="mb-3 capitalize">
                {{ formatearFecha(alumno.fecha_nacimiento_alumno) }}
              </p>
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
              <div
                v-if="alumno.apoderado_tutor_alumno"
                class="text-sm font-semibold tracking-tighter text-gray-400"
              >
                Nombre apoderado
              </div>
              <p v-if="alumno.apoderado_tutor_alumno" class="mb-3 capitalize">
                {{ alumno.apoderado_tutor_alumno?.toLowerCase() }}
              </p>
              <div
                v-if="alumno.email_apoderado_alumno"
                class="text-sm font-semibold tracking-tighter text-gray-400"
              >
                Email apoderado
              </div>
              <p v-if="alumno.email_apoderado_alumno" class="mb-3">
                {{ alumno.email_apoderado_alumno?.toLowerCase() }}
              </p>
              <div
                v-if="alumno.vive_con_alumno"
                class="text-sm font-semibold tracking-tighter text-gray-400"
              >
                Vive con
              </div>
              <p v-if="alumno.vive_con_alumno" class="mb-3 capitalize">
                {{ alumno.vive_con_alumno?.toLocaleLowerCase() }}
              </p>
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
              <div class="text-sm font-semibold tracking-tighter text-gray-400">Dirección</div>
              <p v-if="alumno.domicilio_alumno && alumno.comuna_alumno" class="mb-3 capitalize">
                {{
                  alumno.domicilio_alumno?.toLowerCase() +
                  ', ' +
                  alumno.comuna_alumno?.toLowerCase() +
                  ', ' +
                  alumno.region_alumno?.toLowerCase()
                }}
              </p>
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
            <div class="grid w-full gap-1.5">
              <Label for="message-2">
                <div class="text-sm font-semibold tracking-tighter text-gray-400">
                  Fonoaudiológicas
                </div>
              </Label>
              <Textarea id="message-2" placeholder="Escribe la observacion acá." rows="6" />
              <div class="flex gap-1">
                <Button>Guardar</Button>
                <Button variant="outline">Ver todas las observaciones</Button>
              </div>
            </div>

            <!-- Registro de convivencia escolar -->
            <div class="grid w-full gap-1.5">
              <Label for="message-2">
                <div class="text-sm font-semibold tracking-tighter text-gray-400">
                  Convivencia escolar
                </div>
              </Label>
              <Textarea id="message-2" placeholder="Escribe la observacion acá." rows="6" />
              <div class="flex gap-1">
                <Button>Guardar</Button>
                <Button variant="outline">Ver todas las observaciones</Button>
              </div>
            </div>
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
