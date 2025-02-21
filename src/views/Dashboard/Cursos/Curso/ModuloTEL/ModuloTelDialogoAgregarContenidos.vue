<script setup lang="ts">
import type { Tables } from '@/types/supabase'

const authStore = useAuthStore()
const errorStore = useErrorStore()

const emit = defineEmits(['contenidosSeleccionados'])

// nombre del curso
const route = useRoute()
const { nivel, letra } = route.params
const nombreCurso = computed(() => String(nivel) + String(letra))

// bases supabase
const bases = ref<Tables<'tel_bases_fonoaudiologicas'>[] | null>(null)
const fetchBases = async () => {
  const { data, error, status } = await supabase.from('tel_bases_fonoaudiologicas').select()
  if (error) errorStore.setError({ error: error, customCode: status })
  else bases.value = data
}
fetchBases()
const ambitosNivel = computed(() =>
  bases.value?.filter((n) => n.nivel === nivel).map((n) => n.descripcion_ambito),
)
const ambitosUnicos = computed(() => new Set(ambitosNivel.value))
const ambitoSeleccionado = ref<string>('')
const contenidosDelAmbito = computed(() =>
  bases.value?.filter((n) => n.descripcion_ambito === ambitoSeleccionado.value),
)

// contenidos seleccionados
const contenidosSeleccionados = ref<number[]>([]) // lista de ids de alumnos seleccionados
function agregarQuitarContenidoSeleccionado(id: number) {
  if (contenidosSeleccionados.value.includes(id)) {
    contenidosSeleccionados.value = contenidosSeleccionados.value.filter((item) => item !== id)
  } else {
    contenidosSeleccionados.value.push(id)
  }
  emit('contenidosSeleccionados', contenidosSeleccionados.value)
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot></slot>
    </DialogTrigger>

    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>Contenidos</DialogTitle>
        <DialogDescription>
          Selecciona los contenidos que deseas agregar al registro
        </DialogDescription>
      </DialogHeader>

      <!-- seleccionar nivel -->
      <Select v-model="ambitoSeleccionado">
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un ambito" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Ambitos</SelectLabel>
            <SelectItem v-for="ambito in ambitosUnicos" :key="ambito" :value="ambito">
              {{ ambito }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <ScrollArea class="h-64 border p-4">
        <ul class="flex flex-col gap-1">
          <li v-for="contenido in contenidosDelAmbito" :key="contenido.id">
            <div
              @click="agregarQuitarContenidoSeleccionado(contenido.id)"
              class="flex items-end gap-2 space-y-2"
            >
              <Checkbox :checked="contenidosSeleccionados.includes(contenido.id)" class="h-6 w-6" />
              <div class="w-full cursor-pointer rounded-sm">
                <p class="text-sm">{{ contenido.descripcion_contenido }}</p>
              </div>
            </div>
          </li>
        </ul>
      </ScrollArea>

      <DialogFooter>
        <DialogClose>
          <Button> Aceptar </Button>
        </DialogClose>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
