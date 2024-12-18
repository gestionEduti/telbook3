<script setup lang="ts">
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
      <CardTitle>Planificacion corto plazo</CardTitle>
      <CardDescription>Descripcion planificacion corto plazo.</CardDescription>
      <Separator />
    </CardHeader>
    <CardContent></CardContent>
  </Card>
</template>

<style></style>
