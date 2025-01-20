<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
</script>

<template>
  <div class="grid w-full gap-1.5">
    <Label for="message-2">
      <div class="telbook-label">Convivencia escolar</div>
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
