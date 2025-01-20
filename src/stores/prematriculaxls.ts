import { supabase } from '@/services/supabaseClient'
import type { NominaAlumnoXLS } from '@/types/nomina'

// store
const authStore = useAuthStore()
const errorStore = useErrorStore()

export const usePrematriculaXlsStore = defineStore('prematriculaxls', () => {
  // state
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

  // actions

  /**
   * Esta funcion engloba el proceso de leer el archivo, parsearlo y guardarlo en el store.
   * - Setea el loading a true
   * - Llama a la funcion leerArchivo para obtener el contenido del archivo
   * - Llama a la funcion parsearXHTML para parsear el contenido del archivo
   * - Guarda el contenido en el store (state nomina)
   *
   * @param file El archivo que viene del formulario de FormKit
   */
  async function procesarArchivo(file: File) {
    loading.value = true

    try {
      const contenidoArchivo = await leerArchivo(file)
      if (!contenidoArchivo) return // si no hay archivo, termina
      nomina.value = parsearXHTML(contenidoArchivo as string) // Parsea el contenido
      if (!nomina.value) return // si no se pudo parsear, termina
    } catch (error) {
      console.error(error)
      errorStore.setError({ error: 'Error parseando XLS.' })
    } finally {
      loading.value = false
    }
  }

  /**
   * - Guarda el nombre del archivo en el store (contiene el nombre del establecimiento)
   * - Devuelve el contenido del archivo o null si no se pudo leer
   *
   * @param f El archivo que viene del formulario de FormKit
   * @returns El contenido del archivo o null si no se pudo leer
   */
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

  /**
   * - Parsea el contenido del archivo
   * - Extrae los headers de la tabla
   * - Procesa cada fila de la tabla
   * - Devuelve el resultado
   *
   * @param fileContent El contenido del archivo como string
   * @returns El resultado del parseo
   */
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

  /**
   * Inserta los alumnos en la base de datos
   */
  async function cargarAlumnos() {
    loading.value = true
    if (!nomina.value) return

    const { data, error, status } = await supabase.rpc('transaccion_prematricula', {
      rbd: rbdEstablecimiento.value,
      alumnos: nomina.value,
      usuario_ingreso: authStore.perfil!.rut_usuario,
    })

    if (error) {
      errorStore.setError({ error, customCode: status })
    } else {
      resultadoResumen.value = { cursos: data.cursos, alumnos: data.alumnos }
    }

    loading.value = false
  }

  /**
   * Reinicia el store
   */
  function reiniciarStore() {
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
