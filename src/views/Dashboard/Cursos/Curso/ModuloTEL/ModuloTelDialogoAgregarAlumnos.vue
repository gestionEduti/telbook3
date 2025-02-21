<script setup lang="ts">
import type { Tables } from '@/types/supabase'

const authStore = useAuthStore()
const errorStore = useErrorStore()

const emits = defineEmits(['alumnosSeleccionados'])

// nombre del curso
const route = useRoute()
const { nivel, letra } = route.params
const nombreCurso = computed(() => String(nivel) + String(letra))

// alumnos supabase
const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)
const fetchAlumnos = async () => {
  const { data, error, status } = await supabase
    .from('mv_libro_matricula')
    .select()
    .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario)
    .eq('codigo_estado_alumno', '1') // TODO confirmar si es solo activos
    .ilike('nivel_alumno', nombreCurso.value)
    .order('numero_lista_nivel_alumno', { ascending: true })
  if (error) errorStore.setError({ error: error, customCode: status })
  else alumnos.value = data
}
fetchAlumnos()

// alumnos seleccionados
const alumnosSeleccionados = ref<number[]>([]) // lista de ids de alumnos seleccionados
function agregarQuitarAlumnoSeleccionado(id: number) {
  if (alumnosSeleccionados.value.includes(id)) {
    alumnosSeleccionados.value = alumnosSeleccionados.value.filter((idAlumno) => idAlumno !== id)
  } else {
    alumnosSeleccionados.value.push(id)
  }
  emits('alumnosSeleccionados', alumnosSeleccionados.value)
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot></slot>
    </DialogTrigger>

    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>Alumnos del curso</DialogTitle>
        <DialogDescription>
          Selecciona los alumnos que deseas agregar al registro
        </DialogDescription>
      </DialogHeader>

      <ul class="flex flex-col gap-1">
        <li v-for="alumno in alumnos" :key="alumno.id">
          <div
            @click="agregarQuitarAlumnoSeleccionado(alumno.id)"
            class="flex items-end gap-2 space-y-2"
          >
            <Checkbox :checked="alumnosSeleccionados.includes(alumno.id)" class="h-6 w-6" />
            <div class="w-full cursor-pointer rounded-sm">
              <p class="text-sm">{{ alumno.nombre_completo_alumno }}</p>
            </div>
          </div>
        </li>
      </ul>

      <DialogFooter>
        <DialogClose>
          <Button> Aceptar </Button>
        </DialogClose>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
