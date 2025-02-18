<script setup lang="ts">
const errorStore = useErrorStore()

// nombre del curso
const route = useRoute()
const { nivel } = route.params

// oas
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
const basesCurriculares = ref<BasesOrdenadas | null>(null)

const selectedAmbito = ref<string>('')
const selectedNucleo = ref<string>('')
const selectedOa = ref<string>('')

/**
 * trae las bases curriculares para los select
 */
async function fetchBasesCurriculares() {
  const { data, error } = await queryBasesOrdenadas
  if (error) errorStore.setError({ error, customCode: 500 })
  else basesCurriculares.value = data
}
fetchBasesCurriculares()

const oasAgregados = ref<BasesOrdenadas>([])

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
  const filteredNucleos = basesCurriculares.value
    .filter((n) => n.descripcion_ambito === selectedAmbito.value)
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
      b.descripcion_ambito === selectedAmbito.value &&
      b.descripcion_nucleo === selectedNucleo.value,
  )
  const ordenados = filteredOas.sort((a, b) => a.id - b.id)
  return ordenados
})

/**
 * agrega un oa a la planificacion que esta siendo creada
 */
function agregarOa() {
  if (!basesCurriculares.value) return
  if (!selectedOa.value) return
  const oa = basesCurriculares.value.find((b) => b.id == Number(selectedOa.value))
  if (oa && !oasAgregados.value.some((item) => item.id === oa.id)) {
    oasAgregados.value.push(oa)
  }
  // selectedAmbito.value = ''
  // selectedNucleo.value = ''
  selectedOa.value = ''
}

/**
 * quita un oa de la planificacion que esta siendo creada
 * @param id
 */
function quitarOa(id: number) {
  oasAgregados.value = oasAgregados.value.filter((oa) => oa.id !== id)
}
</script>

<template>
  <div class="mb-4">
    <Label> <p class="mb-2">Objetivos de aprendizaje</p></Label>

    <div class="border p-2">
      <p v-if="!oasAgregados.length" class="mb-3 text-sm tracking-tight text-gray-600">
        * Esta planificacion aun no tiene OAS
      </p>
      <ul v-else class="mb-3 grid grid-cols-1 gap-2">
        <Accordion type="single" collapsible>
          <AccordionItem
            value="COMUNICACION INTEGRAL"
            v-if="oasAgregados.find((oa) => oa.descripcion_ambito === 'COMUNICACION INTEGRAL')"
          >
            <AccordionTrigger>
              <p>
                <span>
                  <Badge>
                    {{
                      oasAgregados.filter((o) => o.descripcion_ambito === 'COMUNICACION INTEGRAL')
                        .length
                    }}
                  </Badge>
                </span>
                Comunicación integral
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p
                class="mb-2"
                v-for="oa in oasAgregados.filter(
                  (o) => o.descripcion_ambito === 'COMUNICACION INTEGRAL',
                )"
                :key="oa.id"
              >
                <button @click="quitarOa(oa.id)" class="bg-red-700 px-2 py-2 text-white">
                  <Trash2 :size="16" />
                </button>
                {{ oa.descripcion_oa.toLocaleLowerCase() }}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="DESARROLLO PERSONAL Y SOCIAL"
            v-if="
              oasAgregados.find((oa) => oa.descripcion_ambito === 'DESARROLLO PERSONAL Y SOCIAL')
            "
          >
            <AccordionTrigger>
              <p>
                <span>
                  <Badge>
                    {{
                      oasAgregados.filter(
                        (o) => o.descripcion_ambito === 'DESARROLLO PERSONAL Y SOCIAL',
                      ).length
                    }}
                  </Badge>
                </span>
                Desarrollo personal y social
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p
                class="mb-2"
                v-for="oa in oasAgregados.filter(
                  (o) => o.descripcion_ambito === 'DESARROLLO PERSONAL Y SOCIAL',
                )"
                :key="oa.id"
              >
                <button @click="quitarOa(oa.id)" class="bg-red-700 px-2 py-2 text-white">
                  <Trash2 :size="16" />
                </button>
                {{ oa.descripcion_oa.toLocaleLowerCase() }}
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="INTERACCION Y COMPRENSION DEL ENTORNO"
            v-if="
              oasAgregados.find(
                (oa) => oa.descripcion_ambito === 'INTERACCION Y COMPRENSION DEL ENTORNO',
              )
            "
          >
            <AccordionTrigger>
              <p>
                <span>
                  <Badge>
                    {{
                      oasAgregados.filter(
                        (o) => o.descripcion_ambito === 'INTERACCION Y COMPRENSION DEL ENTORNO',
                      ).length
                    }}
                  </Badge>
                </span>
                Interacción y comprensión del entorno
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p
                class="mb-2"
                v-for="oa in oasAgregados.filter(
                  (o) => o.descripcion_ambito === 'INTERACCION Y COMPRENSION DEL ENTORNO',
                )"
                :key="oa.id"
              >
                <button @click="quitarOa(oa.id)" class="bg-red-700 px-2 py-2 text-white">
                  <Trash2 :size="16" />
                </button>
                {{ oa.descripcion_oa.toLocaleLowerCase() }}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ul>

      <Dialog>
        <DialogTrigger as-child>
          <Button>
            <Plus />
            <span>Agregar</span>
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar OA</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div class="flex flex-col gap-4">
            <!-- select ambito -->
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

            <!-- select nucleo -->
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

            <!-- select oa -->
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
  </div>
</template>
