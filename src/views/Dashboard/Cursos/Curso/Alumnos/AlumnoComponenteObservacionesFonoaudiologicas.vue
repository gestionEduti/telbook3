<script setup lang="ts">
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
const { establecimiento, perfil } = storeToRefs(useAuthStore())
const errorStore = useErrorStore()

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
import Sheet from '@/components/ui/sheet/Sheet.vue'
import SheetTrigger from '@/components/ui/sheet/SheetTrigger.vue'
import SheetContent from '@/components/ui/sheet/SheetContent.vue'
import SheetTitle from '@/components/ui/sheet/SheetTitle.vue'
import SheetHeader from '@/components/ui/sheet/SheetHeader.vue'
import SheetDescription from '@/components/ui/sheet/SheetDescription.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'
import ScrollBar from '@/components/ui/scroll-area/ScrollBar.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import SheetFooter from '@/components/ui/sheet/SheetFooter.vue'

// supabase
type InsertType = Database['public']['Tables']['mv_anotaciones_fonoaudiologicas']['Insert']
// TODO investigar mas de este tipo de tipado

// methods
const insertar = async () => {
  const newObservacion: InsertType = {
    dia: parseInt(day.value), // TODO (modelo) quitar estas columnas redundantes
    mes: parseInt(month.value), // TODO (modelo) quitar estas columnas redundantes
    anio: parseInt(year.value), // TODO (modelo) quitar estas columnas redundantes
    fecha_anotacion: String(fecha_anotacion.value),
    descripcion_anotacion: nuevaObservacion.value,
    numero_matricula: props.alumno.numero_matricula_alumno,
    rbd_escuela: establecimiento.value!.rbd!, // TODO (modelo) tp_establecimiento rbd debe ser not null
    rut_anotador: perfil.value!.rut_usuario!, // TODO (modelo) mv_usuario rut_usuario debe ser not null
  }

  const { error, status } = await supabase
    .from('mv_anotaciones_fonoaudiologicas')
    .insert(newObservacion)

  if (error) {
    errorStore.setError({ error: error, customCode: status })
  } else {
    toast({
      title: 'Exito',
      description: 'Observacion creada exitosamente.',
      variant: 'exitoso',
    })
  }
  nuevaObservacion.value = ''
}
const fetchObsevacionesFonoaudiologicas = async () => {
  if (props.alumno.numero_matricula_alumno) {
    const { data, error, status } = await supabase
      .from('mv_anotaciones_fonoaudiologicas')
      .select()
      .eq('numero_matricula', props.alumno.numero_matricula_alumno)
    if (error) errorStore.setError({ error: error, customCode: status })
    else observacionesFonoaudiologicas.value = data
  } else {
    console.error('No se pudo obtener el numero de matricula del alumno.')
  }
}
</script>

<template>
  <div class="grid w-full gap-1.5">
    <Label for="message-2">
      <div class="telbook-label">Fonoaudiológicas</div>
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
      <Sheet>
        <SheetTrigger>
          <Button variant="outline" @click="fetchObsevacionesFonoaudiologicas">
            Ver todas las observaciones
          </Button>
        </SheetTrigger>
        <SheetContent class="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>Observaciones</SheetTitle>
            <SheetDescription>
              Lista de todas las observaciones fonoaudiologicas realizadas al alumno durante el año
              actual.
            </SheetDescription>
          </SheetHeader>
          <div class="flex-1 overflow-y-auto border p-2 shadow-inner">
            <ScrollArea>
              <ul class="grid gap-2" v-if="observacionesFonoaudiologicas?.length">
                <li v-for="item in observacionesFonoaudiologicas" :key="item.id">
                  <Card>
                    <CardContent class="w-full px-2 pb-0 pt-2 text-left">
                      {{ item.descripcion_anotacion || 'Sin observaciones' }}
                    </CardContent>
                    <CardFooter
                      class="px-2 pb-2 text-sm font-medium tracking-tighter text-gray-400"
                    >
                      Realizada por: {{ item.rut_anotador }}</CardFooter
                    >
                  </Card>
                </li>
              </ul>
              <ScrollBar />
            </ScrollArea>
          </div>
          <SheetFooter class="text-sm tracking-tighter text-gray-400">
            El alumno tiene {{ observacionesFonoaudiologicas?.length }} observación(es).
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  </div>
</template>
