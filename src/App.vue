<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

// shadcn
import Toaster from '@/components/ui/toast/Toaster.vue'

onMounted(() => {
  useAuthStore().escucharCambios()
})
</script>

<template>
  <div class="min-h-svh bg-zinc-200">
    <Toaster />
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
