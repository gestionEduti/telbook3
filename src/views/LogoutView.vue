<script setup lang="ts">
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  authStore.limipiarSesion() // realiza un supabase signout, y limpia el store
  router.push({ name: 'login' })
})
</script>

<template>
  <div></div>
</template>
