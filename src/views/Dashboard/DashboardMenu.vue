<script setup lang="ts">
import { computed } from 'vue'

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
const esAdmin = computed(() => {
  return perfil?.codigo_perfil_usuario === 1 || perfil?.codigo_perfil_usuario === 2
})
</script>

<template>
  <nav class="flex items-baseline space-x-4 lg:space-x-6">
    <template v-for="item in navLinks">
      <RouterLink
        v-if="!item.admin || (item.admin && esAdmin)"
        :key="item.routeName"
        :to="{ name: item.routeName }"
        class="text-sm font-medium transition-colors hover:text-primary"
      >
        {{ item.text }}
      </RouterLink>
    </template>
  </nav>
</template>

<style></style>
