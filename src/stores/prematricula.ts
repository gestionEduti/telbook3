import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabaseClient'
import type { NominaAlumnoInterface } from '@/types/nomina'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

export const usePrematriculaStore = defineStore('prematricula', () => {
  // data
  const nomina = ref<NominaAlumnoInterface[] | null>(null)

  // getters
  const totalAlumnos = computed(() => nomina.value?.length || 0)

  // methods
  async function procesarNomina(f: File) {
    const contenidoArchivo = await leerArchivo(f) // lee el archivo
    if (!contenidoArchivo) return
    nomina.value = await parsearXHTML(contenidoArchivo) // actualiza el estado
    if (!nomina.value) return
    await procesarTodosLosAlumnos(nomina.value)
  }

  async function leerArchivo(f: File): Promise<string | null> {
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
    const rows = Array.from(xhtml.querySelectorAll('table tr'))

    // Separo la primera fila que corresponde a los headers
    const headerRow = rows.shift()
    if (!headerRow) return

    // Extraigo los headers de la tabla
    const headers = Array.from(headerRow.querySelectorAll('th, td')).map((cell) =>
      cell.textContent.trim(),
    )

    // Procesa cada fila de la tabla
    const result = rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('td'))
      const rowData = {}
      headers.forEach((header, index) => {
        rowData[header] = cells[index]?.textContent.trim() || null // Match cells with headers
      })
      return rowData
    })

    // Devuelvo el resultado
    return result as NominaAlumnoInterface[]
  }

  async function procesarTodosLosAlumnos(alumnos: NominaAlumnoInterface[]) {
    for (const alumno of alumnos) {
      // await queryMatricularAlumno(alumno)
      console.log(alumno)
    }
  }

  async function queryMatricularAlumno(alumno: NominaAlumnoInterface) {
    const { data, error } = await supabase.rpc('gestionar_alumnos_pre_matricula', {
      v_anio: alumno.Año,
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
      v_rut_alumno: alumno.Run,
      v_rut_usuario: authStore.perfil!.rut_usuario,
      v_telefono: alumno.Telefono,
    })
    return error || data
  }

  return {
    // data
    nomina,

    // getters
    totalAlumnos,

    // methods
    procesarNomina,
  }
})
