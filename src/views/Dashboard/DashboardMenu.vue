<script setup lang="ts">
const route = useRoute()

const { perfil } = useAuthStore()

// data
const navLinks = [
  { routeName: 'cursos', text: 'Cursos', admin: false },
  { routeName: 'matriculas', text: 'Matriculas', admin: false },
  { routeName: 'prematricula', text: 'Pre-Matricula', admin: true },
]

const esAdmin = computed(() => [1].includes(perfil!.codigo_perfil_usuario)) // TODO (modelo) perfil usuario tiene q ser not null
const menuUsuario = computed(() => navLinks.filter((item) => !item.admin || esAdmin))

// methods
const esUnLinkActivo = (routeName: string) => route.name === routeName
</script>

<template>
  <nav class="flex items-baseline">
    <template v-for="item in menuUsuario" :key="item.routeName">
      <RouterLink
        v-if="!item.admin || (item.admin && esAdmin)"
        :key="item.routeName"
        :to="{ name: item.routeName }"
        :data-test="`nav-${item.routeName}`"
        class="px-3 py-2"
        :class="[
          esUnLinkActivo(item.routeName) ? 'cursor-default' : 'hover:bg-muted hover:text-red-600',
        ]"
      >
        <p
          class="text-sm font-medium"
          :class="[esUnLinkActivo(item.routeName) ? 'border-b-2 border-red-600 font-semibold' : '']"
        >
          {{ item.text }}
        </p>
      </RouterLink>
    </template>
  </nav>
</template>
