<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button/Button.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import Separator from '@/components/ui/separator/Separator.vue'
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <Card>
      <CardHeader>
        <CardTitle>
          <p>Pre matricula</p>
        </CardTitle>
        <CardDescription>
          Realiza la carga de una nomina de alumnos para la pre-matricula.
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent>
        <div class="grid w-full max-w-sm items-center gap-1.5">
          <Label for="picture">Nomina (Archivo excel)</Label>
          <div class="flex w-full max-w-sm items-center gap-1.5">
            <Input id="picture" type="file" />
            <Button> Procesar </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style></style>
