import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabaseClient'
import type { NominaAlumnoXLS } from '@/types/nomina'

// store
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

export const usePrematriculaXlsStore = defineStore('prematriculaxls', () => {
  // data
  const nomina = ref<NominaAlumnoXLS[] | null>(null)
  const nombreArchivo = ref<string | null>(null)
  const loading = ref(false)
  const resultadoResumen = ref({ cursos: 0, alumnos: 0 })

  // getters
  const rbdEstablecimiento = computed(() => nomina.value?.[0]?.RBD || 0)
  const nombreEstablecimiento = computed(() =>
    !nombreArchivo.value
      ? ''
      : nombreArchivo.value.match(/SIGE (.*?)(\.xls)/)?.[1].toLowerCase() || '',
  )
  const totalAlumnos = computed(() => nomina.value?.length || 0)
  const totalCursos = computed(
    () =>
      Array.from(
        new Set(nomina.value?.map((alumno) => alumno['Desc Grado'] + alumno['Letra Curso'])),
      ).length || 0,
  )

  // methods
  async function procesarArchivo(file: File) {
    loading.value = true

    try {
      // Lee el archivo según el tipo
      const contenidoArchivo = await leerArchivo(file)
      if (!contenidoArchivo) return // si no hay archivo, termina

      // Parsea el contenido
      nomina.value = parsearXHTML(contenidoArchivo as string)
      if (!nomina.value) return // si no se pudo parsear, termina
    } catch (error) {
      console.error('Error procesando archivo:', error)
    } finally {
      loading.value = false
    }
  }

  // XLS
  async function leerArchivo(f: File): Promise<string | null> {
    nombreArchivo.value = f.name
    return new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsText(f, 'ISO-8859-1')
      reader.onload = (event) => {
        const text = event.target?.result as string
        if (!text) reject(null)
        resolve(text)
      }
      reader.onerror = () => reject(null)
    })
  }

  function parsearXHTML(fileContent: string): NominaAlumnoXLS[] {
    // Creo un parseador
    const parser = new DOMParser()

    // Parseo el contenido del archivo
    const xhtml = parser.parseFromString(fileContent, 'application/xhtml+xml')

    // Extraigo los nodos que corresponden a las filas de la tabla
    const rows: HTMLTableRowElement[] = Array.from(xhtml.querySelectorAll('table tr'))

    // Separo la primera fila que corresponde a los headers
    const headerRow = rows.shift()
    if (!headerRow) {
      throw new Error('El documento no es valido. No tiene la primera columna de headers.')
    }

    // Extraigo los headers de la tabla
    const nodes: NodeListOf<HTMLTableCellElement> = headerRow.querySelectorAll('th, td')
    const nodesArray: HTMLTableCellElement[] = Array.from(nodes)
    const headers: string[] = nodesArray.map((cell) => cell.textContent?.trim() || '')

    // Procesa cada fila de la tabla
    const result: NominaAlumnoXLS[] = rows.map((row: HTMLTableRowElement) => {
      const cells: HTMLTableCellElement[] = Array.from(row.querySelectorAll('td'))
      const rowData = {} as NominaAlumnoXLS
      headers.forEach((header: string, index: number) => {
        // TODO revisar si lo puedo arreglar con buenas practicas de TS luego
        // @ts-expect-error debido a que ts espera que tenga un header valido de la interfaz, pero no lo puedo asegurar por ahroa
        rowData[header] = cells[index]?.textContent?.trim() || null
      })
      return rowData
    })

    // Devuelvo el resultado
    return result
  }

  // SUPABASE
  async function cargarAlumnos() {
    loading.value = true
    if (!nomina.value) return
    await queryMatricularAlumno()
    loading.value = false
  }

  async function queryMatricularAlumno() {
    return supabase.rpc('transaccion_prematricula', {
      rbd: rbdEstablecimiento.value,
      alumnos: nomina.value,
      usuario_ingreso: authStore.perfil!.rut_usuario,
    })
  }

  async function reiniciarStore() {
    nomina.value = null
    nombreArchivo.value = null
    loading.value = false
    resultadoResumen.value = { cursos: 0, alumnos: 0 }
  }

  return {
    // data
    nomina,
    loading,
    resultadoResumen,

    // getters
    rbdEstablecimiento,
    nombreEstablecimiento,
    totalAlumnos,
    totalCursos,

    // methods
    procesarArchivo,
    cargarAlumnos,
    reiniciarStore,
  }
})

// make sure to pass the right store definition, `usePrematriculaXlsStore` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePrematriculaXlsStore, import.meta.hot))
}
