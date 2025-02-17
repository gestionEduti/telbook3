<script setup lang="ts">
import { Info, Trash2, ToggleRight } from 'lucide-vue-next'

const errorStore = useErrorStore()
const authStore = useAuthStore()

const emit = defineEmits(['oasSeleccionados'])

// nombre del curso
const route = useRoute()
const { nivel } = route.params

// bases
const basesCurriculares = ref<BasesOrdenadas | null>(null)

const queryBasesOrdenadas = supabase
  .from('tp_bases_curriculares')
  .select(
    `
    id,
    descripcion_ambito,
    descripcion_nucleo,
    descripcion_oa
    `,
  )
  .eq('nivel', nivel)
  .order('descripcion_ambito')
  .order('descripcion_nucleo')
  .order('descripcion_oa')
  .order('id')
type BasesOrdenadas = QueryData<typeof queryBasesOrdenadas>

// oas agregados
const oasSeleccionados = ref<number[]>([])
function agregarQuitarOaSeleccionado(id: number) {
  if (oasSeleccionados.value.includes(id)) {
    oasSeleccionados.value = oasSeleccionados.value.filter((item) => item !== id)
  } else {
    oasSeleccionados.value.push(id)
  }
  emit('oasSeleccionados', oasSeleccionados.value)
}

/**
 * trae las bases curriculares para los select
 */
async function fetchBasesCurriculares() {
  const { data, error } = await queryBasesOrdenadas
  if (error) errorStore.setError({ error, customCode: 500 })
  else basesCurriculares.value = data
}
fetchBasesCurriculares()

// computed
const ambitoSeleccionado = ref<string>('')
const nucleoSeleccionado = ref<string>('')

/**
 * genera un array con los ambitos para usar en el select
 */
const optionsAmbitos = computed(() => {
  if (!basesCurriculares.value) return []
  return [...new Set(basesCurriculares.value.map((b) => b.descripcion_ambito))]
})

/**
 * genera un array con los nucleos que corresponden al ambito seleccionado para usar en el select
 */
const optionsNucleos = computed(() => {
  if (!basesCurriculares.value) return []
  else if (!ambitoSeleccionado.value) return []
  const filteredNucleos = basesCurriculares.value
    .filter((n) => n.descripcion_ambito === ambitoSeleccionado.value)
    .map((b) => b.descripcion_nucleo)
  return [...new Set(filteredNucleos)]
})

/**
 * genera un array con los oa que corresponden al ambito y nucleo seleccionado para usar en el select
 */
const optionsOas = computed(() => {
  if (!basesCurriculares.value) return []
  const filteredOas = basesCurriculares.value.filter(
    (b) =>
      b.descripcion_ambito === ambitoSeleccionado.value &&
      b.descripcion_nucleo === nucleoSeleccionado.value,
  )
  const ordenados = filteredOas.sort((a, b) => a.id - b.id)
  return ordenados
})
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <Button>
        <ToggleRight />
        <span>Agregar / Quitar OAS</span>
      </Button>
    </DialogTrigger>

    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>Contenidos</DialogTitle>
        <DialogDescription>
          Selecciona los contenidos que deseas agregar al registro
        </DialogDescription>
      </DialogHeader>

      <!-- seleccionar ambito -->
      <Select v-model="ambitoSeleccionado">
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un ambito" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Ambitos</SelectLabel>
            <SelectItem v-for="ambito in optionsAmbitos" :key="ambito" :value="ambito">
              {{ ambito }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <!-- seleccionar nucleo -->
      <Select v-model="nucleoSeleccionado">
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un nucleo" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Nucleos</SelectLabel>
            <SelectItem v-for="nucleo in optionsNucleos" :key="nucleo" :value="nucleo">
              {{ nucleo }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <ScrollArea class="h-64 border p-4">
        <ul class="flex flex-col gap-1">
          <li v-for="oa in optionsOas" :key="oa.id">
            <div
              @click="agregarQuitarOaSeleccionado(oa.id)"
              class="flex items-center gap-2 space-y-2"
            >
              <Info :size="24" />
              <Checkbox :checked="oasSeleccionados.includes(oa.id)" class="h-6 w-6" />
              <div class="w-full cursor-pointer rounded-sm">
                <p class="truncate text-sm">{{ oa.descripcion_oa }}</p>
              </div>
            </div>
          </li>
        </ul>
      </ScrollArea>

      <DialogFooter>
        <DialogClose>
          <Button> Volver </Button>
        </DialogClose>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>

<!-- <div class="mb-4">
    <Label> <p class="mb-2">Objetivos de aprendizaje</p></Label>

    <div class="border p-2">
      <p v-if="!oasAgregados.length" class="mb-3 text-sm tracking-tight text-gray-600">
        * Esta planificacion aun no tiene OAS
      </p>
      <ul v-else class="mb-3 grid grid-cols-1 gap-2">
        <li v-for="oa in oasAgregados" :key="oa.id">
          <HoverCard>
            <HoverCardTrigger>
              <div class="flex cursor-help items-center text-xs">
                <span
                  class="truncate rounded-bl rounded-tl bg-gray-800 p-2 text-center font-bold text-white"
                >
                  {{ oa.descripcion_oa }}
                </span>
                <button
                  @click="quitarOa(oa.id)"
                  class="rounded-br rounded-tr bg-red-700 px-2 py-2 text-white"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <Card>
                <CardHeader>
                  <CardTitle>№ {{ oa.id }}</CardTitle>
                </CardHeader>
                <CardContent class="flex flex-col gap-2">
                  <p>
                    <span class="font-medium underline">Ambito:</span>
                    {{ oa.descripcion_ambito.toLocaleLowerCase() }}
                  </p>
                  <p>
                    <span class="font-medium underline">Nucleo:</span>
                    {{ oa.descripcion_nucleo.toLocaleLowerCase() }}
                  </p>
                  <p>
                    <span class="font-medium underline">OA:</span>
                    {{ oa.descripcion_oa.toLocaleLowerCase() }}
                  </p>
                </CardContent>
              </Card>
            </HoverCardContent>
          </HoverCard>
        </li>
      </ul>

      <Dialog>
        <DialogTrigger as-child>
          <Button>
            <ToggleRight />
            <span>Agregar / Quitar OAS</span>
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar OA</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div class="flex flex-col gap-4">
            <Select v-model="selectedAmbito">
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un ambito" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="item in optionsAmbitos" :value="item" :key="item">
                    {{ item }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select v-model="selectedNucleo" :disabled="!selectedAmbito">
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un nucleo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="item in optionsNucleos" :value="item" :key="item">
                    {{ item }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select v-model="selectedOa" :disabled="!selectedNucleo" class="w-[100px]">
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un oa" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="item in optionsOas" :value="String(item.id)" :key="item.id">
                    <p class="max-w-xs text-ellipsis">{{ item.id }}. {{ item.descripcion_oa }}</p>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <DialogFooter>
              <DialogClose>
                <Button
                  :disable="!selectedAmbito && !selectedNucleo && !selectedOa"
                  @click="agregarOa"
                >
                  Agregar
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div> -->
