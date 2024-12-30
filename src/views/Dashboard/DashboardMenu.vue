<script setup lang="ts">
import { computed } from 'vue'

// router
import { useRoute } from 'vue-router'
const route = useRoute()

// data
const navLinks = [
  { routeName: 'cursos', text: 'Cursos', admin: false },
  { routeName: 'matriculas', text: 'Matriculas', admin: false },
  { routeName: 'prematricula', text: 'Pre-Matricula', admin: true },
]

// store
import { useAuthStore } from '@/stores/auth'
const { perfil } = useAuthStore()

// computed
const esAdmin = computed(() => [1, 2].includes(perfil!.codigo_perfil_usuario)) // TODO (modelo) perfil usuario tiene q ser not null
const menuUsuario = computed(() => navLinks.filter((item) => !item.admin || esAdmin))

// methods
const esUnLinkActivo = (routeName: string) => route.name === routeName
</script>

<template>
  <nav class="flex items-baseline space-x-4 lg:space-x-6">
    <template v-for="item in menuUsuario" :key="item.routeName">
      <template v-if="esUnLinkActivo(item.routeName)">
        <p class="cursor-default text-sm font-extrabold">{{ item.text }}</p>
      </template>
      <template v-else>
        <RouterLink
          v-if="!item.admin || (item.admin && esAdmin)"
          :key="item.routeName"
          :to="{ name: item.routeName }"
          :data-test="`nav-${item.routeName}`"
        >
          <p class="text-sm font-medium hover:text-red-600">{{ item.text }}</p>
        </RouterLink>
      </template>
    </template>
  </nav>
</template>

<style></style>

<!-- :class="[
            route.name === item.routeName
              ? 'font-bold text-black'
              : 'font-normal hover:text-red-600',
          ]"
          class="text-sm text-gray-600 transition-colors" -->
