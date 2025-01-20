<script setup lang="ts">
import InfoMensajeSinData from '@/components/InfoMensajeSinData.vue'

// utils
// import { formatearFechaPlanificacionLargoPlazo } from '@/lib/formato'

// data
// const planificaciones = [
//   {
//     id: 1,
//     fecha: 20240708,
//     descripcion: 'Inicio segundo Semestre Lectivo 2024',
//   },
//   {
//     id: 2,
//     fecha: 20240708,
//     descripcion:
//       'Proyecto eje central mensual: “Estados climatológicos de mi planeta tierra” Temas: - Estaciones del año (clima). - Alimentos y estaciones. - Vestuario y estaciones. - Meses del año y días de la semana.',
//   },
//   {
//     id: 3,
//     fecha: 20240711,
//     descripcion: 'Día del Niño y la niña; actividad recreativa.',
//   },
//   {
//     id: 4,
//     fecha: 20240712,
//     descripcion: 'Inicio de ensayos bailes folclóricos.',
//   },
//   {
//     id: 5,
//     fecha: 20240715,
//     descripcion: 'Inicio Evaluación Pedagógica semestral',
//   },
//   {
//     id: 6,
//     fecha: 20240719,
//     descripcion: 'Finalización Evaluación semestral.',
//   },
//   {
//     id: 7,
//     fecha: 20240722,
//     descripcion: 'Inicio Informes semestrales',
//   },
//   {
//     id: 8,
//     fecha: 20240726,
//     descripcion: 'Finalización Informes semestrales',
//   },
//   {
//     id: 9,
//     fecha: 20240729,
//     descripcion: 'Toma Rezagados de Evaluación semestral',
//   },
//   {
//     id: 10,
//     fecha: 20240805,
//     descripcion:
//       'Proyecto eje central mensual: “Viajando en los transportes por mi país” Temas: - Identifico mi país. - Conozco los medios de transporte (terrestres, marinos, aéreos, espaciales) - Identificar territorios chilenos. - Viajando en los medios de transporte.',
//   },
//   {
//     id: 11,
//     fecha: 20240808,
//     descripcion: 'Reunión de Apoderados; entrega de pruebas semestrales y vestimenta folclórica',
//   },
//   {
//     id: 12,
//     fecha: 20240902,
//     descripcion:
//       'Proyecto eje central mensual: “Soy chileno, tikitikiti” Temas: - Identifico símbolos patrios. - Identifico bailes típicos y sus vestimentas. - Identifico costumbres típicas (alimentos y juegos). - Identifico flora y fauna de mi país.',
//   },
//   {
//     id: 13,
//     fecha: 20240910,
//     descripcion: 'Acto Folclórico (buscar recinto: gimnasio, junta vecinal, templo betesda u otro)',
//   },
//   {
//     id: 14,
//     fecha: 20240916,
//     descripcion: 'Inicio Vacaciones de fiestas patrias',
//   },
//   {
//     id: 15,
//     fecha: 20240923,
//     descripcion: 'Conmemoración Llegada de la Primavera',
//   },
//   {
//     id: 16,
//     fecha: 20241001,
//     descripcion:
//       'Proyecto eje central mensual: “Conociendo el mundo animal” Temas: - Animales y su hábitat. - Tipo de reproducción. - Respeto por los animales.',
//   },
//   {
//     id: 17,
//     fecha: 20241001,
//     descripcion: 'Reunión técnico pedagógico',
//   },
//   {
//     id: 18,
//     fecha: 20241003,
//     descripcion: 'Reunión de Apoderados',
//   },
//   {
//     id: 19,
//     fecha: 20241011,
//     descripcion: 'Conmemoración de efeméride: “Encuentro de dos Mundos”',
//   },
//   {
//     id: 20,
//     fecha: 20241014,
//     descripcion: 'Semana de Aniversario Escuela (Tema: Animales o hábitat)',
//   },
//   {
//     id: 21,
//     fecha: 20241016,
//     descripcion: 'Día del Profesor',
//   },
//   {
//     id: 22,
//     fecha: 20241030,
//     descripcion: 'Reunión técnico pedagógica',
//   },
//   {
//     id: 23,
//     fecha: 20241104,
//     descripcion:
//       'Proyecto eje central mensual: “El mundo del color y las formas” Temas: - Figuras y cuerpos geométricos. - Los colores y el arte de pintar. - El arte de crear con nuestras manos. - El arte de bailar (preparación acto navideño).',
//   },
//   {
//     id: 24,
//     fecha: 20241120,
//     descripcion: 'Día de los derechos de los niños y niñas',
//   },
//   {
//     id: 25,
//     fecha: 20241127,
//     descripcion: 'Reunión técnica pedagógica.',
//   },
//   {
//     id: 26,
//     fecha: 20241129,
//     descripcion: 'Cierre de Proyecto',
//   },
//   {
//     id: 27,
//     fecha: 20241202,
//     descripcion:
//       'Proyecto eje central mensual: “Navidad” Temas: - Preparación baile navideño. - Manualidades navideñas.',
//   },
//   {
//     id: 28,
//     fecha: 20241205,
//     descripcion: 'Reunión padres y apoderados',
//   },
//   {
//     id: 29,
//     fecha: 20241216,
//     descripcion: 'Ultimo día de clases normales.',
//   },
//   {
//     id: 30,
//     fecha: 20241217,
//     descripcion: 'Acto Navidad, entrega de regalo y diploma cursos PG – MM – PK',
//   },
//   {
//     id: 31,
//     fecha: 20241218,
//     descripcion: 'Fiesta de navidad (regalos; visita de Santa)',
//   },
//   {
//     id: 32,
//     fecha: 20241219,
//     descripcion: 'Graduaciones kínder (sujeta a cambios)',
//   },
// ]

