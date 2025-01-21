<script setup lang="ts">
import { Pen } from 'lucide-vue-next' // iconos

import type { Tables } from '@/types/supabase' // types de supabase

const authStore = useAuthStore()

const props = defineProps<{
  nivel: string
  letra: string
}>()

const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)
const asistenciaData = ref<{ rut: string; nombre: string; comment: string; isPresent: boolean }[]>(
  [],
)
const otp = ref('')

const presentes = computed(() => asistenciaData.value.filter((alumno) => alumno.isPresent))
const ausentes = computed(() => asistenciaData.value.filter((alumno) => !alumno.isPresent))

const fetchSupabase = async () => {
  const { data, error } = await supabase
    .from('mv_libro_matricula')
    .select()
    .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario) // TODO: asegurar 100% que el perfil va a existir
    .ilike('nivel_alumno', props.nivel + props.letra)
    .order('numero_lista_nivel_alumno', { ascending: true })
  if (error) console.error(error)
  else {
    alumnos.value = data
    asistenciaData.value = data.map((alumno) => ({
      rut: alumno.rut_alumno,
      nombre: alumno.nombre_completo_alumno ?? '',
      comment: '',
      isPresent: true,
    }))
  }
}

function saveAsistencia() {
  console.log(asistenciaData.value)
}

onMounted(async () => {
  await fetchSupabase()
})
</script>

<template>
  <Card v-if="alumnos">
    <CardHeader>
      <CardTitle>Asistencia diaria</CardTitle>
      <CardDescription>Pasa la asistencia del dia actual.</CardDescription>
      <Separator />
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-12 gap-4 border-b px-4 pb-2">
        <span class="telbook-label col-span-1 place-self-center">Presente</span>
        <span class="telbook-label col-span-5">Nombre</span>
        <span class="telbook-label col-span-6">Comentario</span>
      </div>
      <div
        v-for="(alumno, index) in asistenciaData"
        :key="index"
        class="grid grid-cols-12 gap-4 border-b p-4"
      >
        <Switch
          :checked="alumno.isPresent"
          v-on:update:checked="alumno.isPresent = $event"
          class="col-span-1 place-self-center"
        />
        <span class="col-span-5 self-center">{{ alumno.nombre || alumno.rut }}</span>
        <Input v-model="alumno.comment" placeholder="Comentario opcional" class="col-span-6" />
      </div>
    </CardContent>
    <CardFooter class="flex flex-col items-start">
      <!--  resumen presentes y ausentes -->
      <div class="mb-4 flex gap-4">
        <Card class="w-36">
          <CardHeader>
            <CardDescription class="text-center text-green-600">Presentes</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-center text-xl font-bold">{{ presentes.length }}</p>
          </CardContent>
        </Card>
        <Card class="w-36">
          <CardHeader>
            <CardDescription class="text-center text-red-600">Ausentes</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-center text-xl font-bold">{{ ausentes.length }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- boton para firmar asistencia -->
      <Dialog>
        <DialogTrigger as-child>
          <Button>
            <Pen />
            <span>Firmar asistencia</span>
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar firma de asistencia</DialogTitle>
            <DialogDescription>
              Debes ingresar el codigo de verificacion para poder firmar la asistencia.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="codigo" class="text-right"> Codigo </Label>
              <Input id="codigo" class="col-span-3" v-model="otp" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button @click="saveAsistencia" :disabled="!otp">
                <Pen />
                <span>Firmar asistencia</span>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardFooter>
  </Card>
</template>
