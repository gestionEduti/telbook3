<script setup lang="ts">
// shadcn
import Button from '@/components/ui/button/Button.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import Label from '@/components/ui/label/Label.vue'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
</script>

<template>
  <div class="grid w-full gap-1.5">
    <Label for="message-2">
      <div class="text-sm font-semibold tracking-tighter text-gray-400">Convivencia escolar</div>
    </Label>
    <Textarea id="message-2" placeholder="Escribe la observacion acá." rows="6" />
    <div class="flex gap-1">
      <Button
        @click="
          toast({
            duration: 2000,
            title: 'Titulo ejemplo',
            description: 'Descripcion de ejemplo del mensaje.',
            variant: 'exitoso',
          })
        "
        >Guardar</Button
      >
      <Button variant="outline">Ver todas las observaciones</Button>
    </div>
  </div>
</template>

<style></style>
