import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabaseClient'
import type { NominaAlumnoInterface } from '@/types/nomina'

// store
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from './error'
const authStore = useAuthStore()
const errorStore = useErrorStore()

export const usePrematriculaStore = defineStore('prematricula', () => {
  // data
  const nomina = ref<NominaAlumnoInterface[] | null>(null)
  const nombreArchivo = ref<string | null>(null)
  const loading = ref(false)

  // getters
  const rbdEstablecimiento = computed(() => nomina.value?.[0]?.RBD || '')
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
  async function procesarArchivo(f: File) {
    loading.value = true
    const contenidoArchivo = await leerArchivo(f) // lee el archivo
    if (!contenidoArchivo) return // si no hay archivo, termina
    nomina.value = await parsearXHTML(contenidoArchivo) // actualiza el estado
    if (!nomina.value) return // si no se pudo parsear, termina
    // await new Promise((resolve) => setTimeout(resolve, 800)
    loading.value = false
  }

  async function cargarAlumnos() {
    loading.value = true
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    if (!nomina.value) return
    for (const alumno of nomina.value) {
      const { error, status } = await queryMatricularAlumno(alumno)
      if (error) {
        errorStore.setError({ error: error, customCode: status })
        return
      }
    }
    loading.value = false
  }

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

  function parsearXHTML(fileContent: string): NominaAlumnoInterface[] {
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
    const result: NominaAlumnoInterface[] = rows.map((row: HTMLTableRowElement) => {
      const cells: HTMLTableCellElement[] = Array.from(row.querySelectorAll('td'))
      const rowData = {} as NominaAlumnoInterface
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

  async function queryMatricularAlumno(alumno: NominaAlumnoInterface) {
    return supabase.rpc('gestionar_alumnos_pre_matricula', {
      v_anio: 2025, // TODO cambiar a año sacado desde la futura tabla de configuraciones
      v_apellido_materno: alumno['Apellido Materno'],
      v_apellido_paterno: alumno['Apellido Paterno'],
      v_comuna: alumno['Comuna Residencia'],
      v_descripcion_nivel: alumno['Desc Grado'],
      v_direccion_alumno: alumno.Dirección,
      v_email: alumno.Email,
      v_fecha_incorporacion_escuela: alumno['Fecha Incorporación Curso'],
      v_fecha_nacimiento: alumno['Fecha Nacimiento'],
      v_fecha_retiro_escuela: alumno['Fecha Retiro'],
      v_genero: alumno.Genero,
      v_letra_nivel: alumno['Letra Curso'],
      v_nombres_alumno: alumno.Nombres,
      v_rbd: alumno.RBD,
      v_rut_alumno: `${alumno.Run}-${alumno['Dígito Ver.']}`,
      v_rut_usuario: authStore.perfil!.rut_usuario,
      v_telefono: alumno.Telefono,
    })
  }

  async function reiniciarStore() {
    nomina.value = null
    nombreArchivo.value = null
    loading.value = false
  }

  async function obtenerResumen() {
    // select accion, count(*)
    // from log_prematricula
    // where rbd = 26523
    // group by accion
  }

  return {
    // data
    nomina,
    loading,

    // getters
    rbdEstablecimiento,
    nombreEstablecimiento,
    totalAlumnos,
    totalCursos,

    // methods
    procesarArchivo,
    cargarAlumnos,
    reiniciarStore,
    obtenerResumen,
  }
})

// make sure to pass the right store definition, `usePrematriculaStore` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePrematriculaStore, import.meta.hot))
}
