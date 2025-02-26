<script setup lang="ts">
import { columns } from '@/components/views/Matriculas/columns'

// jsPDF
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// xlsx
import * as XLSX from 'xlsx'

import { Download, UserPlus, FileText, ListX, ChevronDown, FileSpreadsheet } from 'lucide-vue-next'
import { formatearFecha } from '@/lib/formato' // iconos

const authStore = useAuthStore()
const matriculasStore = useMatriculasStore()
const { alumnos } = storeToRefs(matriculasStore)

matriculasStore.fetchAlumnos()

/**
 * Exporta el resumen de matriculas en formato PDF
 */
async function exportarResumen() {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text('Resumen', 14, 15)
  doc.setFontSize(11)
  doc.text(`Establecimiento: ${authStore.establecimiento?.razon_social}`, 14, 25)
  doc.text(`RBD: ${authStore.establecimiento?.rbd}`, 14, 32)
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 39)
  doc.text(`Total de registros: ${alumnos.value?.length}`, 14, 46)

  const tableData = alumnos.value!.map((alumno) => [
    alumno.numero_matricula_alumno,
    alumno.rut_alumno,
    alumno.nombre_completo_alumno,
    alumno.procedencia_alumno,
    alumno.fecha_nacimiento_alumno,
    alumno.fecha_incorporacion_alumno,
    alumno.estado_alumno,
    alumno.fecha_retiro_escuela,
  ])

  const headers = [
    [
      'Nº',
      'Rut',
      'Nombre',
      'Procedencia',
      'Fecha Nacimiento',
      'Fecha Incorporación',
      'Estado',
      'Fecha Retiro',
    ],
  ]

  autoTable(doc, {
    head: headers,
    body: tableData,
    startY: 50,
    margin: { top: 10 },
    styles: { fontSize: 8, cellPadding: 2 },
  })

  doc.save('resumen.pdf')
}
// JPS computed que guarda solo los perfiles permitidos para registrar alumno
const puedeRegistrarAlumno = computed(() => {
  const perfilesPermitidos = [1, 2, 4]
  return perfilesPermitidos.includes(authStore.perfil?.codigo_perfil_usuario ?? -1)
})

/**
 * Exporta el libro de matriculas completo en formato Excel
 */
function exportarCompleto() {
  const datosExcel = alumnos.value?.map((alumno) => ({
    Año: alumno.anio_libro,
    RBD: alumno.rbd_establecimiento,
    'Rut Alumno': alumno.rut_alumno,
    'Apellidos Alumno': alumno.apellidos_alumno,
    'Nombres Alumno': alumno.nombres_alumno,
    'Fecha de Nacimiento': formatearFecha(alumno.fecha_nacimiento_alumno),
    'Sexo Alumno': alumno.sexo_alumno,
    'Número Matricula': alumno.numero_matricula_alumno,
    'Nivel Alumno': alumno.nivel_alumno,
    Jornada: alumno.jornada_alumno,
    'Numero de Lista': alumno.numero_lista_nivel_alumno,
    Procedencia: alumno.procedencia_alumno,
    'Fecha Incorporación': formatearFecha(alumno.fecha_incorporacion_alumno),
    'Código Alumno': alumno.codigo_estado_alumno,
    Estado: alumno.estado_alumno,
    'Fecha Retiro': formatearFecha(alumno.fecha_retiro_escuela),
    'Causa Retiro': alumno.causa_retiro_alumno,
    Domicilio: alumno.domicilio_alumno,
    Comuna: alumno.comuna_alumno,
    Región: alumno.region_alumno,
    Nacionalidad: alumno.nacionalidad_alumno,
    'PertenecePueblo Originario': alumno.pueblo_originario_alumno,
    'Problema Aprendizaje': alumno.problema_aprendizaje_alumno,
    'Tipo TEL': alumno.tipo_tel_alumno,
    'Nombre Apoderado': alumno.nombre_apoderado_alumno,
    'Parentezco con Alumno': alumno.parentezco_con_alumno,
    'Vive Con': alumno.vive_con_alumno,
    'Nivel Educacional Madre': alumno.nivel_educacional_madre,
    'Nivel Educacional Padre': alumno.nivel_educacional_padre,
    Email: alumno.email_apoderado_alumno,
    'Teléfono Apoderado': alumno.telefono_apoderado_alumno,
    'Situación Social': alumno.situacion_social_alumno,
  }))

  const libro = XLSX.utils.book_new()
  const hoja = XLSX.utils.json_to_sheet(datosExcel)
  XLSX.utils.book_append_sheet(libro, hoja, 'Libro de Matriculas')
  const nombreArchivo = `Libro_Matriculas_RBD_${authStore.establecimiento?.rbd || 'Desconocido'}.xlsx`
  XLSX.writeFile(libro, nombreArchivo)
}
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <Transition name="fade" mode="out-in">
      <Card v-if="alumnos">
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span> Matriculas </span>
            <div class="flex items-center space-x-2">
              <Button
                :disabled="!puedeRegistrarAlumno"
                @click="$router.push('/dashboard/matriculas/nueva')"
              >
                <UserPlus class="h-4 w-4" />
                <span class="ml-2 hidden md:block">Nuevo alumno</span>
              </Button>
              <DropdownMenu v-if="alumnos.length">
                <DropdownMenuTrigger as-child>
                  <Button variant="outline">
                    <Download class="h-4 w-4" />
                    <span class="ml-2 hidden md:block">Descargar</span>
                    <ChevronDown class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-56">
                  <DropdownMenuLabel>Descargar Libro</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem @click="exportarCompleto">
                      <FileSpreadsheet class="h-4 w-4" />
                      <span class="ml-2 hidden md:block">Libro completo (Excel)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="exportarResumen">
                      <FileText class="h-4 w-4" />
                      <span class="ml-2 hidden md:block">Resumen (PDF)</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
          <CardDescription>Lista de matriculas del establecimiento.</CardDescription>
          <Separator />
        </CardHeader>
        <CardContent v-if="alumnos?.length">
          <ResumenMatriculas
            :total-matriculas="alumnos.length"
            :total-activos="alumnos.filter((a) => a.codigo_estado_alumno == 1).length"
            :total-retirados="alumnos.filter((a) => a.codigo_estado_alumno == 0).length"
          />
          <Separator class="mb-2 mt-6" />

          <!-- tabla -->
          <DataTable :columns="columns" :data="alumnos" />
        </CardContent>
        <CardContent v-else>
          <!-- TODO: extraer a un componente de cuando no hay resultados -->
          <div class="flex flex-col items-center justify-center space-y-2 py-8">
            <ListX :size="32" class="text-gray-500" />
            <p class="text-muted-foreground">No hay alumnos matriculados.</p>
          </div>
        </CardContent>
      </Card>
    </Transition>
  </div>
</template>
