<script setup lang="ts">
import InfoMensajeSinData from '@/components/InfoMensajeSinData.vue'

// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Separator from '@/components/ui/separator/Separator.vue'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Leccionario</CardTitle>
      <CardDescription>Descripcion leccionario.</CardDescription>
      <Separator />
    </CardHeader>
    <CardContent>
      <InfoMensajeSinData icono="mantencion" mensaje="En mantención" />
    </CardContent>
  </Card>
</template>

<style></style>
