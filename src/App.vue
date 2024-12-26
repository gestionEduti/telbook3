<script setup lang="ts">
import { onErrorCaptured, onMounted } from 'vue'

import AppErrorPage from '@/components/AppErrorPage.vue'

// store
import { useAuthStore } from './stores/auth'
import { useErrorStore } from './stores/error'
const authStore = useAuthStore()
const errorStore = useErrorStore()

// shadcn
import Toaster from '@/components/ui/toast/Toaster.vue'

onErrorCaptured((error) => {
  errorStore.setError({ error })
})

onMounted(() => {
  authStore.escucharCambios()
})
</script>

<template>
  <div class="min-h-svh bg-zinc-200">
    <Toaster />
    <Transition name="fade" mode="out-in">
      <AppErrorPage v-if="errorStore.activeError" />
      <div v-else>
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </Transition>
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
