<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
//import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'vue-router'

const router = useRouter()
const { toast } = useToast()
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const handleUpdatePassword = async () => {
  if (password.value !== confirmPassword.value) {
    toast({
      title: 'Error',
      description: 'Las contraseñas no coinciden',
      variant: 'destructive',
      duration: 3000,
    })
    return
  }

  try {
    loading.value = true
    const { error } = await supabase.auth.updateUser({
      password: password.value,
    })

    if (error) throw error

    toast({
      title: 'Éxito',
      description: 'Tu contraseña ha sido actualizada correctamente',
      variant: 'default',
      duration: 5000,
    })

    router.push('/login')
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
      duration: 3000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
      <div class="text-center">
        <h2 class="text-3xl font-bold">Actualizar Contraseña</h2>
        <p class="mt-2 text-gray-600">
          Ingresa tu nueva contraseña
        </p>
      </div>

      <form @submit.prevent="handleUpdatePassword" class="mt-8 space-y-6">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Nueva contraseña
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
        </button>
      </form>
    </div>
  </div>
</template>
