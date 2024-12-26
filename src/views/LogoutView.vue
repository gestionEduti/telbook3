<script setup lang="ts">
import { onMounted } from 'vue'
import { supabase } from '@/services/supabaseClient'
import { useRouter } from 'vue-router'
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
