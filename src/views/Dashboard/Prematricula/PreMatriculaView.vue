<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button/Button.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { Loader } from 'lucide-vue-next'

import * as XLSX from 'xlsx'

const submitHandler = async (data) => {
  new Promise<void>((resolve, reject) => {
    const firstFile = data.license[0].file
    console.log(firstFile)
    const reader = new FileReader()
    reader.readAsArrayBuffer(firstFile)
    reader.onload = (event) => {
      // evento que se dispara cuando el archivo es leido correctamente
      if (!event.target) {
        // si no hay un evento, no hago nada
        reject(new Error('Error al leer el archivo'))
        return
      }
      const workbook = XLSX.read(event.target.result, {
        type: 'binary',
        cellText: false,
        cellDates: true,
      }) // creo un nuevo libro de excel
      const firstSheetName = workbook.SheetNames[0] // obtengo el nombre de la primera hoja
      const firstSheet = workbook.Sheets[firstSheetName] // obtengo la primera hoja
      const sheetData = XLSX.utils.sheet_to_json(firstSheet, { raw: false, dateNF: 'yyyymmdd' }) // convierto la data de la hoja en un arreglo de objetos
      console.log(sheetData)
      resolve()
    }
  })
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
        <FormKit id="licenseForm" type="form" @submit="submitHandler" :actions="false">
          <template #default="{ state }">
            <FormKit
              type="file"
              label="Nomina"
              name="license"
              help="Solo un archivo a la vez del tipo .xls"
              accept=".xls"
              validation="required"
            />
            <Button :disabled="state.loading" class="mx-auto">
              <Loader v-if="state.loading" class="mr-2 h-6 w-6 animate-spin" />
              Procesar
            </Button>
          </template>
        </FormKit>
      </CardContent>
    </Card>
  </div>
</template>

<style></style>
