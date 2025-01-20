<script setup lang="ts">
import DashboardMenu from './DashboardMenu.vue'
import DashboardAvatar from './DashboardAvatar.vue'
import DashboardLogo from './DashboardLogo.vue'

const authStore = useAuthStore()
</script>

<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div class="bg-white">
      <header class="contenedor">
        <div class="flex h-16 items-center justify-between px-4">
          <!-- logo y menu -->
          <div class="flex items-center space-x-4">
            <DashboardLogo />
            <DashboardMenu />
          </div>

          <!-- nombre colegio y avatar -->
          <div class="flex items-center space-x-4">
            <p
              data-test="dashboard-nombre-establecimiento"
              class="text-xs font-semibold capitalize tracking-tight text-gray-500"
            >
              {{ authStore.establecimiento?.razon_social?.toLocaleLowerCase() }}
            </p>
            <DashboardAvatar />
          </div>
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
