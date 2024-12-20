<script setup lang="ts">
import { ref } from 'vue'

// shadcn
import Button from '@/components/ui/button/Button.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import Label from '@/components/ui/label/Label.vue'
import AlertDialog from '@/components/ui/alert-dialog/AlertDialog.vue'
import AlertDialogTrigger from '@/components/ui/alert-dialog/AlertDialogTrigger.vue'
import AlertDialogContent from '@/components/ui/alert-dialog/AlertDialogContent.vue'
import AlertDialogHeader from '@/components/ui/alert-dialog/AlertDialogHeader.vue'
import AlertDialogTitle from '@/components/ui/alert-dialog/AlertDialogTitle.vue'
import AlertDialogDescription from '@/components/ui/alert-dialog/AlertDialogDescription.vue'
import AlertDialogFooter from '@/components/ui/alert-dialog/AlertDialogFooter.vue'
import AlertDialogCancel from '@/components/ui/alert-dialog/AlertDialogCancel.vue'
import AlertDialogAction from '@/components/ui/alert-dialog/AlertDialogAction.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import { ArchiveX } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

// store
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { establecimiento, perfil } = storeToRefs(useAuthStore())

// data
const nuevaObservacion = ref<string>('')
const observacionesFonoaudiologicas = ref<Tables<'mv_anotaciones_fonoaudiologicas'>[] | null>([])

// vueuse
import { useDateFormat, useNow } from '@vueuse/core'
const year = useDateFormat(useNow(), 'YYYY')
const month = useDateFormat(useNow(), 'MM')
const day = useDateFormat(useNow(), 'DD')
const fecha_anotacion = useDateFormat(useNow(), 'YYYYMMDD')

// props
const props = defineProps<{ alumno: Tables<'mv_libro_matricula'> }>()

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'

// methods
const insertar = async () => {
  const { error } = await supabase.from('mv_anotaciones_fonoaudiologicas').insert({
    anio: year.value, // TODO: revisar por que anio sale con error
    descripcion_anotacion: nuevaObservacion.value,
    dia: day.value,
    fecha_anotacion: String(fecha_anotacion.value),
    mes: month.value,
    numero_matricula: props.alumno.numero_matricula_alumno,
    rbd_escuela: establecimiento.value?.rbd,
    rut_anotador: perfil.value?.rut_usuario,
  })
  if (error) {
    console.error(error)
    toast({
      title: 'Error',
      description: 'Hubo un problema en la creacion de la observación.',
      variant: 'destructive',
    })
  } else {
    toast({
      title: 'Exito',
      description: 'Observacion creada exitosamente.',
      variant: 'exitoso',
    })
  }
}
const fetchObsevacionesFonoaudiologicas = async () => {
  if (props.alumno.numero_matricula_alumno) {
    const { data, error } = await supabase
      .from('mv_anotaciones_fonoaudiologicas')
      .select()
      .eq('numero_matricula', props.alumno.numero_matricula_alumno)
    if (error) console.error(error)
    else observacionesFonoaudiologicas.value = data
  } else {
    console.error('No se pudo obtener el numero de matricula del alumno.')
  }
}

// onMounted(async () => {
//   await fetchObsevacionesFonoaudiologicas()
// })
</script>

<template>
  <div class="grid w-full gap-1.5">
    <Label for="message-2">
      <div class="text-sm font-semibold tracking-tighter text-gray-400">Fonoaudiológicas</div>
    </Label>
    <Textarea
      v-model="nuevaObservacion"
      id="message-2"
      placeholder="Escribe la observacion acá."
      rows="6"
    />
    <div class="flex gap-1">
      <!-- boton guardar -->
      <AlertDialog>
        <AlertDialogTrigger>
          <Button>Guardar</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirma la observacion?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction @click="insertar">Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <!-- boton ver todo -->
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline" @click="fetchObsevacionesFonoaudiologicas"
            >Ver todas las observaciones</Button
          >
        </DialogTrigger>
        <DialogContent
          class="max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] p-0 sm:max-w-[425px]"
        >
          <DialogHeader class="p-6 pb-0">
            <DialogTitle>Observaciones</DialogTitle>
            <DialogDescription>
              Lista de todas las observaciones fonoaudiologicas realizadas al alumno durante el año
              actual.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 overflow-y-auto px-6 py-4">
            <div class="flex h-[300dvh] flex-col justify-between">
              <ul class="grid gap-4" v-if="observacionesFonoaudiologicas?.length">
                <li v-for="item in observacionesFonoaudiologicas" :key="item.id">
                  <Card>
                    <CardHeader>
                      <CardDescription> Observacion de {{ item.rut_anotador }} </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {{ item.descripcion_anotacion || 'Sin observaciones' }}
                    </CardContent>
                  </Card>
                </li>
              </ul>
              <div v-else class="flex flex-col items-center justify-center py-8">
                <ArchiveX clip="text-gray-100" />
                <p class="mx-auto text-sm text-muted-foreground">
                  El alumno no tiene observaciones registradas.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<style></style>
