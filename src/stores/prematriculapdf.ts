import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabaseClient'
import type { NominaAlumnoPDF } from '@/types/nomina'
import * as pdfjsLib from 'pdfjs-dist'

// store
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/error'
const authStore = useAuthStore()
const errorStore = useErrorStore()

export const usePrematriculaPdfStore = defineStore('prematriculapdf', () => {
  // pdf.js
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`

  // data
  const nomina = ref<NominaAlumnoPDF[] | null>(null)
  const loading = ref(false)
  const resultadoResumen = ref({ cursos: 0, alumnos: 0 })
  const establecimiento = ref()

  // getters
  const nombreEstablecimiento = computed(() => '')
  const totalAlumnos = computed(() => nomina.value?.length || 0)

  // methods
  async function procesarArchivo(file: File) {
    loading.value = true

    try {
      // Parsea el contenido según el tipo
      nomina.value = await parsearPDF(file)
      if (!nomina.value) return // si no se pudo parsear, termina
    } catch (error) {
      console.error('Error procesando archivo:', error)
    } finally {
      loading.value = false
    }
  }

  async function parsearPDF(file: File) {
    try {
      const arrayBuffer: ArrayBuffer = await file.arrayBuffer()
      const pdf: pdfjsLib.PDFDocumentProxy = await pdfjsLib.getDocument(arrayBuffer).promise
      const page: pdfjsLib.PDFPageProxy = await pdf.getPage(1)
      const textContent = await page.getTextContent()

      // Obtener el texto manteniendo el orden y posición
      const textItems = textContent.items.map((item) => ({
        text: item.str as string,
        y: item.transform[5] as number, // Posición vertical
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
      const lineaNivel = lines.find((line) => line.trim().startsWith('Alumnos Nivel'))

      const regex = /(Nivel de Transición \d+|Nivel Medio Mayor).*?-(\b[A-Z]\b)/
      const match = lineaNivel?.match(regex)
      const curso = match?.[1].includes('Nivel de Transición 1')
        ? '1NT'
        : match?.[1].includes('Nivel de Transición 2')
          ? '2NT'
          : 'MM'
      const letra = match?.[2]

      const estudiantesData: NominaAlumnoPDF[] = []

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
      return estudiantesData
    } catch (error) {
      console.error(error)
      errorStore.setError({
        error: 'Error al procesar el PDF. Por favor, intente con otro archivo.',
      })
      alert('Error al procesar el PDF. Por favor, intente con otro archivo.')
    }
  }

  function separarNombre(nombreCompleto: string) {
    const palabras = nombreCompleto.split(' ').filter((word) => word.length > 0)
    const apellidos = palabras.slice(0, 2).join(' ')
    const nombres = palabras.slice(2).join(' ')

    return {
      nombreCompleto,
      apellidos,
      nombres,
    }
  }

  // SUPABASE
  async function cargarAlumnos() {
    loading.value = true
    if (!nomina.value) return
    for (const alumno of nomina.value) {
      const { error, status } = await queryMatricularAlumno(alumno)
      if (error) errorStore.setError({ error, customCode: status })
    }
    loading.value = false
  }

  async function queryMatricularAlumno(alumno: NominaAlumnoPDF) {
    return supabase.rpc('transaccion_prematricula_pdf', {
      v_anio: 2025, // TODO cambiar a año sacado desde la futura tabla de configuraciones
      v_letra: alumno.letra,
      v_nivel: alumno.curso,
      v_nombre_completo: alumno.nombreCompleto,
      v_rbd: establecimiento.value, // TODO: pide string pero es integer
      v_rut_alumno: alumno.rut,
      v_rut_usuario: authStore.perfil!.rut_usuario,
    })
  }

  function reiniciarStore() {
    nomina.value = null
    loading.value = false
    resultadoResumen.value = { cursos: 0, alumnos: 0 }
  }

  return {
    // data
    nomina,
    loading,
    resultadoResumen,
    establecimiento,

    // getters
    nombreEstablecimiento,
    totalAlumnos,

    // methods
    procesarArchivo,
    reiniciarStore,
    cargarAlumnos,
  }
})

// make sure to pass the right store definition, `usePrematriculaPdfStore` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePrematriculaPdfStore, import.meta.hot))
}
