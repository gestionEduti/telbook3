// Note: Columns are where you define the core of what your table will look like.
// They define the data that will be displayed, how it will be formatted, sorted and filtered.

import type { ColumnDef } from '@tanstack/vue-table'
import DropdownAction from '@/components/ui/datatable/data-table-dropdown.vue'
import { h } from 'vue'
import type { Tables } from '@/types/supabase'
import { formatearFecha, formatearRut } from '@/lib/formato' // utilidades para formatear
import { capitalizarPalabras } from '@/lib/formato'

export const columns: ColumnDef<Tables<'mv_libro_matricula'>>[] = [
  // Accessor Columns
  {
    accessorKey: 'numero_matricula_alumno',
    header: () => h('div', { class: ' w-4 text-right' }, 'Nº'),
    cell: ({ row }) =>
      h('div', { class: ' w-4 text-right' }, row.getValue('numero_matricula_alumno')),
  },
  {
    accessorKey: 'rut_alumno',
    header: () => h('div', { class: 'text-center w-24' }, 'Rut'),
    cell: ({ row }) =>
      h('div', { class: '  w-24 text-xs text-right' }, formatearRut(row.getValue('rut_alumno'))),
  },
  {
    accessorKey: 'nombre_completo_alumno',
    header: () => h('div', { class: 'text-left w-full' }, 'Nombre Alumno'),
    cell: ({ row }) =>
      h(
        'div',
        {
          class: 'w-full text-md text-left ',
        },
        capitalizarPalabras(row.getValue('nombre_completo_alumno')),
      ),
  },
  {
    accessorKey: 'procedencia_alumno',
    header: () => h('div', { class: 'text-center min-w-18' }, 'Procedencia'),
    cell: ({ row }) =>
      h('div', { class: 'text-xs text-center  min-w-18' }, row.getValue('procedencia_alumno')),
  },
  {
    accessorKey: 'fecha_nacimiento_alumno',
    header: () => h('div', { class: 'text-center min-w-18' }, ' Fecha Nacimiento'),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-center  min-w-18' },
        formatearFecha(row.getValue('fecha_nacimiento_alumno')),
      ),
  },
  {
    accessorKey: 'fecha_incorporacion_alumno',
    header: () => h('div', { class: 'text-center min-w-18' }, 'Fecha Incorporación'),
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-center  min-w-18' },
        formatearFecha(row.getValue('fecha_incorporacion_alumno')),
      ),
  },
  {
    accessorKey: 'estado_alumno',
    header: () => h('div', { class: 'text-center  min-w-18' }, 'Estado'),
    cell: ({ row }) =>
      h('div', { class: 'text-xs text-center  min-w-18' }, row.getValue('estado_alumno')),
  },

  // Display Columns
  {
    id: 'actions',
    enableHiding: false,
    header: () => h('div', { class: 'text-center min-w-18' }, 'Acciones'),
    cell: ({ row }) => {
      const alumno = row.original
      return h('div', { class: 'relative text-center min-w-18' }, h(DropdownAction, { alumno }))
    },
  },

  // EJEMPLO DE DOCUMENTACION
  //
  // cell: ({ row }) => {
  //   const amount = Number.parseFloat(row.getValue('amount'))
  //   const formatted = new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //   }).format(amount)

  //   return h('div', { class: 'text-right ' }, formatted)
  // },
]
