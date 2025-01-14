import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabaseClient'
import type { NominaAlumnoXLS, NominaAlumnoPDF } from '@/types/nomina'
import * as pdfjsLib from 'pdfjs-dist'

// store
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from './error'
const authStore = useAuthStore()
const errorStore = useErrorStore()

// pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`

export const usePrematriculaStore = defineStore('prematricula', () => {
  // data
  const nomina = ref<NominaAlumnoXLS[] | NominaAlumnoPDF[] | null>(null)
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
    const isPDF = file.name.toLowerCase().endsWith('.pdf')

    try {
      // Lee el archivo según el tipo
      const contenidoArchivo = isPDF ? await leerArchivoPDF(file) : await leerArchivoXLS(file)
      if (!contenidoArchivo) return // si no hay archivo, termina

      // Parsea el contenido según el tipo
      nomina.value = isPDF
        ? await parsearPDF(contenidoArchivo as ArrayBuffer)
        : parsearXHTML(contenidoArchivo as string)
      if (!nomina.value) return // si no se pudo parsear, termina
    } catch (error) {
      console.error('Error procesando archivo:', error)
    } finally {
      loading.value = false
    }
  }

  // PDF
  async function leerArchivoPDF(file: File) {
    return await file.arrayBuffer()
  }
  const parsearPDF = async (arrayBuffer: ArrayBuffer) => {
    try {
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
      const page = await pdf.getPage(1)
      const textContent = await page.getTextContent()

      // Obtener el texto manteniendo el orden y posición
      const textItems = textContent.items.map((item) => ({
        text: item.str,
        y: item.transform[5], // Posición vertical
      }))

      // Agrupar elementos por línea basado en su posición vertical
      const lineThreshold = 5 // Umbral para considerar elementos en la misma línea
      const lines = []
      let currentLine = []
      let lastY = null

      textItems.forEach((item) => {
        if (lastY === null || Math.abs(item.y - lastY) < lineThreshold) {
          currentLine.push(item.text)
        } else {
          if (currentLine.length > 0) {
            lines.push(currentLine.join(' '))
          }
          currentLine = [item.text]
        }
        lastY = item.y
      })
      if (currentLine.length > 0) {
        lines.push(currentLine.join(' '))
      }

      // Extraer y procesar el curso
      const cursoMatch = lines.find(
        (line) =>
          line.toUpperCase().includes('NIVEL') || line.toUpperCase().includes('MEDIO MAYOR'),
      )
      const cursoCompleto = cursoMatch || 'Segundo Nivel de Transición A'

      const { curso, letra } = procesarCursoYLetra(cursoCompleto)

      const estudiantesData = []

      // Procesar cada línea
      lines.forEach((line) => {
        const rutMatch = line.match(/\b\d{8}-[\dkK]\b/)
        if (rutMatch) {
          const rut = rutMatch[0]

          const nombreCompleto = line
            .substring(line.indexOf(rut) + rut.length)
            .trim()
            .split(/\b\d{8}-[\dkK]\b/)[0]
            .trim()
            .replace(/\d+/g, '')
            .trim()

          if (nombreCompleto) {
            const {
              nombreCompleto: nombreProcesado,
              apellidos,
              nombres,
            } = separarNombre(nombreCompleto)
            estudiantesData.push({
              rut,
              nombreCompleto: nombreProcesado,
              apellidos,
              nombres,
              curso,
              letra,
            })
          }
        }
      })

      console.log('Estudiantes procesados:', estudiantesData)
    } catch (error) {
      console.error('Error al procesar el PDF:', error)
      alert('Error al procesar el PDF. Por favor, intente con otro archivo.')
    }
  }

  const procesarCursoYLetra = (cursoTexto) => {
    // Mapa de niveles
    const nivelesEducacion = {
      'MEDIO MAYOR': 'Medio Mayor',
      'MEDIO MAYOR-': 'Medio Mayor',
      PRIMER: 'Primer Nivel de Transición',
      PRIMERO: 'Primer Nivel de Transición',
      1: 'Primer Nivel de Transición',
      SEGUNDO: 'Segundo Nivel de Transición',
      'TRANSICION 2': 'Segundo Nivel de Transición',
      2: 'Segundo Nivel de Transición',
    }

    // Normalizar el texto para la búsqueda
    const textoNormalizado = cursoTexto.toUpperCase()

    let curso = 'Medio Mayor' // valor por defecto
    let letra = 'A' // valor por defecto

    // Buscar el nivel en el texto
    for (const [clave, valor] of Object.entries(nivelesEducacion)) {
      if (textoNormalizado.includes(clave)) {
        curso = valor
        break
      }
    }

    // Buscar la letra (A, B, C, etc.)
    const letraMatch = textoNormalizado.match(/[- ]([A-Z])(?:\s|$)/)
    if (letraMatch) {
      letra = letraMatch[1]
    }

    return { curso, letra }
  }

  const separarNombre = (nombreCompleto) => {
    const palabras = nombreCompleto.split(' ').filter((word) => word.length > 0)
    const apellidos = palabras.slice(0, 2).join(' ')
    const nombres = palabras.slice(2).join(' ')

    return {
      nombreCompleto,
      apellidos,
      nombres,
    }
  }
})

// make sure to pass the right store definition, `usePrematriculaStore` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePrematriculaStore, import.meta.hot))
}
