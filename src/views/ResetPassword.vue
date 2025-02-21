<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { supabase } from "@/services/supabaseClient";


const { toast } = useToast()
const email = ref('')
const loading = ref(false)

const handleResetPassword = async () => {
  try {
    loading.value = true

    // Verificamos el código del perfil en mv_usuario
    const { data: usuario, error: userError } = await supabase
      .from('mv_usuario')
      .select('codigo_perfil_usuario')
      .eq('email', email.value)
      .single()

    if (userError) throw userError

    if (usuario?.codigo_perfil_usuario === 1 || usuario?.codigo_perfil_usuario === 2) {
      toast({
        title: 'No autorizado',
        description: 'No tienes permiso para cambiar la contraseña',
        variant: 'destructive',
        duration: 3000,
      })
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/actualizar-password`,
    })

    if (error) throw error

    toast({
      title: 'Éxito',
      description: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña',
      variant: 'default',
      duration: 5000,
    })
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
        <h2 class="text-3xl font-bold">Restablecer Contraseña</h2>
        <p class="mt-2 text-gray-600">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
        </p>
      </div>

      <form @submit.prevent="handleResetPassword" class="mt-8 space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="tu@email.com"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {{ loading ? 'Enviando...' : 'Enviar instrucciones' }}
        </button>
      </form>
    </div>
  </div>
</template>
