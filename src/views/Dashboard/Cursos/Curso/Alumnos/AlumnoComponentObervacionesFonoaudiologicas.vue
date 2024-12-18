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
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

// store
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const { establecimiento, perfil } = storeToRefs(useAuthStore())

// data
const observacionFonoaudiologica = ref<string>('')

// vueuse
import { useDateFormat, useNow } from '@vueuse/core'
const anio = useDateFormat(useNow(), 'YYYY')
const mes = useDateFormat(useNow(), 'MM')
const dia = useDateFormat(useNow(), 'DD')
const fecha_anotacion = useDateFormat(useNow(), 'YYYYMMDD')

// props
const props = defineProps<{ alumno: Tables<'mv_libro_matricula'> }>()

// supabase
import { supabase } from '@/services/supabaseClient'
import type { Tables } from '@/types/supabase'
const insertar = async () => {
  const { data, error } = await supabase
    .from('mv_anotaciones_fonoaudiologicas')
    .insert({
      anio: parseInt(anio.value),
      descripcion_anotacion: observacionFonoaudiologica.value,
      dia: parseInt(dia.value),
      fecha_anotacion: String(fecha_anotacion.value),
      mes: parseInt(mes.value),
      numero_matricula: props.alumno.numero_matricula_alumno,
      rbd_escuela: establecimiento.value?.rbd,
      rut_anotador: perfil.value?.rut_usuario,
    })
    .select()

  if (error) {
    console.error(error)
    toast({
      duration: 2000,
      title: 'Error',
      description: 'Hubo un problema en la creacion de la observación.',
      variant: 'destructive',
    })
  } else {
    toast({
      duration: 2000,
      title: 'Exito',
      description: 'Observacion creada exitosamente.',
      variant: 'exitoso',
    })
  }
}
</script>

<template>
  <div class="grid w-full gap-1.5">
    <Label for="message-2">
      <div class="text-sm font-semibold tracking-tighter text-gray-400">Fonoaudiológicas</div>
    </Label>
    <Textarea
      v-model="observacionFonoaudiologica"
      id="message-2"
      placeholder="Escribe la observacion acá."
      rows="6"
    />
    <div class="flex gap-1">
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
      <Button variant="outline">Ver todas las observaciones</Button>
    </div>
  </div>
</template>

<style></style>
