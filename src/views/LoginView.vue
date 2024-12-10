<script setup lang="ts">
import { ref } from 'vue'

// vue router
import { useRouter } from 'vue-router'
const router = useRouter()

// store
import { useAuthStore } from '@/stores/auth'
const { login } = useAuthStore()

// shadcn
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'

// data
const loginForm = ref({
  email: 'sergrodrig@gmail.com',
  password: '123456',
})

// methods
const handleForm = async () => {
  const error = await login(loginForm.value)
  if (!error) return router.push({ name: 'dashboard' })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full bg-white">
      <form class="mx-auto flex max-w-64 flex-col py-32" @submit.prevent="handleForm">
        <p class="mb-4 text-xl font-bold">Ingresar a Telbook</p>

        <Label htmlFor="email">Email</Label>
        <Input v-model="loginForm.email" id="email" type="email" class="mb-4" placeholder="Email" />

        <Label htmlFor="email">Contraseña</Label>
        <Input
          v-model="loginForm.password"
          id="password"
          type="password"
          class="mb-2"
          placeholder="Password"
        />
        <Button type="submit">Ingresar</Button>
      </form>
    </div>
  </div>
</template>
