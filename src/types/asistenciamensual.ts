/**
 * Esta interfaz representa lo que devuelte la funcion 'resumen_asistencia_mes' de supabase.
 * El objeto representa la asistencia del mes/año/curso especificado.
 * El objeto tiene un key por cada rut de los alumnos de la asistencia,...
 *   ...y cada uno es un objeto con 31 keys correspondiente a los dias del mes.
 *   A su vez cada dia del mes tiene un null, 0, ó 1, que corresponden a:
 *     'no tiene asistencia', 'ausente', 'presente'.
 * Si un alumno no esta en la asistencia (fue matriculado y aun no existe en ninguna pasada de lista),
 *   este rut no aparecera en la data que viene de la funcion 'resumen_asistencia_mes'.
 */
export interface AsistenciasMes {
  [rut: string]: {
    [dia: string]: number
  }
}
