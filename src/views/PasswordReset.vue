<script setup lang="ts">
import { Save, MoveLeft } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

import router from '@/router'

const password = ref('')
const confirmacion = ref('')

const passwordValidation: [string, ...any[]][] = [
  ['required'],
  ['length', 6],
  // [
  //   'matches',
  //   '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'\"\\\\|,.<>?/`~]).{6,}$',
  // ],
]

async function reset() {
  const { error } = await supabase.auth.updateUser({
    password: password.value,
  })
  if (error) {
    if (error.code === 'same_password') {
      toast({
        title: 'Hubo un error',
        description: 'No puede ser la misma contraseña anterior',
        variant: 'destructive',
        duration: 3000,
      })
    }
    if (error.code === 'weak_password') {
      toast({
        title: 'Hubo un error',
        description:
          'La contraseña debe tener al menos 6 caracteres, incluyendo una minúscula, una mayúscula, un número y un carácter especial.',
        variant: 'destructive',
        duration: 3000,
      })
    }
  } else {
    toast({
      title: 'Exito',
      description: 'Contraseña actualizada exitosamente',
      variant: 'exitoso',
      duration: 3000,
    })
    router.push('dashboard')
  }
}

async function volver() {
  router.push('dashboard')
}
</script>

<template>
  <div class="mx-auto my-auto flex min-h-svh max-w-sm items-center justify-center">
    <div class="flex-1 space-y-3 px-4 py-8 pt-3">
      <Transition name="fade" mode="out-in">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center justify-between">Reiniciar contraseña</CardTitle>
          </CardHeader>

          <CardContent>
            <FormKit
              type="password"
              name="password"
              label="Nueva contraseña"
              v-model="password"
              :validation="passwordValidation"
              :validation-messages="{
                matches:
                  'La contraseña debe tener al menos 6 caracteres, incluyendo una minúscula, una mayúscula, un número y un carácter especial.',
              }"
            />
            <FormKit
              type="password"
              name="confirm"
              label="Confirmar contraseña"
              v-model="confirmacion"
            />
          </CardContent>

          <CardFooter>
            <!-- boton -->
            <div class="flex w-full justify-between">
              <Button class="flex gap-4" @click="volver" variant="secondary">
                <MoveLeft />
                <span>Volver</span>
              </Button>
              <Button class="flex gap-4" @click="reset">
                <Save />
                <span>Reiniciar</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Transition>
    </div>
  </div>
</template>
