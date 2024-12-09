<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle>Asistencia mensual</CardTitle>
        <CardDescription>Descripcion asistencia mensual.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  </div>
</template>

<style></style>
