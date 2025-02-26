<!--
Tip:
If you find yourself using <DataTable /> in multiple places,
this is the component you could make reusable by extracting it to components/ui/data-table.vue.
-->

<script setup lang="ts" generic="TData, TValue">
import { ref, watch } from 'vue'

import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'

import { valueUpdater } from '@/lib/utils'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
  },
})

// custom sorting
const selectedSortColumn = ref<string | null>(null) // columna seleccionada en el Select
watch(selectedSortColumn, (newValue) => {
  if (newValue) {
    const column = table.getColumn(newValue)
    if (column) {
      column.toggleSorting(column.getIsSorted() === 'asc')
    }
  }
})

// custom filtering
const selectedSortOption = ref<string>('numero_matricula_alumno:desc') // opción seleccionada en el Select
watch(selectedSortOption, (newValue) => {
  if (newValue) {
    const [columnId, direction] = newValue.split(':')
    const column = table.getColumn(columnId)
    if (column) {
      column.toggleSorting(direction === 'asc')
    }
  }
})
</script>

<template>
  <div>
    <!-- filtro y ordenamiento-->
    <div class="grid grid-cols-6 gap-4 pb-2 pt-4">
      <!-- filtro -->
      <Label for="matriculas-filtro-alumnos" class="col-span-2 col-start-1 flex flex-col space-y-1">
        <span class="telbook-label">Filtrar</span>
        <Input
          class="max-w-sm"
          placeholder="Filtrar apellidos..."
          :model-value="table.getColumn('nombre_completo_alumno')?.getFilterValue() as string"
          @update:model-value="table.getColumn('nombre_completo_alumno')?.setFilterValue($event)"
        />
      </Label>

      <!-- ordenamiento -->
      <Label for="matriculas-filtro-alumnos" class="col-span-2 col-start-5 flex flex-col space-y-1">
        <span class="telbook-label">Ordenar por</span>
        <div class="flex items-center space-x-2">
          <Select v-model="selectedSortOption">
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un criterio" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="numero_matricula_alumno:desc">
                  Nº Matricula Ascendente
                </SelectItem>
                <SelectItem value="numero_matricula_alumno:asc">
                  Nº Matricula Descendente
                </SelectItem>
                <SelectItem value="rut_alumno:desc"> Rut Ascendente </SelectItem>
                <SelectItem value="rut_alumno:asc"> Rut Descendente </SelectItem>
                <SelectItem value="nombre_completo_alumno:desc"> Nombres Ascendente </SelectItem>
                <SelectItem value="nombre_completo_alumno:asc"> Nombres Descendente </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Label>
    </div>

    <!-- tabla -->
    <Table class="border border-slate-300 bg-white">
      <TableHeader class="bg-slate-100">
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id" class="p-2">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="p-2">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center"> No results. </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>

  <!-- paginacion -->
  <div class="flex items-center justify-end space-x-2 py-4">
    <div class="flex-1 text-sm text-muted-foreground">
      {{ table.getFilteredRowModel().rows.length }} alumnos
    </div>
    <Button size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
      Anterior
    </Button>
    <Button size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
      Siguiente
    </Button>
  </div>
</template>