// const meses = [
//   {
//     numero: 1,
//     nombre: 'Enero',
//   },
//   {
//     numero: 2,
//     nombre: 'Febrero',
//   },
//   {
//     numero: 3,
//     nombre: 'Marzo',
//   },
//   {
//     numero: 4,
//     nombre: 'Abril',
//   },
//   {
//     numero: 5,
//     nombre: 'Mayo',
//   },
//   {
//     numero: 6,
//     nombre: 'Junio',
//   },
//   {
//     numero: 7,
//     nombre: 'Julio',
//   },
//   {
//     numero: 8,
//     nombre: 'Agosto',
//   },
//   {
//     numero: 9,
//     nombre: 'Septiembre',
//   },
//   {
//     numero: 10,
//     nombre: 'Octubre',
//   },
//   {
//     numero: 11,
//     nombre: 'Noviembre',
//   },
//   {
//     numero: 12,
//     nombre: 'Diciembre',
//   },
// ]

// methods

// const planificacionesPorMes = (mes: number) => {
//   return planificaciones.filter((planificacion) => {
//     const fecha = planificacion.fecha.toString()
//     return parseInt(fecha.substring(4, 6)) === mes
//   })
// }
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-end justify-between">
        <span> Planificacion largo plazo </span>
        <!-- <div class="space-x-2">
          <Button variant="secondary">
            <Download />
            <span> Descargar reporte </span>
          </Button>
          <Button>
            <CalendarPlus2 />
            <span> Crear planificacion </span>
          </Button>
        </div> -->
      </CardTitle>
      <CardDescription
        >Crea ó visualiza las planificaciones a largo plazo del establecimiento.
      </CardDescription>
      <Separator />
    </CardHeader>
    <CardContent>
      <CardContent>
        <InfoMensajeSinData icono="mantencion" mensaje="En mantención" />
      </CardContent>
      <!-- <ul class="space-y-8">
        <template v-for="mes in meses" :key="mes.numero">
          <Card v-if="planificacionesPorMes(mes.numero).length">
            <CardHeader>
              <CardTitle>
                <span>{{ mes.nombre }}</span>
              </CardTitle>
              <CardDescription>
                {{ planificacionesPorMes(mes.numero).length }} planificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <li>
                <Table>
                  <TableBody>
                    <TableRow
                      v-for="planificacion in planificacionesPorMes(mes.numero)"
                      :key="planificacion.id"
                      class="group h-20"
                    >
                      <TableCell class="w-32 capitalize">
                        {{ formatearFechaPlanificacionLargoPlazo(planificacion.fecha) }}
                      </TableCell>
                      <TableCell>{{ planificacion.descripcion }}</TableCell>
                      <TableCell>
                        <Button variant="destructive" class="hidden group-hover:flex">
                          <Trash2 />
                          <span>Eliminar</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </li>
            </CardContent>
          </Card>
        </template>
      </ul> -->
    </CardContent>
  </Card>
</template>

<style></style>
