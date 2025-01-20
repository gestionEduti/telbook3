<script setup lang="ts">
const props = defineProps<{
  nivel: string
  letra: string
}>()

const authStore = useAuthStore()

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import Input from '@/components/ui/input/Input.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import Button from '@/components/ui/button/Button.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'
import Label from '@/components/ui/label/Label.vue'
import { Pen } from 'lucide-vue-next'

import { supabase } from '@/services/supabaseClient'

const queryGetAlumnos = supabase
  .from('mv_libro_matricula')
  .select()
  .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario) // TODO: asegurar 100% que el perfil va a existir
  .ilike('nivel_alumno', props.nivel + props.letra)
  .order('numero_lista_nivel_alumno', { ascending: true })

const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)
const asistenciaData = ref<{ rut: string; nombre: string; comment: string; isPresent: boolean }[]>(
  [],
)
const codigo = ref('')
const presentes = computed(() => asistenciaData.value.filter((alumno) => alumno.isPresent))
const ausentes = computed(() => asistenciaData.value.filter((alumno) => !alumno.isPresent))

const fetchSupabase = async () => {
  const { data, error } = await queryGetAlumnos
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

// lifecycle
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
              <Input id="codigo" class="col-span-3" v-model="codigo" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button @click="saveAsistencia" :disabled="!codigo">
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

<style></style>
