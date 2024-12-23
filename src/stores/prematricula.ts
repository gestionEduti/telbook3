import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import { supabase } from '@/services/supabaseClient'
import type { NominaAlumnoInterface } from '@/types/nomina'

const funcionProcesarAlumno = (alumno: NominaAlumnoInterface) =>
  supabase.rpc('gestionar_alumnos_pre_matricula', {
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
    v_rut_alumno: '', // completar con el rut del usuario autenticado
    v_rut_usuario: alumno.Run,
    v_telefono: alumno.Telefono,
  })

export const usePrematriculaStore = defineStore('prematricula', () => {
  // data
  const nomina = ref<NominaAlumnoInterface[] | null>(null)

  // getters
  const totalAlumnos = computed(() => nomina.value?.length || 0)

  // methods
  async function procesarExcel(f: File) {
    // extraigo la data del archivo excel mediante una promesa que se resuelve con la data extraida ó se rechaza con null
    const dataExtraida = await new Promise<NominaAlumnoInterface[] | null>((resolve, reject) => {
      // creo un nuevo lector de archivos
      const reader = new FileReader()

      // leo el archivo como un array buffer
      reader.readAsArrayBuffer(f)

      // onload se ejecuta cuando el archivo se ha leido
      // y se ha convertido en un array buffer
      reader.onload = (event) => {
        if (!event.target) {
          // si no hay un evento, rechazo la promesa
          reject(null)
          return
        }

        // creo un nuevo libro de excel
        const workbook = XLSX.read(event.target.result, {
          type: 'binary',
          cellText: false,
          cellDates: true,
        })

        // obtengo el nombre de la primera hoja
        const firstSheetName = workbook.SheetNames[0]

        // obtengo la primera hoja
        const firstSheet = workbook.Sheets[firstSheetName]

        // convierto la data de la hoja en un arreglo de objetos
        // cada objeto
        const sheetData = XLSX.utils.sheet_to_json(firstSheet, {}) as NominaAlumnoInterface[]

        // resuelvo la promesa con la data extraida
        resolve(sheetData)
      }
    })

    // si la data extraida es null, no hago nada
    if (!dataExtraida) return

    // si hay data, la almaceno en el state
    nomina.value = dataExtraida
  }

  async function procesarAlumnos() {
    if (nomina.value) {
      nomina.value.forEach(async (alumno) => {
        const { data, error } = await funcionProcesarAlumno(alumno)
        if (error) {
          console.error(error)
          return
        }
        console.log(data)
      })
    }
  }

  // PRUEBA DESARROLLO
  async function procesarUnAlumno() {
    if (nomina.value) {
      console.log(nomina.value[0].Año)
    }
  }

  return {
    // data
    nomina,

    // getters
    totalAlumnos,

    // methods
    procesarAlumnos,
    procesarExcel,
    procesarUnAlumno,
  }
})
