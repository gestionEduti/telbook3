<script setup lang="ts">
import { onErrorCaptured, onMounted } from 'vue'

import AppErrorPage from '@/components/AppErrorPage.vue'

// store
import { useAuthStore } from './stores/auth'
import { useErrorStore } from './stores/error'

// shadcn
import Toaster from '@/components/ui/toast/Toaster.vue'

onErrorCaptured((error) => {
  useErrorStore().setError({ error })
})

onMounted(() => {
  useAuthStore().escucharCambios()
})
</script>

<template>
  <!-- visible en mobile y tablet -->
  <div class="flex h-svh items-center justify-center bg-zinc-200 lg:hidden">
    <p>Resolucion minima 1024x768</p>
  </div>

  <!-- visible en desktop hacia arriba -->
  <div class="hidden min-h-svh bg-zinc-200 lg:block">
    <Toaster />
    <Transition name="fade" mode="out-in">
      <AppErrorPage v-if="useErrorStore().activeError" />
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
