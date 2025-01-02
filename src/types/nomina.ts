// Representa el objeto que genera Formkit al hacer submit del form.
export interface FormKitFormData {
  license: License[]
  __init: boolean
}

// Reprensenta el objeto dentro del array en FormData.license.
// Es un objeto que contiene el nombre de del archivo, y el archivo en si.
interface License {
  name: string
  file: File
}

// Representa la estructura de la nomina de alumnos.
// Refleja las columnas del excel.
// Las que estan comentadas no son relevantes.
// Estan en el mismo orden de las columnas del excel.
export interface NominaAlumnoStatic {
  Año: number
  RBD: number
  // 'Cod Tipo Enseñanza': string // no aplica
  // 'Cod Grado': string // no aplica
  'Desc Grado': string // curso
  'Letra Curso': string // curso
  Run: string
  'Dígito Ver.': string
  Genero: string
  Nombres: string
  'Apellido Paterno': string
  'Apellido Materno': string
  Dirección: string
  'Comuna Residencia': string
  // 'Código Comuna Residencia': string // no aplica
  Email: string
  Telefono: string
  Celular: string
  'Fecha Nacimiento': string
  // 'Código Etnia': string // no aplica
  'Fecha Incorporación Curso': string
  'Fecha Retiro': string
  // '%Asistenca': string // no aplica
  // 'Promedio Final': string // no aplica
  [key: string]: string | number
}

export type NominaAlumnoInterface = NominaAlumnoStatic & Record<string, string | null>

// anio_libro integer null,
// rbd_establecimiento integer null,
// apellidos_alumno character varying(255) null,
// apoderado_tutor_alumno character varying(255) null,
// causa_retiro_alumno character varying(255) null,
// codigo_estado_alumno integer null,
// comuna_alumno character varying(255) null,
// created_at timestamp with time zone null,
// domicilio_alumno character varying(255) null,
// email_apoderado_alumno character varying(255) null,
// estado_alumno character varying(255) null,
// fecha_incorporacion_alumno date null,
// fecha_nacimiento_alumno date not null,
// fecha_retiro_escuela date null,
// id serial not null,
// jornada_alumno character varying(255) null,
// nacionalidad_alumno character varying(255) null,
// nivel_alumno character varying(255) null,
// nivel_educacional_madre character varying(255) null,
// nivel_educacional_padre character varying(255) null,
// nombre_apoderado_alumno character varying(255) null,
// nombre_completo_alumno character varying(255) null,
// nombres_alumno character varying(255) null,
// numero_lista_nivel_alumno integer null,
// numero_matricula_alumno integer null,
// parentezco_con_alumno character varying(255) null,
// problema_aprendizaje_alumno character varying(255) null,
// procedencia_alumno character varying(255) null,
// pueblo_originario_alumno character varying(255) null,
// region_alumno character varying(255) null,
// rut_alumno character varying(255) null,
// rut_profesor_alumno character varying(255) null,
// sexo_alumno character varying(255) null,
// situacion_social_alumno character varying(255) null,
// telefono_apoderado_alumno character varying(255) null,
// tipo_tel_alumno character varying(255) null,
// vive_con_alumno character varying(255) null,
