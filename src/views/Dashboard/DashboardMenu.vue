<script setup lang="ts">
// data
const navLinks = [
  { routeName: 'cursos', text: 'Cursos' },
  { routeName: 'matriculas', text: 'Matriculas' },
]
</script>

<template>
  <nav class="flex items-baseline space-x-4 lg:space-x-6">
    <RouterLink
      v-for="{ routeName, text } in navLinks"
      :key="routeName"
      :to="{ name: routeName }"
      class="text-sm font-medium transition-colors hover:text-primary"
    >
      {{ text }}
    </RouterLink>
  </nav>
</template>

<style></style>
