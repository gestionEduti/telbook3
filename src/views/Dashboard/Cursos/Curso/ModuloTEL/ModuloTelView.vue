<script setup lang="ts">
import InfoMensajeSinData from '@/components/InfoMensajeSinData.vue'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Modulo TEL</CardTitle>
      <CardDescription>Descripcion modulo tel.</CardDescription>
      <Separator />
    </CardHeader>
    <CardContent>
      <InfoMensajeSinData icono="mantencion" mensaje="En mantención" />
    </CardContent>
  </Card>
</template>
