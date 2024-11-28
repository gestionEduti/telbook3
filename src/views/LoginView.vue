<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="w-full bg-white">
      <form
        class="mx-auto flex max-w-64 flex-col py-32"
        @submit.prevent="$router.push('/dashboard')"
      >
        <p class="mb-4 text-xl font-bold">Ingresar a Telbook</p>

        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" class="mb-4" placeholder="Email" />

        <Label htmlFor="email">Contraseña</Label>
        <Input id="password" type="password" class="mb-2" placeholder="Password" />
        <Button>Ingresar</Button>
      </form>
    </div>
  </div>
</template>

<style></style>
