<script setup lang="ts">
import { supabase } from '@/services/supabaseClient'
const router = useRouter()

onMounted(async () => {
  await supabase.auth.signOut()
  router.push({ name: 'login' })
})
</script>

<template>
  <div></div>
</template>

<style></style>
