<script setup lang="ts">
import { ref } from 'vue'

import { TriangleAlert } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'

const props = defineProps<{
  message: string
  customCode: number
  statusCode: number
  isCustomError: boolean
}>()

const error = ref({
  code: 500,
  msg: 'Oops, something went wrong!',
})

if (props.isCustomError) {
  error.value.code = props.customCode
  error.value.msg = props.message
}

if (props.statusCode === 406) {
  error.value.code = 404
  error.value.msg = "Sorry, we couldn't find this page"
}
</script>

<template>
  <div>
    <TriangleAlert class="error__icon" />
    <h1 class="error__code">{{ error.code }}</h1>
    <h1 class="error__msg">{{ error.msg }}</h1>
    <div class="error-footer">
      <p class="error-footer__text">You'll find lots to explore on the home page.</p>
      <RouterLink :to="{ name: 'dashboard' }">
        <Button class="max-w-36"> Volver al libro </Button>
      </RouterLink>
    </div>
  </div>
</template>
