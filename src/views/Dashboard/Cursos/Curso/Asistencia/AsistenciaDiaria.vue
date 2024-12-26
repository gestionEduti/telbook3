<script setup lang="ts">
// vue imports
import { ref, onMounted, h } from 'vue'

// props
const props = defineProps<{ siglaCurso: string }>()

// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import Label from '@/components/ui/label/Label.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'
import { toast } from '@/components/ui/toast'
import Separator from '@/components/ui/separator/Separator.vue'
// icons
import { Pen } from 'lucide-vue-next'

// store
import { useErrorStore } from '@/stores/error'
const errorStore = useErrorStore()

// supabase
import type { Tables } from '@/types/supabase'
import { supabase } from '@/services/supabaseClient'
const querySelect = supabase
  .from('mv_libro_matricula')
  .select('*')
  .eq('rbd_establecimiento', 26005)
  .eq('nivel_alumno', props.siglaCurso)
  .order('apellidos_alumno', { ascending: true })

// data
const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null)

// methods
const fetchSupabase = async () => {
  const { data, error, status } = await querySelect
  if (error) errorStore.setError({ error: error, customCode: status })
  else alumnos.value = data
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
      <ul class="mb-3 divide-y">
        <li
          class="grid grid-cols-12 items-center gap-2 py-3 text-sm font-semibold tracking-tighter text-gray-400"
        >
          <span class="col-span-4">Nombre</span>
          <span class="col-span-2">Estado</span>
          <span class="col-span-6">Comentario</span>
        </li>
        <li
          v-for="alumno in alumnos"
          :key="alumno.id"
          class="grid grid-cols-12 items-center gap-2 py-3"
        >
          <span class="col-span-4 truncate capitalize">
            {{ alumno.nombre_completo_alumno?.toLowerCase() }}
          </span>
          <Switch class="col-span-2" />
          <Input class="col-span-6 w-full" />
        </li>
      </ul>
    </CardContent>
    <CardFooter class="flex items-center justify-between">
      <!-- <div class="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Badge>{{ 10 }} presentes</Badge>
        <Badge>{{ 4 }} ausentes</Badge>
      </div> -->
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
              <Input id="codigo" class="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button type="submit" @click="toast({ title: 'Asistencia firmada exitosamente!' })">
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
