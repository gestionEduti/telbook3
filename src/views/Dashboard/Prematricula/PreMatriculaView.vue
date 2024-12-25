<script setup lang="ts">
// prematricula store
import { usePrematriculaStore } from '@/stores/prematricula'
const prematriculaStore = usePrematriculaStore()
const { nomina, totalAlumnos } = storeToRefs(usePrematriculaStore())

// shadcn
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button/Button.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { Loader } from 'lucide-vue-next'

// types
import type { FormKitFormData } from '@/types/nomina'
import { storeToRefs } from 'pinia'

const submitHandler = async (data: FormKitFormData) => {
  const primerArchivo = data.license[0].file // viene 1 o mas archivos en un array. este es el primero
  await prematriculaStore.procesarNomina(primerArchivo)
}
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
        <!-- formulario -->
        <FormKit id="licenseForm" type="form" @submit="submitHandler" :actions="false">
          <template #default="{ state }">
            <FormKit
              type="file"
              label="Nomina"
              name="license"
              help="Solo un archivo a la vez del tipo .xls"
              accept=".xls,.xlsx,.xltx,.xhtml"
              validation="required"
            />
            <Button :disabled="state.loading" class="mx-auto">
              <Loader v-if="state.loading" class="mr-2 h-6 w-6 animate-spin" />
              Procesar
            </Button>
          </template>
        </FormKit>
        <Separator class="my-4" />

        <!-- informacion del archivo cargado -->
        <div v-if="nomina">
          <p>{{ totalAlumnos }}</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
