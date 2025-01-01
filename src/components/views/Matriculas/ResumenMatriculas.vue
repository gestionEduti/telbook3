<script setup lang="ts">
import Alert from '@/components/ui/alert/Alert.vue'
import AlertTitle from '@/components/ui/alert/AlertTitle.vue'
import AlertDescription from '@/components/ui/alert/AlertDescription.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'

defineProps<{
  totalMatriculas: number
  totalActivos: number
  totalRetirados: number
}>()
</script>

<template>
  <Alert class="bg-gray-50">
    <AlertTitle class="mb-4 text-center"> Resumen </AlertTitle>
    <AlertDescription>
      <div class="grid gap-4 pb-4 md:grid-cols-2 lg:grid-cols-5">
        <Card class="col-start-2">
          <CardHeader class="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle class="text-sm font-medium"> Total </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-center text-2xl font-bold">{{ totalMatriculas }}</div>
          </CardContent>
        </Card>
        <Card class="col-start-3">
          <CardHeader class="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle class="text-sm font-medium"> Activos </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-center text-2xl font-bold">
              {{ totalActivos }}
            </div>
          </CardContent>
        </Card>
        <Card class="col-start-4">
          <CardHeader class="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle class="text-sm font-medium"> Retirados </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-center text-2xl font-bold">
              {{ totalRetirados }}
            </div>
          </CardContent>
        </Card>
      </div>
    </AlertDescription>
  </Alert>
</template>
