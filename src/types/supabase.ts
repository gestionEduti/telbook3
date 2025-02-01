export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alumnos_2024: {
        Row: {
          anio: number | null
          apellidos_alumno: string | null
          apoderado_tutor_alumno: string | null
          causa_retiro_alumno: string | null
          codigo_estado_alumno: number | null
          comuna_alumno: string | null
          domicilio_alumno: string | null
          email_apoderado_alumno: string | null
          estado_alumno: string | null
          fecha_incorporacion_alumno: string | null
          fecha_nacimiento_alumno: string | null
          fecha_retiro_escuela: string | null
          id: number
          jornada_alumno: string | null
          nacionalidad_alumno: string | null
          nivel_alumno: string | null
          nivel_educacional_madre: string | null
          nivel_educacional_padre: string | null
          nombre_apoderado_alumno: string | null
          nombre_completo_alumno: string | null
          nombres_alumno: string | null
          numero_lista_nivel_alumno: number | null
          numero_matricula_alumno: number | null
          parentezco_con_alumno: string | null
          problemas_aprendizaje_alumno: string | null
          procedencia_alumno: string | null
          pueblo_originario_alumno: string | null
          rbd_establecimiento: number | null
          region_alumno: string | null
          rut_alumno: string | null
          rut_profesor_alumno: string | null
          sexo_alumno: string | null
          situacion_social_alumno: string | null
          telefono_apoderado_alumno: string | null
          tipo_tel_alumno: string | null
          vive_con_alumno: string | null
        }
        Insert: {
          anio?: number | null
          apellidos_alumno?: string | null
          apoderado_tutor_alumno?: string | null
          causa_retiro_alumno?: string | null
          codigo_estado_alumno?: number | null
          comuna_alumno?: string | null
          domicilio_alumno?: string | null
          email_apoderado_alumno?: string | null
          estado_alumno?: string | null
          fecha_incorporacion_alumno?: string | null
          fecha_nacimiento_alumno?: string | null
          fecha_retiro_escuela?: string | null
          id?: number
          jornada_alumno?: string | null
          nacionalidad_alumno?: string | null
          nivel_alumno?: string | null
          nivel_educacional_madre?: string | null
          nivel_educacional_padre?: string | null
          nombre_apoderado_alumno?: string | null
          nombre_completo_alumno?: string | null
          nombres_alumno?: string | null
          numero_lista_nivel_alumno?: number | null
          numero_matricula_alumno?: number | null
          parentezco_con_alumno?: string | null
          problemas_aprendizaje_alumno?: string | null
          procedencia_alumno?: string | null
          pueblo_originario_alumno?: string | null
          rbd_establecimiento?: number | null
          region_alumno?: string | null
          rut_alumno?: string | null
          rut_profesor_alumno?: string | null
          sexo_alumno?: string | null
          situacion_social_alumno?: string | null
          telefono_apoderado_alumno?: string | null
          tipo_tel_alumno?: string | null
          vive_con_alumno?: string | null
        }
        Update: {
          anio?: number | null
          apellidos_alumno?: string | null
          apoderado_tutor_alumno?: string | null
          causa_retiro_alumno?: string | null
          codigo_estado_alumno?: number | null
          comuna_alumno?: string | null
          domicilio_alumno?: string | null
          email_apoderado_alumno?: string | null
          estado_alumno?: string | null
          fecha_incorporacion_alumno?: string | null
          fecha_nacimiento_alumno?: string | null
          fecha_retiro_escuela?: string | null
          id?: number
          jornada_alumno?: string | null
          nacionalidad_alumno?: string | null
          nivel_alumno?: string | null
          nivel_educacional_madre?: string | null
          nivel_educacional_padre?: string | null
          nombre_apoderado_alumno?: string | null
          nombre_completo_alumno?: string | null
          nombres_alumno?: string | null
          numero_lista_nivel_alumno?: number | null
          numero_matricula_alumno?: number | null
          parentezco_con_alumno?: string | null
          problemas_aprendizaje_alumno?: string | null
          procedencia_alumno?: string | null
          pueblo_originario_alumno?: string | null
          rbd_establecimiento?: number | null
          region_alumno?: string | null
          rut_alumno?: string | null
          rut_profesor_alumno?: string | null
          sexo_alumno?: string | null
          situacion_social_alumno?: string | null
          telefono_apoderado_alumno?: string | null
          tipo_tel_alumno?: string | null
          vive_con_alumno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumnos_2024_tp_nivel_educacional_padres__fk"
            columns: ["nivel_educacional_padre"]
            isOneToOne: false
            referencedRelation: "tp_nivel_educacional_padres"
            referencedColumns: ["descripcion_educacion"]
          },
        ]
      }
      log_asistencia_modificaciones: {
        Row: {
          campo_modificado: string
          fecha_modificacion: string | null
          id: number
          id_asistencia: number
          usuario_modificador: string
          valor_anterior: string | null
          valor_nuevo: string | null
        }
        Insert: {
          campo_modificado: string
          fecha_modificacion?: string | null
          id?: number
          id_asistencia: number
          usuario_modificador: string
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Update: {
          campo_modificado?: string
          fecha_modificacion?: string | null
          id?: number
          id_asistencia?: number
          usuario_modificador?: string
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "log_asistencia_modificaciones_id_asistencia_fkey"
            columns: ["id_asistencia"]
            isOneToOne: false
            referencedRelation: "mv_asistencia_diaria"
            referencedColumns: ["id"]
          },
        ]
      }
      log_estado_alumno: {
        Row: {
          causa_retiro: string
          codigo_estado: number
          descripcion_estado: string
          fecha_cambio: string | null
          fecha_retiro: string | null
          id: number
          numero_matricula: number
          rut: string
          rut_modificador: string | null
        }
        Insert: {
          causa_retiro: string
          codigo_estado: number
          descripcion_estado: string
          fecha_cambio?: string | null
          fecha_retiro?: string | null
          id?: number
          numero_matricula: number
          rut: string
          rut_modificador?: string | null
        }
        Update: {
          causa_retiro?: string
          codigo_estado?: number
          descripcion_estado?: string
          fecha_cambio?: string | null
          fecha_retiro?: string | null
          id?: number
          numero_matricula?: number
          rut?: string
          rut_modificador?: string | null
        }
        Relationships: []
      }
      log_pla_corto_plazo: {
        Row: {
          accion: string
          anio: number
          campo_modificado: string | null
          dia: number
          fecha_accion: string | null
          id: number
          id_planificacion: number
          mes: number
          rut_usuario: string
          valor_anterior: string | null
          valor_nuevo: string | null
        }
        Insert: {
          accion: string
          anio: number
          campo_modificado?: string | null
          dia: number
          fecha_accion?: string | null
          id?: number
          id_planificacion: number
          mes: number
          rut_usuario: string
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Update: {
          accion?: string
          anio?: number
          campo_modificado?: string | null
          dia?: number
          fecha_accion?: string | null
          id?: number
          id_planificacion?: number
          mes?: number
          rut_usuario?: string
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "log_pla_corto_plazo_id_planificacion_fkey"
            columns: ["id_planificacion"]
            isOneToOne: false
            referencedRelation: "mv_pla_corto_plazo"
            referencedColumns: ["id_planificacion"]
          },
        ]
      }
      log_pla_largo_plazo: {
        Row: {
          accion: string
          anio: number
          descripcion: string
          dia: number
          fecha_accion: string | null
          id: number
          id_planificacion: number
          mes: number
          rut_creador: string
        }
        Insert: {
          accion: string
          anio: number
          descripcion: string
          dia: number
          fecha_accion?: string | null
          id?: number
          id_planificacion: number
          mes: number
          rut_creador: string
        }
        Update: {
          accion?: string
          anio?: number
          descripcion?: string
          dia?: number
          fecha_accion?: string | null
          id?: number
          id_planificacion?: number
          mes?: number
          rut_creador?: string
        }
        Relationships: [
          {
            foreignKeyName: "log_pla_largo_plazo_id_planificacion_fkey"
            columns: ["id_planificacion"]
            isOneToOne: false
            referencedRelation: "mv_pla_largo_plazo"
            referencedColumns: ["id_planificacion"]
          },
        ]
      }
      log_pla_mediano_plazo: {
        Row: {
          accion: string
          anio: number
          campo_modificado: string | null
          dia: number
          fecha_accion: string | null
          id: number
          id_planificacion: number
          mes: number
          rut_usuario: string
          valor_anterior: string | null
          valor_nuevo: string | null
        }
        Insert: {
          accion: string
          anio: number
          campo_modificado?: string | null
          dia: number
          fecha_accion?: string | null
          id?: number
          id_planificacion: number
          mes: number
          rut_usuario: string
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Update: {
          accion?: string
          anio?: number
          campo_modificado?: string | null
          dia?: number
          fecha_accion?: string | null
          id?: number
          id_planificacion?: number
          mes?: number
          rut_usuario?: string
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "log_pla_mediano_plazo_id_planificacion_fkey"
            columns: ["id_planificacion"]
            isOneToOne: false
            referencedRelation: "mv_pla_mediano_plazo"
            referencedColumns: ["id_planificacion"]
          },
        ]
      }
      log_prematricula: {
        Row: {
          accion: string
          anio: number
          dia: number
          fecha_accion: string | null
          id: number
          letra_nivel_curso: string | null
          mes: number
          rbd_establecimiento: number | null
          rut_alumno: string | null
          rut_usuario: string
          sigla_nivel_curso: string | null
        }
        Insert: {
          accion: string
          anio: number
          dia: number
          fecha_accion?: string | null
          id?: number
          letra_nivel_curso?: string | null
          mes: number
          rbd_establecimiento?: number | null
          rut_alumno?: string | null
          rut_usuario: string
          sigla_nivel_curso?: string | null
        }
        Update: {
          accion?: string
          anio?: number
          dia?: number
          fecha_accion?: string | null
          id?: number
          letra_nivel_curso?: string | null
          mes?: number
          rbd_establecimiento?: number | null
          rut_alumno?: string | null
          rut_usuario?: string
          sigla_nivel_curso?: string | null
        }
        Relationships: []
      }
      mv_anotaciones_alumno: {
        Row: {
          anio: number
          created_at: string
          descripcion_anotacion: string
          dia: number
          fecha_anotacion: string
          id: number
          mes: number
          numero_matricula: number
          rbd_escuela: number
          rut_anotador: string
        }
        Insert: {
          anio: number
          created_at?: string
          descripcion_anotacion: string
          dia: number
          fecha_anotacion: string
          id?: number
          mes: number
          numero_matricula: number
          rbd_escuela: number
          rut_anotador: string
        }
        Update: {
          anio?: number
          created_at?: string
          descripcion_anotacion?: string
          dia?: number
          fecha_anotacion?: string
          id?: number
          mes?: number
          numero_matricula?: number
          rbd_escuela?: number
          rut_anotador?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_mv_anotaciones_alumno_rbd"
            columns: ["rbd_escuela"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "fk_mv_anotaciones_alumno_rbd"
            columns: ["rbd_escuela"]
            isOneToOne: false
            referencedRelation: "view_panel_administracion_resumen_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "fk_mv_anotaciones_alumno_rbd"
            columns: ["rbd_escuela"]
            isOneToOne: false
            referencedRelation: "view_profesor_curso"
            referencedColumns: ["rbd"]
          },
        ]
      }
      mv_anotaciones_fonoaudiologicas: {
        Row: {
          anio: number
          created_at: string
          descripcion_anotacion: string
          dia: number
          fecha_anotacion: string
          id: number
          mes: number
          numero_matricula: number
          rbd_escuela: number
          rut_anotador: string
        }
        Insert: {
          anio: number
          created_at?: string
          descripcion_anotacion: string
          dia: number
          fecha_anotacion: string
          id?: number
          mes: number
          numero_matricula: number
          rbd_escuela: number
          rut_anotador: string
        }
        Update: {
          anio?: number
          created_at?: string
          descripcion_anotacion?: string
          dia?: number
          fecha_anotacion?: string
          id?: number
          mes?: number
          numero_matricula?: number
          rbd_escuela?: number
          rut_anotador?: string
        }
        Relationships: [
          {
            foreignKeyName: "mv_anotaciones_fonoaudiologicas_rbd_escuela_fkey"
            columns: ["rbd_escuela"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_anotaciones_fonoaudiologicas_rbd_escuela_fkey"
            columns: ["rbd_escuela"]
            isOneToOne: false
            referencedRelation: "view_panel_administracion_resumen_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_anotaciones_fonoaudiologicas_rbd_escuela_fkey"
            columns: ["rbd_escuela"]
            isOneToOne: false
            referencedRelation: "view_profesor_curso"
            referencedColumns: ["rbd"]
          },
        ]
      }
      mv_asistencia_diaria: {
        Row: {
          estado: number
          fecha_creacion: string
          fecha_modificacion: string | null
          id: number
          nivel_alumno: string
          observacion_asistencia: string | null
          otp_asistencia: number
          otp_modifica_asistencia: number | null
          rbd: number
          respuesta_otp_asistencia: string
          respuesta_otp_modifica_asistencia: string | null
          rut_alumno: string
          rut_usuario: string | null
          rut_usuario_modifica_asistencia: string | null
        }
        Insert: {
          estado: number
          fecha_creacion?: string
          fecha_modificacion?: string | null
          id?: number
          nivel_alumno: string
          observacion_asistencia?: string | null
          otp_asistencia: number
          otp_modifica_asistencia?: number | null
          rbd: number
          respuesta_otp_asistencia: string
          respuesta_otp_modifica_asistencia?: string | null
          rut_alumno: string
          rut_usuario?: string | null
          rut_usuario_modifica_asistencia?: string | null
        }
        Update: {
          estado?: number
          fecha_creacion?: string
          fecha_modificacion?: string | null
          id?: number
          nivel_alumno?: string
          observacion_asistencia?: string | null
          otp_asistencia?: number
          otp_modifica_asistencia?: number | null
          rbd?: number
          respuesta_otp_asistencia?: string
          respuesta_otp_modifica_asistencia?: string | null
          rut_alumno?: string
          rut_usuario?: string | null
          rut_usuario_modifica_asistencia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mv_asistencia_diaria_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_asistencia_diaria_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "view_panel_administracion_resumen_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_asistencia_diaria_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "view_profesor_curso"
            referencedColumns: ["rbd"]
          },
        ]
      }
      mv_inter_pla_corto_plazo: {
        Row: {
          anio: number
          codigo_ambito: number
          codigo_nucleo: number
          codigo_oa: number
          dia: number
          fecha_modificacion: string | null
          id: number
          id_planificacion: number
          mes: number
          rut_usuario: string
        }
        Insert: {
          anio: number
          codigo_ambito: number
          codigo_nucleo: number
          codigo_oa: number
          dia: number
          fecha_modificacion?: string | null
          id?: number
          id_planificacion: number
          mes: number
          rut_usuario: string
        }
        Update: {
          anio?: number
          codigo_ambito?: number
          codigo_nucleo?: number
          codigo_oa?: number
          dia?: number
          fecha_modificacion?: string | null
          id?: number
          id_planificacion?: number
          mes?: number
          rut_usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "mv_inter_pla_corto_plazo_id_planificacion_fkey"
            columns: ["id_planificacion"]
            isOneToOne: false
            referencedRelation: "mv_pla_corto_plazo"
            referencedColumns: ["id_planificacion"]
          },
        ]
      }
      mv_inter_pla_mediano_plazo: {
        Row: {
          anio: number
          codigo_desempeno: number
          codigo_nucleo: number
          codigo_oa: number
          dia: number
          fecha_asociacion: string | null
          id: number
          id_base_curricular: number
          id_planificacion: number
          mes: number
        }
        Insert: {
          anio: number
          codigo_desempeno: number
          codigo_nucleo: number
          codigo_oa: number
          dia: number
          fecha_asociacion?: string | null
          id?: number
          id_base_curricular: number
          id_planificacion: number
          mes: number
        }
        Update: {
          anio?: number
          codigo_desempeno?: number
          codigo_nucleo?: number
          codigo_oa?: number
          dia?: number
          fecha_asociacion?: string | null
          id?: number
          id_base_curricular?: number
          id_planificacion?: number
          mes?: number
        }
        Relationships: [
          {
            foreignKeyName: "mv_inter_pla_mediano_plazo_id_base_curricular_fkey"
            columns: ["id_base_curricular"]
            isOneToOne: false
            referencedRelation: "tp_bases_curriculares"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mv_inter_pla_mediano_plazo_id_planificacion_fkey"
            columns: ["id_planificacion"]
            isOneToOne: false
            referencedRelation: "mv_pla_mediano_plazo"
            referencedColumns: ["id_planificacion"]
          },
        ]
      }
      mv_libro_matricula: {
        Row: {
          anio_libro: number | null
          apellidos_alumno: string
          apoderado_tutor_alumno: string | null
          causa_retiro_alumno: string | null
          codigo_estado_alumno: number
          comuna_alumno: string | null
          created_at: string
          domicilio_alumno: string | null
          email_apoderado_alumno: string | null
          estado_alumno: string
          fecha_incorporacion_alumno: string
          fecha_nacimiento_alumno: string | null
          fecha_retiro_escuela: string | null
          id: number
          jornada_alumno: string | null
          nacionalidad_alumno: string | null
          nivel_alumno: string
          nivel_educacional_madre: string | null
          nivel_educacional_padre: string | null
          nombre_apoderado_alumno: string | null
          nombre_completo_alumno: string
          nombres_alumno: string
          numero_lista_nivel_alumno: number
          numero_matricula_alumno: number
          parentezco_con_alumno: string | null
          problema_aprendizaje_alumno: string | null
          procedencia_alumno: string
          pueblo_originario_alumno: string | null
          rbd_establecimiento: number
          region_alumno: string | null
          rut_alumno: string
          rut_profesor_alumno: string | null
          sexo_alumno: string | null
          situacion_social_alumno: string | null
          telefono_apoderado_alumno: string | null
          tipo_tel_alumno: string | null
          vive_con_alumno: string | null
        }
        Insert: {
          anio_libro?: number | null
          apellidos_alumno: string
          apoderado_tutor_alumno?: string | null
          causa_retiro_alumno?: string | null
          codigo_estado_alumno: number
          comuna_alumno?: string | null
          created_at?: string
          domicilio_alumno?: string | null
          email_apoderado_alumno?: string | null
          estado_alumno: string
          fecha_incorporacion_alumno: string
          fecha_nacimiento_alumno?: string | null
          fecha_retiro_escuela?: string | null
          id?: number
          jornada_alumno?: string | null
          nacionalidad_alumno?: string | null
          nivel_alumno: string
          nivel_educacional_madre?: string | null
          nivel_educacional_padre?: string | null
          nombre_apoderado_alumno?: string | null
          nombre_completo_alumno: string
          nombres_alumno: string
          numero_lista_nivel_alumno: number
          numero_matricula_alumno: number
          parentezco_con_alumno?: string | null
          problema_aprendizaje_alumno?: string | null
          procedencia_alumno: string
          pueblo_originario_alumno?: string | null
          rbd_establecimiento: number
          region_alumno?: string | null
          rut_alumno: string
          rut_profesor_alumno?: string | null
          sexo_alumno?: string | null
          situacion_social_alumno?: string | null
          telefono_apoderado_alumno?: string | null
          tipo_tel_alumno?: string | null
          vive_con_alumno?: string | null
        }
        Update: {
          anio_libro?: number | null
          apellidos_alumno?: string
          apoderado_tutor_alumno?: string | null
          causa_retiro_alumno?: string | null
          codigo_estado_alumno?: number
          comuna_alumno?: string | null
          created_at?: string
          domicilio_alumno?: string | null
          email_apoderado_alumno?: string | null
          estado_alumno?: string
          fecha_incorporacion_alumno?: string
          fecha_nacimiento_alumno?: string | null
          fecha_retiro_escuela?: string | null
          id?: number
          jornada_alumno?: string | null
          nacionalidad_alumno?: string | null
          nivel_alumno?: string
          nivel_educacional_madre?: string | null
          nivel_educacional_padre?: string | null
          nombre_apoderado_alumno?: string | null
          nombre_completo_alumno?: string
          nombres_alumno?: string
          numero_lista_nivel_alumno?: number
          numero_matricula_alumno?: number
          parentezco_con_alumno?: string | null
          problema_aprendizaje_alumno?: string | null
          procedencia_alumno?: string
          pueblo_originario_alumno?: string | null
          rbd_establecimiento?: number
          region_alumno?: string | null
          rut_alumno?: string
          rut_profesor_alumno?: string | null
          sexo_alumno?: string | null
          situacion_social_alumno?: string | null
          telefono_apoderado_alumno?: string | null
          tipo_tel_alumno?: string | null
          vive_con_alumno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_mv_libro_matricula_descripcion _comuna"
            columns: ["comuna_alumno"]
            isOneToOne: false
            referencedRelation: "tp_regiones_comunas_chile"
            referencedColumns: ["nombre_comuna"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_genero_alumno"
            columns: ["sexo_alumno"]
            isOneToOne: false
            referencedRelation: "tp_genero_alumno"
            referencedColumns: ["descripcion_genero_alumno"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_jornada_alumno"
            columns: ["jornada_alumno"]
            isOneToOne: false
            referencedRelation: "tp_jornada_alumno"
            referencedColumns: ["descripcion_jornada"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_nacionalidad_alumno"
            columns: ["nacionalidad_alumno"]
            isOneToOne: false
            referencedRelation: "tp_nacionalidad_alumno"
            referencedColumns: ["descripcion_nacionalidad"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_nivel_edu_madre"
            columns: ["nivel_educacional_madre"]
            isOneToOne: false
            referencedRelation: "tp_nivel_educacional_padres"
            referencedColumns: ["descripcion_educacion"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_nivel_edu_padre"
            columns: ["nivel_educacional_padre"]
            isOneToOne: false
            referencedRelation: "tp_nivel_educacional_padres"
            referencedColumns: ["descripcion_educacion"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_parentezco_alumno"
            columns: ["parentezco_con_alumno"]
            isOneToOne: false
            referencedRelation: "tp_parentezco_alumno"
            referencedColumns: ["descripcion_parentezco_alumno"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_pertenece_pueblo_originario"
            columns: ["pueblo_originario_alumno"]
            isOneToOne: false
            referencedRelation: "tp_pueblo_originario"
            referencedColumns: ["descripcion_pertenece"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_problemas_aprendizaje"
            columns: ["problema_aprendizaje_alumno"]
            isOneToOne: false
            referencedRelation: "tp_problemas_aprendizaje"
            referencedColumns: ["descripcion_problema_aprendizaje"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_procedencia_alumno"
            columns: ["procedencia_alumno"]
            isOneToOne: false
            referencedRelation: "tp_procedencia_alumno"
            referencedColumns: ["descripcion_procedencia"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_situacion_social"
            columns: ["situacion_social_alumno"]
            isOneToOne: false
            referencedRelation: "tp_situacion_social"
            referencedColumns: ["descripcion_situacion_social"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_tipo_tel"
            columns: ["tipo_tel_alumno"]
            isOneToOne: false
            referencedRelation: "tp_tipo_tel"
            referencedColumns: ["descripcion_tel"]
          },
          {
            foreignKeyName: "fk_mv_libro_matricula_vive_con"
            columns: ["vive_con_alumno"]
            isOneToOne: false
            referencedRelation: "tp_vive_con"
            referencedColumns: ["descripcion_vive_con"]
          },
          {
            foreignKeyName: "mv_libro_matricula___fk_codigo_estado_alumno"
            columns: ["codigo_estado_alumno"]
            isOneToOne: false
            referencedRelation: "tp_estado_alumno"
            referencedColumns: ["codigo_estado"]
          },
          {
            foreignKeyName: "mv_libro_matricula___fk_estado_alumno"
            columns: ["estado_alumno"]
            isOneToOne: false
            referencedRelation: "tp_estado_alumno"
            referencedColumns: ["descripcion_estado"]
          },
          {
            foreignKeyName: "mv_libro_matricula_rbd_establecimiento_fkey"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_libro_matricula_rbd_establecimiento_fkey"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "view_panel_administracion_resumen_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_libro_matricula_rbd_establecimiento_fkey"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "view_profesor_curso"
            referencedColumns: ["rbd"]
          },
        ]
      }
      mv_libro_matricula_log: {
        Row: {
          action_type: string
          change_date: string | null
          changed_by: string | null
          log_id: number
          new_data: Json | null
          old_data: Json | null
          rut_usuario: string | null
        }
        Insert: {
          action_type: string
          change_date?: string | null
          changed_by?: string | null
          log_id?: number
          new_data?: Json | null
          old_data?: Json | null
          rut_usuario?: string | null
        }
        Update: {
          action_type?: string
          change_date?: string | null
          changed_by?: string | null
          log_id?: number
          new_data?: Json | null
          old_data?: Json | null
          rut_usuario?: string | null
        }
        Relationships: []
      }
      mv_libro_matricula_temp: {
        Row: {
          anio_libro: number | null
          apellidos_alumno: string
          apoderado_tutor_alumno: string | null
          causa_retiro_alumno: string | null
          codigo_estado_alumno: number
          comuna_alumno: string | null
          created_at: string
          domicilio_alumno: string | null
          email_apoderado_alumno: string | null
          estado_alumno: string
          fecha_incorporacion_alumno: string
          fecha_nacimiento_alumno: string
          fecha_retiro_escuela: string | null
          id: number
          jornada_alumno: string | null
          nacionalidad_alumno: string | null
          nivel_alumno: string
          nivel_educacional_madre: string | null
          nivel_educacional_padre: string | null
          nombre_apoderado_alumno: string | null
          nombre_completo_alumno: string | null
          nombres_alumno: string
          numero_lista_nivel_alumno: number
          numero_matricula_alumno: number
          parentezco_con_alumno: string | null
          problema_aprendizaje_alumno: string | null
          procedencia_alumno: string | null
          pueblo_originario_alumno: string | null
          rbd_establecimiento: number
          region_alumno: string | null
          rut_alumno: string
          rut_profesor_alumno: string | null
          sexo_alumno: string | null
          situacion_social_alumno: string | null
          telefono_apoderado_alumno: string | null
          tipo_tel_alumno: string | null
          vive_con_alumno: string | null
        }
        Insert: {
          anio_libro?: number | null
          apellidos_alumno: string
          apoderado_tutor_alumno?: string | null
          causa_retiro_alumno?: string | null
          codigo_estado_alumno: number
          comuna_alumno?: string | null
          created_at?: string
          domicilio_alumno?: string | null
          email_apoderado_alumno?: string | null
          estado_alumno: string
          fecha_incorporacion_alumno: string
          fecha_nacimiento_alumno: string
          fecha_retiro_escuela?: string | null
          id?: number
          jornada_alumno?: string | null
          nacionalidad_alumno?: string | null
          nivel_alumno: string
          nivel_educacional_madre?: string | null
          nivel_educacional_padre?: string | null
          nombre_apoderado_alumno?: string | null
          nombre_completo_alumno?: string | null
          nombres_alumno: string
          numero_lista_nivel_alumno: number
          numero_matricula_alumno: number
          parentezco_con_alumno?: string | null
          problema_aprendizaje_alumno?: string | null
          procedencia_alumno?: string | null
          pueblo_originario_alumno?: string | null
          rbd_establecimiento: number
          region_alumno?: string | null
          rut_alumno: string
          rut_profesor_alumno?: string | null
          sexo_alumno?: string | null
          situacion_social_alumno?: string | null
          telefono_apoderado_alumno?: string | null
          tipo_tel_alumno?: string | null
          vive_con_alumno?: string | null
        }
        Update: {
          anio_libro?: number | null
          apellidos_alumno?: string
          apoderado_tutor_alumno?: string | null
          causa_retiro_alumno?: string | null
          codigo_estado_alumno?: number
          comuna_alumno?: string | null
          created_at?: string
          domicilio_alumno?: string | null
          email_apoderado_alumno?: string | null
          estado_alumno?: string
          fecha_incorporacion_alumno?: string
          fecha_nacimiento_alumno?: string
          fecha_retiro_escuela?: string | null
          id?: number
          jornada_alumno?: string | null
          nacionalidad_alumno?: string | null
          nivel_alumno?: string
          nivel_educacional_madre?: string | null
          nivel_educacional_padre?: string | null
          nombre_apoderado_alumno?: string | null
          nombre_completo_alumno?: string | null
          nombres_alumno?: string
          numero_lista_nivel_alumno?: number
          numero_matricula_alumno?: number
          parentezco_con_alumno?: string | null
          problema_aprendizaje_alumno?: string | null
          procedencia_alumno?: string | null
          pueblo_originario_alumno?: string | null
          rbd_establecimiento?: number
          region_alumno?: string | null
          rut_alumno?: string
          rut_profesor_alumno?: string | null
          sexo_alumno?: string | null
          situacion_social_alumno?: string | null
          telefono_apoderado_alumno?: string | null
          tipo_tel_alumno?: string | null
          vive_con_alumno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mv_libro_matricula_duplicate_t_problema_aprendizaje_alumno_fkey"
            columns: ["problema_aprendizaje_alumno"]
            isOneToOne: false
            referencedRelation: "tp_problemas_aprendizaje"
            referencedColumns: ["descripcion_problema_aprendizaje"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_codigo_estado_alumno_fkey"
            columns: ["codigo_estado_alumno"]
            isOneToOne: false
            referencedRelation: "tp_estado_alumno"
            referencedColumns: ["codigo_estado"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_comuna_alumno_fkey"
            columns: ["comuna_alumno"]
            isOneToOne: false
            referencedRelation: "tp_regiones_comunas_chile"
            referencedColumns: ["nombre_comuna"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_estado_alumno_fkey"
            columns: ["estado_alumno"]
            isOneToOne: false
            referencedRelation: "tp_estado_alumno"
            referencedColumns: ["descripcion_estado"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_jornada_alumno_fkey"
            columns: ["jornada_alumno"]
            isOneToOne: false
            referencedRelation: "tp_jornada_alumno"
            referencedColumns: ["descripcion_jornada"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_nacionalidad_alumno_fkey"
            columns: ["nacionalidad_alumno"]
            isOneToOne: false
            referencedRelation: "tp_nacionalidad_alumno"
            referencedColumns: ["descripcion_nacionalidad"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_nivel_educacional_madre_fkey"
            columns: ["nivel_educacional_madre"]
            isOneToOne: false
            referencedRelation: "tp_nivel_educacional_padres"
            referencedColumns: ["descripcion_educacion"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_nivel_educacional_padre_fkey"
            columns: ["nivel_educacional_padre"]
            isOneToOne: false
            referencedRelation: "tp_nivel_educacional_padres"
            referencedColumns: ["descripcion_educacion"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_parentezco_con_alumno_fkey"
            columns: ["parentezco_con_alumno"]
            isOneToOne: false
            referencedRelation: "tp_parentezco_alumno"
            referencedColumns: ["descripcion_parentezco_alumno"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_procedencia_alumno_fkey"
            columns: ["procedencia_alumno"]
            isOneToOne: false
            referencedRelation: "tp_procedencia_alumno"
            referencedColumns: ["descripcion_procedencia"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_pueblo_originario_alumno_fkey"
            columns: ["pueblo_originario_alumno"]
            isOneToOne: false
            referencedRelation: "tp_pueblo_originario"
            referencedColumns: ["descripcion_pertenece"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_rbd_establecimiento_fkey"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_rbd_establecimiento_fkey"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "view_panel_administracion_resumen_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_rbd_establecimiento_fkey"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "view_profesor_curso"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_sexo_alumno_fkey"
            columns: ["sexo_alumno"]
            isOneToOne: false
            referencedRelation: "tp_genero_alumno"
            referencedColumns: ["descripcion_genero_alumno"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_situacion_social_alumno_fkey"
            columns: ["situacion_social_alumno"]
            isOneToOne: false
            referencedRelation: "tp_situacion_social"
            referencedColumns: ["descripcion_situacion_social"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_tipo_tel_alumno_fkey"
            columns: ["tipo_tel_alumno"]
            isOneToOne: false
            referencedRelation: "tp_tipo_tel"
            referencedColumns: ["descripcion_tel"]
          },
          {
            foreignKeyName: "mv_libro_matricula_duplicate_temp_vive_con_alumno_fkey"
            columns: ["vive_con_alumno"]
            isOneToOne: false
            referencedRelation: "tp_vive_con"
            referencedColumns: ["descripcion_vive_con"]
          },
        ]
      }
      mv_pla_corto_plazo: {
        Row: {
          anio: number
          dia: number
          estado_planificacion: number
          fecha_modificacion: string | null
          id_planificacion: number
          id_planificacion_mediano_plazo: number
          inicio_desarrollo_cierre: string
          instrumentos_evaluacion: string
          mes: number
          nivel_planificacion: string
          rbd: number
          recursos: string
        }
        Insert: {
          anio: number
          dia: number
          estado_planificacion: number
          fecha_modificacion?: string | null
          id_planificacion?: number
          id_planificacion_mediano_plazo: number
          inicio_desarrollo_cierre: string
          instrumentos_evaluacion: string
          mes: number
          nivel_planificacion: string
          rbd: number
          recursos: string
        }
        Update: {
          anio?: number
          dia?: number
          estado_planificacion?: number
          fecha_modificacion?: string | null
          id_planificacion?: number
          id_planificacion_mediano_plazo?: number
          inicio_desarrollo_cierre?: string
          instrumentos_evaluacion?: string
          mes?: number
          nivel_planificacion?: string
          rbd?: number
          recursos?: string
        }
        Relationships: [
          {
            foreignKeyName: "mv_pla_corto_plazo_id_planificacion_mediano_plazo_fkey"
            columns: ["id_planificacion_mediano_plazo"]
            isOneToOne: false
            referencedRelation: "mv_pla_mediano_plazo"
            referencedColumns: ["id_planificacion"]
          },
          {
            foreignKeyName: "mv_pla_corto_plazo_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_pla_corto_plazo_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "view_panel_administracion_resumen_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_pla_corto_plazo_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "view_profesor_curso"
            referencedColumns: ["rbd"]
          },
        ]
      }
      mv_pla_largo_plazo: {
        Row: {
          anio: number
          anio_creacion: number
          descripcion_planificacion: string
          dia: number
          dia_creacion: number
          estado_planificacion: number
          fecha_creacion: string | null
          fecha_modificacion: string | null
          id_planificacion: number
          mes: number
          mes_creacion: number
          nivel_planificacion: string
          otp_crea_planificacion: number
          rbd: number
          respuesta_mineduc_otp: string
          rut_crea_planificacion: string
        }
        Insert: {
          anio: number
          anio_creacion: number
          descripcion_planificacion: string
          dia: number
          dia_creacion: number
          estado_planificacion: number
          fecha_creacion?: string | null
          fecha_modificacion?: string | null
          id_planificacion?: number
          mes: number
          mes_creacion: number
          nivel_planificacion: string
          otp_crea_planificacion: number
          rbd: number
          respuesta_mineduc_otp: string
          rut_crea_planificacion: string
        }
        Update: {
          anio?: number
          anio_creacion?: number
          descripcion_planificacion?: string
          dia?: number
          dia_creacion?: number
          estado_planificacion?: number
          fecha_creacion?: string | null
          fecha_modificacion?: string | null
          id_planificacion?: number
          mes?: number
          mes_creacion?: number
          nivel_planificacion?: string
          otp_crea_planificacion?: number
          rbd?: number
          respuesta_mineduc_otp?: string
          rut_crea_planificacion?: string
        }
        Relationships: []
      }
      mv_pla_mediano_plazo: {
        Row: {
          anio: number
          cantidad_semanas: number
          cierre_proyecto: string
          dia: number
          estado_planificacion: number
          estrategias: string
          fecha_creacion: string | null
          fecha_fin: string | null
          fecha_inicio: string
          fecha_modificacion: string | null
          id_planificacion: number
          mes: number
          nivel_planificacion: string
          objetivos_generales: string
          proyecto_eje: string
          rbd: number
        }
        Insert: {
          anio: number
          cantidad_semanas: number
          cierre_proyecto: string
          dia: number
          estado_planificacion: number
          estrategias: string
          fecha_creacion?: string | null
          fecha_fin?: string | null
          fecha_inicio: string
          fecha_modificacion?: string | null
          id_planificacion?: number
          mes: number
          nivel_planificacion: string
          objetivos_generales: string
          proyecto_eje: string
          rbd: number
        }
        Update: {
          anio?: number
          cantidad_semanas?: number
          cierre_proyecto?: string
          dia?: number
          estado_planificacion?: number
          estrategias?: string
          fecha_creacion?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string
          fecha_modificacion?: string | null
          id_planificacion?: number
          mes?: number
          nivel_planificacion?: string
          objetivos_generales?: string
          proyecto_eje?: string
          rbd?: number
        }
        Relationships: [
          {
            foreignKeyName: "mv_pla_mediano_plazo_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_pla_mediano_plazo_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "view_panel_administracion_resumen_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_pla_mediano_plazo_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "view_profesor_curso"
            referencedColumns: ["rbd"]
          },
        ]
      }
      mv_profesor_cursos: {
        Row: {
          anio: number
          created_at: string
          curso_asignado: string
          id: number
          rbd_establecimiento: number
          rut_profesor: string
        }
        Insert: {
          anio: number
          created_at?: string
          curso_asignado: string
          id?: number
          rbd_establecimiento: number
          rut_profesor: string
        }
        Update: {
          anio?: number
          created_at?: string
          curso_asignado?: string
          id?: number
          rbd_establecimiento?: number
          rut_profesor?: string
        }
        Relationships: [
          {
            foreignKeyName: "mv_profesor_cursos_mv_usuario__fk"
            columns: ["rut_profesor"]
            isOneToOne: false
            referencedRelation: "mv_usuario"
            referencedColumns: ["rut_usuario"]
          },
          {
            foreignKeyName: "mv_profesor_cursos_tp_establecimientos__fk"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_profesor_cursos_tp_establecimientos__fk"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "view_panel_administracion_resumen_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_profesor_cursos_tp_establecimientos__fk"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "view_profesor_curso"
            referencedColumns: ["rbd"]
          },
        ]
      }
      mv_tel_alumnos: {
        Row: {
          anio: number
          apellidos_alumno: string
          contenido_fonoaudiologico: string
          created_at: string
          dia: number
          fecha_evaluacion: string
          id: number
          mes: number
          modalidad_evaluacion: number
          nivel_fonoaudiologico: string
          nombres_alumno: string
          observaciones_actualizacion: string
          observaciones_fonoaudiologicas: string
          otp_observaciones: number
          otp_usuario_actualizacion: number
          rut_alumno: string
          rut_usuario: string
          rut_usuario_actualizacion: string
        }
        Insert: {
          anio: number
          apellidos_alumno: string
          contenido_fonoaudiologico: string
          created_at?: string
          dia: number
          fecha_evaluacion: string
          id?: number
          mes: number
          modalidad_evaluacion: number
          nivel_fonoaudiologico: string
          nombres_alumno: string
          observaciones_actualizacion: string
          observaciones_fonoaudiologicas: string
          otp_observaciones: number
          otp_usuario_actualizacion: number
          rut_alumno: string
          rut_usuario: string
          rut_usuario_actualizacion: string
        }
        Update: {
          anio?: number
          apellidos_alumno?: string
          contenido_fonoaudiologico?: string
          created_at?: string
          dia?: number
          fecha_evaluacion?: string
          id?: number
          mes?: number
          modalidad_evaluacion?: number
          nivel_fonoaudiologico?: string
          nombres_alumno?: string
          observaciones_actualizacion?: string
          observaciones_fonoaudiologicas?: string
          otp_observaciones?: number
          otp_usuario_actualizacion?: number
          rut_alumno?: string
          rut_usuario?: string
          rut_usuario_actualizacion?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_mv_usuario_codigo_modalidad"
            columns: ["modalidad_evaluacion"]
            isOneToOne: false
            referencedRelation: "tel_modalidad"
            referencedColumns: ["codigo_modalidad"]
          },
        ]
      }
      mv_usuario: {
        Row: {
          apellido_usuario: string
          codigo_estado_usuario: number
          codigo_perfil_usuario: number
          created_at: string
          curso_asignado: string | null
          email: string
          id: string
          nombre_usuario: string
          rbd_usuario: number
          rut_modifica_usuario: string | null
          rut_usuario: string
          telefono: string
          updated_at: string | null
        }
        Insert: {
          apellido_usuario: string
          codigo_estado_usuario: number
          codigo_perfil_usuario: number
          created_at?: string
          curso_asignado?: string | null
          email: string
          id: string
          nombre_usuario: string
          rbd_usuario: number
          rut_modifica_usuario?: string | null
          rut_usuario: string
          telefono: string
          updated_at?: string | null
        }
        Update: {
          apellido_usuario?: string
          codigo_estado_usuario?: number
          codigo_perfil_usuario?: number
          created_at?: string
          curso_asignado?: string | null
          email?: string
          id?: string
          nombre_usuario?: string
          rbd_usuario?: number
          rut_modifica_usuario?: string | null
          rut_usuario?: string
          telefono?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_mv_usuario_codigo_estado_usuario"
            columns: ["codigo_estado_usuario"]
            isOneToOne: false
            referencedRelation: "tp_estado_usuario"
            referencedColumns: ["codigo_estado_usuario"]
          },
          {
            foreignKeyName: "fk_mv_usuario_codigo_perfil"
            columns: ["codigo_perfil_usuario"]
            isOneToOne: false
            referencedRelation: "tp_perfil_usuario"
            referencedColumns: ["codigo_perfil_usuario"]
          },
          {
            foreignKeyName: "mv_usuario_rbd_usuario_fkey"
            columns: ["rbd_usuario"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_usuario_rbd_usuario_fkey"
            columns: ["rbd_usuario"]
            isOneToOne: false
            referencedRelation: "view_panel_administracion_resumen_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_usuario_rbd_usuario_fkey"
            columns: ["rbd_usuario"]
            isOneToOne: false
            referencedRelation: "view_profesor_curso"
            referencedColumns: ["rbd"]
          },
        ]
      }
      numerito: {
        Row: {
          coalesce: number | null
        }
        Insert: {
          coalesce?: number | null
        }
        Update: {
          coalesce?: number | null
        }
        Relationships: []
      }
      result: {
        Row: {
          jsonb_build_object: Json | null
        }
        Insert: {
          jsonb_build_object?: Json | null
        }
        Update: {
          jsonb_build_object?: Json | null
        }
        Relationships: []
      }
      tel_bases_fonoaudiologicas: {
        Row: {
          anio: number
          codigo_ambito: number
          codigo_contenido: number
          created_at: string
          descripcion_ambito: string
          descripcion_contenido: string
          id: number
          nivel: string
        }
        Insert: {
          anio: number
          codigo_ambito: number
          codigo_contenido: number
          created_at?: string
          descripcion_ambito: string
          descripcion_contenido: string
          id?: number
          nivel: string
        }
        Update: {
          anio?: number
          codigo_ambito?: number
          codigo_contenido?: number
          created_at?: string
          descripcion_ambito?: string
          descripcion_contenido?: string
          id?: number
          nivel?: string
        }
        Relationships: []
      }
      tel_modalidad: {
        Row: {
          codigo_modalidad: number
          created_at: string
          descripcion_modalidad: string
          id: number
        }
        Insert: {
          codigo_modalidad: number
          created_at?: string
          descripcion_modalidad: string
          id?: number
        }
        Update: {
          codigo_modalidad?: number
          created_at?: string
          descripcion_modalidad?: string
          id?: number
        }
        Relationships: []
      }
      tp_anio_academico: {
        Row: {
          anio: number
          estado: boolean
          id: number
        }
        Insert: {
          anio: number
          estado: boolean
          id?: number
        }
        Update: {
          anio?: number
          estado?: boolean
          id?: number
        }
        Relationships: []
      }
      tp_bases_curriculares: {
        Row: {
          anio: number
          codigo_ambito: number
          codigo_nucleo: number
          codigo_oa: number
          descripcion_ambito: string
          descripcion_nucleo: string
          descripcion_oa: string
          id: number
          nivel: string
        }
        Insert: {
          anio: number
          codigo_ambito: number
          codigo_nucleo: number
          codigo_oa: number
          descripcion_ambito: string
          descripcion_nucleo: string
          descripcion_oa: string
          id?: number
          nivel: string
        }
        Update: {
          anio?: number
          codigo_ambito?: number
          codigo_nucleo?: number
          codigo_oa?: number
          descripcion_ambito?: string
          descripcion_nucleo?: string
          descripcion_oa?: string
          id?: number
          nivel?: string
        }
        Relationships: []
      }
      tp_cursos: {
        Row: {
          anio_curso: number | null
          created_at: string | null
          id: number
          letra_nivel_curso: string
          nombre_curso: string
          rbd_establecimiento: number
          sigla_nivel_curso: string
        }
        Insert: {
          anio_curso?: number | null
          created_at?: string | null
          id?: number
          letra_nivel_curso: string
          nombre_curso: string
          rbd_establecimiento: number
          sigla_nivel_curso: string
        }
        Update: {
          anio_curso?: number | null
          created_at?: string | null
          id?: number
          letra_nivel_curso?: string
          nombre_curso?: string
          rbd_establecimiento?: number
          sigla_nivel_curso?: string
        }
        Relationships: [
          {
            foreignKeyName: "tp_cursos_tp_establecimientos__fk"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "tp_cursos_tp_establecimientos__fk"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "view_panel_administracion_resumen_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "tp_cursos_tp_establecimientos__fk"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "view_profesor_curso"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "tp_cursos_tp_niveles__fk"
            columns: ["sigla_nivel_curso"]
            isOneToOne: false
            referencedRelation: "tp_niveles"
            referencedColumns: ["sigla_nivel"]
          },
        ]
      }
      tp_establecimientos: {
        Row: {
          codigo_perfil: number | null
          create_at: string | null
          id: number
          nombre_corto: string | null
          razon_social: string
          rbd: number
        }
        Insert: {
          codigo_perfil?: number | null
          create_at?: string | null
          id: number
          nombre_corto?: string | null
          razon_social: string
          rbd: number
        }
        Update: {
          codigo_perfil?: number | null
          create_at?: string | null
          id?: number
          nombre_corto?: string | null
          razon_social?: string
          rbd?: number
        }
        Relationships: [
          {
            foreignKeyName: "tp_establecimientos___fk_codigo_perfil"
            columns: ["codigo_perfil"]
            isOneToOne: false
            referencedRelation: "tp_perfil_establecimiento"
            referencedColumns: ["codigo_perfil"]
          },
        ]
      }
      tp_estado_alumno: {
        Row: {
          codigo_estado: number
          descripcion_estado: string
          id: number
        }
        Insert: {
          codigo_estado: number
          descripcion_estado: string
          id?: number
        }
        Update: {
          codigo_estado?: number
          descripcion_estado?: string
          id?: number
        }
        Relationships: []
      }
      tp_estado_usuario: {
        Row: {
          codigo_estado_usuario: number | null
          created_at: string | null
          descripcion_estado_usuario: string | null
          id: number
        }
        Insert: {
          codigo_estado_usuario?: number | null
          created_at?: string | null
          descripcion_estado_usuario?: string | null
          id: number
        }
        Update: {
          codigo_estado_usuario?: number | null
          created_at?: string | null
          descripcion_estado_usuario?: string | null
          id?: number
        }
        Relationships: []
      }
      tp_genero_alumno: {
        Row: {
          created_at: string | null
          descripcion_genero_alumno: string | null
          id: number
          tipo_genero_alumno: number | null
        }
        Insert: {
          created_at?: string | null
          descripcion_genero_alumno?: string | null
          id: number
          tipo_genero_alumno?: number | null
        }
        Update: {
          created_at?: string | null
          descripcion_genero_alumno?: string | null
          id?: number
          tipo_genero_alumno?: number | null
        }
        Relationships: []
      }
      tp_jornada_alumno: {
        Row: {
          created_at: string | null
          descripcion_jornada: string | null
          id: number
          tipo_jornada: number | null
        }
        Insert: {
          created_at?: string | null
          descripcion_jornada?: string | null
          id: number
          tipo_jornada?: number | null
        }
        Update: {
          created_at?: string | null
          descripcion_jornada?: string | null
          id?: number
          tipo_jornada?: number | null
        }
        Relationships: []
      }
      tp_nacionalidad_alumno: {
        Row: {
          created_at: string | null
          descripcion_nacionalidad: string
          id: number
          tipo_nacionalidad: number
        }
        Insert: {
          created_at?: string | null
          descripcion_nacionalidad: string
          id: number
          tipo_nacionalidad: number
        }
        Update: {
          created_at?: string | null
          descripcion_nacionalidad?: string
          id?: number
          tipo_nacionalidad?: number
        }
        Relationships: []
      }
      tp_nivel_educacional_padres: {
        Row: {
          created_at: string | null
          descripcion_educacion: string | null
          id: number
          tipo_educacion: number | null
        }
        Insert: {
          created_at?: string | null
          descripcion_educacion?: string | null
          id: number
          tipo_educacion?: number | null
        }
        Update: {
          created_at?: string | null
          descripcion_educacion?: string | null
          id?: number
          tipo_educacion?: number | null
        }
        Relationships: []
      }
      tp_niveles: {
        Row: {
          created_at: string | null
          id: number
          nivel_nombre_alternativo: string | null
          nombre_nivel: string
          numero_nivel: number
          sigla_nivel: string | null
        }
        Insert: {
          created_at?: string | null
          id: number
          nivel_nombre_alternativo?: string | null
          nombre_nivel: string
          numero_nivel: number
          sigla_nivel?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          nivel_nombre_alternativo?: string | null
          nombre_nivel?: string
          numero_nivel?: number
          sigla_nivel?: string | null
        }
        Relationships: []
      }
      tp_parentezco_alumno: {
        Row: {
          created_at: string | null
          descripcion_parentezco_alumno: string | null
          id: number
          tipo_parentezco_alumno: number | null
        }
        Insert: {
          created_at?: string | null
          descripcion_parentezco_alumno?: string | null
          id: number
          tipo_parentezco_alumno?: number | null
        }
        Update: {
          created_at?: string | null
          descripcion_parentezco_alumno?: string | null
          id?: number
          tipo_parentezco_alumno?: number | null
        }
        Relationships: []
      }
      tp_perfil_establecimiento: {
        Row: {
          codigo_perfil: number
          created_at: string | null
          descripcion_perfil: string | null
          id: number
        }
        Insert: {
          codigo_perfil: number
          created_at?: string | null
          descripcion_perfil?: string | null
          id: number
        }
        Update: {
          codigo_perfil?: number
          created_at?: string | null
          descripcion_perfil?: string | null
          id?: number
        }
        Relationships: []
      }
      tp_perfil_usuario: {
        Row: {
          codigo_perfil_usuario: number | null
          created_at: string | null
          descripcion_perfil_usuario: string | null
          id: number | null
        }
        Insert: {
          codigo_perfil_usuario?: number | null
          created_at?: string | null
          descripcion_perfil_usuario?: string | null
          id?: number | null
        }
        Update: {
          codigo_perfil_usuario?: number | null
          created_at?: string | null
          descripcion_perfil_usuario?: string | null
          id?: number | null
        }
        Relationships: []
      }
      tp_problemas_aprendizaje: {
        Row: {
          created_at: string | null
          descripcion_problema_aprendizaje: string | null
          id: number
          tipo_problema_aprendizaje: number | null
        }
        Insert: {
          created_at?: string | null
          descripcion_problema_aprendizaje?: string | null
          id: number
          tipo_problema_aprendizaje?: number | null
        }
        Update: {
          created_at?: string | null
          descripcion_problema_aprendizaje?: string | null
          id?: number
          tipo_problema_aprendizaje?: number | null
        }
        Relationships: []
      }
      tp_procedencia_alumno: {
        Row: {
          created_at: string | null
          descripcion_procedencia: string | null
          id: number
          tipo_procedencia: number | null
        }
        Insert: {
          created_at?: string | null
          descripcion_procedencia?: string | null
          id: number
          tipo_procedencia?: number | null
        }
        Update: {
          created_at?: string | null
          descripcion_procedencia?: string | null
          id?: number
          tipo_procedencia?: number | null
        }
        Relationships: []
      }
      tp_pueblo_originario: {
        Row: {
          created_at: string | null
          descripcion_pertenece: string | null
          id: number
          tipo_pueblo_originario: number | null
        }
        Insert: {
          created_at?: string | null
          descripcion_pertenece?: string | null
          id: number
          tipo_pueblo_originario?: number | null
        }
        Update: {
          created_at?: string | null
          descripcion_pertenece?: string | null
          id?: number
          tipo_pueblo_originario?: number | null
        }
        Relationships: []
      }
      tp_regiones_comunas_chile: {
        Row: {
          codigo_comuna: number | null
          codigo_provincia: number | null
          codigo_region: number | null
          id: number
          nombre_comuna: string | null
          nombre_provincia: string | null
          nombre_region: string | null
        }
        Insert: {
          codigo_comuna?: number | null
          codigo_provincia?: number | null
          codigo_region?: number | null
          id: number
          nombre_comuna?: string | null
          nombre_provincia?: string | null
          nombre_region?: string | null
        }
        Update: {
          codigo_comuna?: number | null
          codigo_provincia?: number | null
          codigo_region?: number | null
          id?: number
          nombre_comuna?: string | null
          nombre_provincia?: string | null
          nombre_region?: string | null
        }
        Relationships: []
      }
      tp_situacion_social: {
        Row: {
          created_at: string | null
          descripcion_situacion_social: string | null
          id: number
          tipo_situacion_social: number | null
        }
        Insert: {
          created_at?: string | null
          descripcion_situacion_social?: string | null
          id: number
          tipo_situacion_social?: number | null
        }
        Update: {
          created_at?: string | null
          descripcion_situacion_social?: string | null
          id?: number
          tipo_situacion_social?: number | null
        }
        Relationships: []
      }
      tp_tipo_tel: {
        Row: {
          created_at: string | null
          descripcion_tel: string | null
          id: number
          tipo_tel: number | null
        }
        Insert: {
          created_at?: string | null
          descripcion_tel?: string | null
          id: number
          tipo_tel?: number | null
        }
        Update: {
          created_at?: string | null
          descripcion_tel?: string | null
          id?: number
          tipo_tel?: number | null
        }
        Relationships: []
      }
      tp_vive_con: {
        Row: {
          created_at: string | null
          descripcion_vive_con: string | null
          id: number
          tipo_vive_con: number | null
        }
        Insert: {
          created_at?: string | null
          descripcion_vive_con?: string | null
          id: number
          tipo_vive_con?: number | null
        }
        Update: {
          created_at?: string | null
          descripcion_vive_con?: string | null
          id?: number
          tipo_vive_con?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      view_asistencias_realizadas: {
        Row: {
          curso: string | null
          dia: string | null
          hora: string | null
          razon_social: string | null
          rbd: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mv_asistencia_diaria_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_asistencia_diaria_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "view_panel_administracion_resumen_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_asistencia_diaria_rbd_fkey"
            columns: ["rbd"]
            isOneToOne: false
            referencedRelation: "view_profesor_curso"
            referencedColumns: ["rbd"]
          },
        ]
      }
      view_panel_administracion_resumen_establecimientos: {
        Row: {
          cursos: number | null
          matriculas: number | null
          razon_social: string | null
          rbd: number | null
        }
        Relationships: []
      }
      view_profesor_curso: {
        Row: {
          nombre_curso: string | null
          nombre_profesor: string | null
          rbd: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      actualizar_asistencia_mes: {
        Args: {
          asistencias: Json
        }
        Returns: number
      }
      actualizar_estado_alumno: {
        Args: {
          p_rut: string
          p_numero_matricula: number
          p_codigo_estado: number
          p_rut_modificador: string
          p_causa_retiro?: string
          p_fecha_retiro?: string
        }
        Returns: string
      }
      gestionar_pla_corto_plazo: {
        Args: {
          p_id_planificacion?: number
          p_rbd?: number
          p_nivel_planificacion?: string
          p_id_planificacion_mediano_plazo?: number
          p_recursos?: string
          p_instrumentos_evaluacion?: string
          p_inicio_desarrollo_cierre?: string
          p_estado_planificacion?: number
          p_anio?: number
          p_mes?: number
          p_dia?: number
          p_datos_codigos?: Json
          p_rut_usuario?: string
        }
        Returns: string
      }
      gestionar_pla_largo_plazo: {
        Args: {
          p_accion: string
          p_id_planificacion?: number
          p_anio?: number
          p_mes?: number
          p_dia?: number
          p_rbd?: number
          p_nivel_planificacion?: string
          p_descripcion?: string
          p_rut_usuario?: string
          p_estado?: number
          p_otp?: number
          p_respuesta_otp?: string
        }
        Returns: string
      }
      gestionar_pla_mediano_plazo: {
        Args: {
          p_id_planificacion?: number
          p_rbd?: number
          p_nivel_planificacion?: string
          p_proyecto_eje?: string
          p_anio?: number
          p_mes?: number
          p_dia?: number
          p_objetivos_generales?: string
          p_estrategias?: string
          p_cierre_proyecto?: string
          p_cantidad_semanas?: number
          p_fecha_inicio?: string
          p_estado_planificacion?: number
          p_datos_bases_curriculares?: Json
          p_rut_usuario?: string
        }
        Returns: string
      }
      prematricula_procesada: {
        Args: {
          input_rbd: number
        }
        Returns: Json
      }
      prematricula_procesada_json: {
        Args: {
          input_rbd: number
        }
        Returns: Json
      }
      registrar_o_modificar_asistencia: {
        Args: {
          p_id_asistencia?: number
          p_rbd?: number
          p_nivel_alumno?: string
          p_rut_alumno?: string
          p_anio?: number
          p_mes?: number
          p_dia?: number
          p_estado?: number
          p_otp_asistencia?: number
          p_respuesta_otp_asistencia?: string
          p_observacion_asistencia?: string
          p_rut_modificador?: string
          p_otp_modificador?: number
          p_respuesta_otp_modificador?: string
          p_observacion_modificacion?: string
        }
        Returns: string
      }
      resumen_asistencia_mes: {
        Args: {
          nivel_alumno_param: string
          year_param: number
          mes_param: number
        }
        Returns: Json
      }
      transaccion_prematricula: {
        Args: {
          rbd: number
          alumnos: Json
          usuario_ingreso: string
        }
        Returns: Json
      }
      transaccion_prematricula_pdf: {
        Args: {
          v_anio: number
          v_rbd: number
          v_rut_usuario: string
          v_rut_alumno: string
          v_nombre_completo: string
          v_nivel: string
          v_letra: string
          v_fecha_incorporacion: string
        }
        Returns: string
      }
      transaccion_prematricula_upsert: {
        Args: {
          rut: string
        }
        Returns: undefined
      }
      tx_asistencia_diaria: {
        Args: {
          rbd: number
          curso: string
          otp: number
          respuesta_otp: string
          alumnos: Json
          usuario_ingreso: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
