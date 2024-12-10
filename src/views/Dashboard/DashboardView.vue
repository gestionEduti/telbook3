<script setup lang="ts">
import DashboardMenu from './DashboardMenu.vue'
import DashboardAvatar from './DashboardAvatar.vue'
import DashboardLogo from './DashboardLogo.vue'
</script>

<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div class="bg-white">
      <header class="contenedor">
        <div class="flex h-16 items-center justify-between px-4">
          <div class="flex space-x-8">
            <DashboardLogo />
            <DashboardMenu />
          </div>
          <DashboardAvatar />
        </div>
      </header>
    </div>

    <!-- Contenido -->
    <main class="contenedor">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" class="" />
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer></footer>
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
