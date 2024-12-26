<script setup lang="ts">
import { useErrorStore } from '@/stores/error'
useErrorStore().setError({ error: 'Esta pagina no existe.', customCode: 404 })
</script>

<template>
  <div></div>
</template>
