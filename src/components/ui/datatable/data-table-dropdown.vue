<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { EllipsisVertical, Trash2, UserX, UserPen } from 'lucide-vue-next'

const authStore = useAuthStore()
const matriculasStore = useMatriculasStore()

defineProps<{
  alumno: Tables<'mv_libro_matricula'>
}>()

// usado para los permisos de los botones
const tienePermisos = computed(() => {
  const codigoPerfil = authStore.perfil?.codigo_perfil_usuario
  return codigoPerfil === 1 || codigoPerfil === 2
})

// logica para retirar un alumno
const formularioRetirarAlumno = ref({
  fecha: new Date().toISOString().slice(0, 10),
  motivo: '',
})

const retirarAlumno = async (alumno: Tables<'mv_libro_matricula'>) => {
  const { error, status } = await queryRetirarAlumno({
    rut: alumno.rut_alumno,
    numeroMatricula: alumno.numero_matricula_alumno,
  })
  if (error) errorStore.setError({ error: error, customCode: status })
  else {
    toast({
      title: 'Exito',
      description: 'Alummno retirado exitosamente.',
      variant: 'exitoso',
      duration: 3000,
    })
    formularioRetirarAlumno.value = {
      fecha: new Date().toISOString().slice(0, 10),
      motivo: '',
    }
    matriculasStore.fetchAlumnos()
  }
}

import type { Tables } from '@/types/supabase' // types de supabase
const queryRetirarAlumno = ({ rut, numeroMatricula }: { rut: string; numeroMatricula: number }) =>
  supabase.rpc('actualizar_estado_alumno', {
    p_rut: rut,
    p_numero_matricula: numeroMatricula,
    p_codigo_estado: 0,
    p_fecha_retiro: formularioRetirarAlumno.value.fecha,
    p_causa_retiro: formularioRetirarAlumno.value.motivo,
    p_rut_modificador: authStore.perfil!.rut_usuario,
  })

// logica para eliminar un alumno
const eliminarAlumno = async (id: number) => {
  const { error, status } = await queryEliminarAlumno(id)
  if (error) errorStore.setError({ error: error, customCode: status })
  else {
    // emit('alumnoEliminado')
    matriculasStore.fetchAlumnos()
  }
}
const queryEliminarAlumno = (id: number) =>
  supabase
    .from('mv_libro_matricula')
    .update({ codigo_estado_alumno: 2, estado_alumno: 'ELIMINADO' }) // TODO (modelo) dejar solo 1 de los 2 FK
    .eq('id', id)
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">
        <EllipsisVertical class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem v-if="alumno.codigo_estado_alumno == 1" :disabled="!tienePermisos">
          <RouterLink
            :to="{ name: 'editar-matricula', params: { matriculaId: alumno.id } }"
            class="flex space-x-2"
            :class="{ 'cursor-not-allowed opacity-50': !tienePermisos }"
          >
            <UserPen class="h-4 w-4" />
            <span>Editar</span>
          </RouterLink>
        </DropdownMenuItem>
        <DropdownMenuItem
          @click.stop
          v-if="alumno.codigo_estado_alumno == 1"
          :disabled="!tienePermisos"
        >
          <AlertDialog>
            <AlertDialogTrigger @click.stop :disabled="!tienePermisos">
              <div
                class="flex space-x-2"
                :class="{ 'cursor-not-allowed opacity-50': !tienePermisos }"
              >
                <UserX class="h-4 w-4" />
                <span>Retirar</span>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle> Indique la fecha y motivo de retiro: </AlertDialogTitle>
                <AlertDialogDescription>
                  <div class="flex flex-col space-y-2">
                    <Label for="matriculas-fecha-retiro"> Fecha </Label>
                    <Input
                      id="matriculas-fecha-retiro"
                      v-model="formularioRetirarAlumno.fecha"
                      type="date"
                      label="Fecha de retiro"
                      class="mt-2"
                    />
                    <Label for="matriculas-motivo-retiro"> Motivo </Label>
                    <Textarea
                      id="matriculas-motivo-retiro"
                      v-model="formularioRetirarAlumno.motivo"
                      label="Motivo"
                      class="mt-2"
                      placeholder="Escribe acá el motivo"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  @click.stop="retirarAlumno(alumno)"
                  :disabled="!formularioRetirarAlumno.fecha || !formularioRetirarAlumno.motivo"
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuItem>

        <!-- boton eliminar -->
        <DropdownMenuItem :disabled="!tienePermisos">
          <AlertDialog>
            <AlertDialogTrigger @click.stop :disabled="!tienePermisos">
              <div
                class="flex space-x-2"
                :class="{ 'cursor-not-allowed opacity-50': !tienePermisos }"
              >
                <Trash2 class="h-4 w-4" />
                <span>Eliminar</span>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle> ¿Seguro que desea eliminar al alumno? </AlertDialogTitle>
                <AlertDialogDescription> Esta acción no se puede deshacer. </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  @click.stop="eliminarAlumno(alumno.id)"
                  :disabled="!tienePermisos"
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
