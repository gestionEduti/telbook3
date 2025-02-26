<script setup lang="ts">
defineProps<{
  totalMatriculas: number
  totalActivos: number
  totalRetirados: number
}>()
</script>

<template>
  <Alert class="bg-gray-50">
    <AlertDescription>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card class="col-start-2">
          <CardHeader class="flex flex-row items-center justify-center pb-0">
            <CardTitle class="text-sm font-medium"> Total </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-center text-xl font-bold">{{ totalMatriculas }}</div>
          </CardContent>
        </Card>
        <Card class="col-start-3">
          <CardHeader class="flex flex-row items-center justify-center pb-0">
            <CardTitle class="text-sm font-medium"> Activos </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-center text-xl font-bold">
              {{ totalActivos }}
            </div>
          </CardContent>
        </Card>
        <Card class="col-start-4">
          <CardHeader class="flex flex-row items-center justify-center pb-0">
            <CardTitle class="text-sm font-medium"> Retirados </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-center text-xl font-bold">
              {{ totalRetirados }}
            </div>
          </CardContent>
        </Card>
      </div>
    </AlertDescription>
  </Alert>
</template>
