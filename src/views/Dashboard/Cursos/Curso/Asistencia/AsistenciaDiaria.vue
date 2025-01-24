<script setup lang="ts">
const router = useRouter()
import { fechaConTimezone } from '@/lib/formato'
import { Pen, Check } from 'lucide-vue-next' // iconos
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

import type { Tables } from '@/types/supabase' // types de supabase
interface AsistenciaDiaria {
  rut_alumno: string
  nombre: string
  comentario: string
  estado: number
} // tipo que representa los datos de asistencia del dia

const authStore = useAuthStore()
const errorStore = useErrorStore()

const props = defineProps<{
  nivel: string
  letra: string
}>()

const alumnos = ref<Tables<'mv_libro_matricula'>[] | null>(null) // alumnos del curso
const asistenciaData = ref<AsistenciaDiaria[]>([]) // datos de asistencia del dia
const otp = ref('') // codigo de verificacion
const asistenciaRealizada = ref(false) // flag para saber si la asistencia ya se ha realizado

const presentes = computed(() => asistenciaData.value.filter((alumno) => alumno.estado == 1))
const ausentes = computed(() => asistenciaData.value.filter((alumno) => alumno.estado == 0))

const fetchSupabase = async () => {
  const { data, error } = await supabase
    .from('mv_libro_matricula')
    .select()
    .eq('rbd_establecimiento', authStore.perfil!.rbd_usuario) // TODO: asegurar 100% que el perfil va a existir
    .ilike('nivel_alumno', props.nivel + props.letra)
    .order('numero_lista_nivel_alumno', { ascending: true })
  if (error) console.error(error)
  else {
    alumnos.value = data // info de los alumnos del curso

    // poblar asistenciaData con los datos de los alumnos y quedan todos presentes por defecto y sin comentarios
    // esta variable la usa el formulario de cada alumno para guardar la asistencia
    asistenciaData.value = data.map((alumno) => ({
      rut_alumno: alumno.rut_alumno,
      nombre: alumno.nombre_completo_alumno ?? '',
      comentario: '',
      estado: 1,
    }))
  }
}

async function validarOTP() {
  const rut = authStore.perfil?.rut_usuario
  const fecha = fechaConTimezone()
  const url = `/mineduc/otp/verify-otp?rut=${rut}&otp=${otp.value}&DateWithTimeZone=${fecha}`
  const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  const response = await fetch(url, options)
  const json = await response.json()
  return json
}

async function saveAsistencia() {
  // llamada a la api de mineduc
  const respuestaOTP = await validarOTP()

  // guardar asistencia en supabase
  const { error } = await supabase.rpc('prueba_tx_asistencia_diaria', {
    rbd: authStore.perfil?.rbd_usuario,
    curso: props.nivel + props.letra,
    otp: otp.value,
    respuesta_otp: respuestaOTP,
    alumnos: asistenciaData.value,
    usuario_ingreso: authStore.perfil?.rut_usuario,
  })

  if (error) {
    errorStore.setError({ error, customCode: 500 })
  } else {
    toast({
      title: 'Asistencia guardada correctamente',
      description: 'La asistencia se ha guardado correctamente',
      duration: 3000,
    })
    router.push({ name: 'dashboard' })
  }
}

async function verificarAsistenciaExistente() {
  const { data, error } = await supabase
    .from('view_asistencias_realizadas')
    .select('*')
    .eq('rbd', authStore.perfil?.rbd_usuario)
    .eq('curso', props.nivel + props.letra)
    .eq('dia', new Date().toISOString().split('T')[0])

  if (error) {
    errorStore.setError({ error, customCode: 500 })
  } else if (data.length > 0) {
    asistenciaRealizada.value = true // si hay resultados, es porque ya se realizo la asistencia
  } else {
    asistenciaRealizada.value = false // si no hay resultados, es porque no se realizo la asistencia
  }
}

onMounted(async () => {
  await Promise.all([verificarAsistenciaExistente(), fetchSupabase()])
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
      <div v-if="!asistenciaRealizada">
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
            :checked="alumno.estado === 1"
            v-on:update:checked="alumno.estado = $event ? 1 : 0"
            class="col-span-1 place-self-center"
          />
          <span class="col-span-5 self-center">{{ alumno.nombre || alumno.rut_alumno }}</span>
          <Input v-model="alumno.comentario" placeholder="Comentario opcional" class="col-span-6" />
        </div>
      </div>
      <div v-else class="flex gap-2">
        <Check class="text-green-600" />
        <p>La asistencia ya fue realizada para este curso el dia de hoy.</p>
      </div>
    </CardContent>

    <CardFooter v-if="!asistenciaRealizada" class="flex flex-col items-start">
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
              <Input id="codigo" class="col-span-3" v-model="otp" maxlength="6" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button @click="saveAsistencia" :disabled="!otp || otp.length !== 6">
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
