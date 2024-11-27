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
      mv_libro_matricula: {
        Row: {
          anio_libro: number
          apellidos_alumnos: string | null
          apoderado_tutor_alumno: string | null
          causa_retiro_alumno: string | null
          codigo_estado_alumno: number | null
          comuna_alumno: string | null
          created_at: string
          domicilio_alumno: string | null
          email_apoderado_alumno: string | null
          estado_alumno: string | null
          fecha_incorporacion_alumno: number | null
          fecha_nacimiento_alumno: number | null
          fecha_retiro_escuela: number | null
          fecha_ultima_modificacion: string | null
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
          problema_aprendizaje_alumno: string | null
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
          usuario_ultima_modificacion: string | null
          vive_con_alumno: string | null
        }
        Insert: {
          anio_libro: number
          apellidos_alumnos?: string | null
          apoderado_tutor_alumno?: string | null
          causa_retiro_alumno?: string | null
          codigo_estado_alumno?: number | null
          comuna_alumno?: string | null
          created_at?: string
          domicilio_alumno?: string | null
          email_apoderado_alumno?: string | null
          estado_alumno?: string | null
          fecha_incorporacion_alumno?: number | null
          fecha_nacimiento_alumno?: number | null
          fecha_retiro_escuela?: number | null
          fecha_ultima_modificacion?: string | null
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
          problema_aprendizaje_alumno?: string | null
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
          usuario_ultima_modificacion?: string | null
          vive_con_alumno?: string | null
        }
        Update: {
          anio_libro?: number
          apellidos_alumnos?: string | null
          apoderado_tutor_alumno?: string | null
          causa_retiro_alumno?: string | null
          codigo_estado_alumno?: number | null
          comuna_alumno?: string | null
          created_at?: string
          domicilio_alumno?: string | null
          email_apoderado_alumno?: string | null
          estado_alumno?: string | null
          fecha_incorporacion_alumno?: number | null
          fecha_nacimiento_alumno?: number | null
          fecha_retiro_escuela?: number | null
          fecha_ultima_modificacion?: string | null
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
          problema_aprendizaje_alumno?: string | null
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
          usuario_ultima_modificacion?: string | null
          vive_con_alumno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mv_libro_matricula_comuna_alumno_fkey"
            columns: ["comuna_alumno"]
            isOneToOne: false
            referencedRelation: "tp_regiones_comunas_chile"
            referencedColumns: ["nombre_comuna"]
          },
          {
            foreignKeyName: "mv_libro_matricula_jornada_alumno_fkey"
            columns: ["jornada_alumno"]
            isOneToOne: false
            referencedRelation: "tp_jornada_alumno"
            referencedColumns: ["descripcion_jornada"]
          },
          {
            foreignKeyName: "mv_libro_matricula_nacionalidad_alumno_fkey"
            columns: ["nacionalidad_alumno"]
            isOneToOne: false
            referencedRelation: "tp_nacionalidad_alumno"
            referencedColumns: ["descripcion_nacionalidad"]
          },
          {
            foreignKeyName: "mv_libro_matricula_nivel_educacional_madre_fkey"
            columns: ["nivel_educacional_madre"]
            isOneToOne: false
            referencedRelation: "tp_nivel_educacional_padres"
            referencedColumns: ["descripcion_educacion"]
          },
          {
            foreignKeyName: "mv_libro_matricula_nivel_educacional_padre_fkey"
            columns: ["nivel_educacional_padre"]
            isOneToOne: false
            referencedRelation: "tp_nivel_educacional_padres"
            referencedColumns: ["descripcion_educacion"]
          },
          {
            foreignKeyName: "mv_libro_matricula_parentezco_con_alumno_fkey"
            columns: ["parentezco_con_alumno"]
            isOneToOne: false
            referencedRelation: "tp_parentezco_alumno"
            referencedColumns: ["descripcion_parentezco_alumno"]
          },
          {
            foreignKeyName: "mv_libro_matricula_problema_aprendizaje_alumno_fkey"
            columns: ["problema_aprendizaje_alumno"]
            isOneToOne: false
            referencedRelation: "tp_problemas_aprendizaje"
            referencedColumns: ["descripcion_problema_aprendizaje"]
          },
          {
            foreignKeyName: "mv_libro_matricula_procedencia_alumno_fkey"
            columns: ["procedencia_alumno"]
            isOneToOne: false
            referencedRelation: "tp_procedencia_alumno"
            referencedColumns: ["descripcion_procedencia"]
          },
          {
            foreignKeyName: "mv_libro_matricula_pueblo_originario_alumno_fkey"
            columns: ["pueblo_originario_alumno"]
            isOneToOne: false
            referencedRelation: "tp_pueblo_originario"
            referencedColumns: ["descripcion_pertenece"]
          },
          {
            foreignKeyName: "mv_libro_matricula_rbd_establecimiento_fkey"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_libro_matricula_rbd_establecimiento_fkey1"
            columns: ["rbd_establecimiento"]
            isOneToOne: false
            referencedRelation: "tp_establecimientos"
            referencedColumns: ["rbd"]
          },
          {
            foreignKeyName: "mv_libro_matricula_sexo_alumno_fkey"
            columns: ["sexo_alumno"]
            isOneToOne: false
            referencedRelation: "tp_genero_alumno"
            referencedColumns: ["descripcion_genero_alumno"]
          },
          {
            foreignKeyName: "mv_libro_matricula_situacion_social_alumno_fkey"
            columns: ["situacion_social_alumno"]
            isOneToOne: false
            referencedRelation: "tp_situacion_social"
            referencedColumns: ["descripcion_situacion_social"]
          },
          {
            foreignKeyName: "mv_libro_matricula_tipo_tel_alumno_fkey"
            columns: ["tipo_tel_alumno"]
            isOneToOne: false
            referencedRelation: "tp_tipo_tel"
            referencedColumns: ["descripcion_tel"]
          },
          {
            foreignKeyName: "mv_libro_matricula_vive_con_alumno_fkey"
            columns: ["vive_con_alumno"]
            isOneToOne: false
            referencedRelation: "tp_vive_con"
            referencedColumns: ["descripcion_vive_con"]
          },
        ]
      }
      tp_cursos: {
        Row: {
          anio_curso: number | null
          created_at: string
          id: number
          letra_nivel_curso: string
          rbd_establecimiento: number
          sigla_nivel_curso: string
        }
        Insert: {
          anio_curso?: number | null
          created_at?: string
          id?: number
          letra_nivel_curso: string
          rbd_establecimiento: number
          sigla_nivel_curso: string
        }
        Update: {
          anio_curso?: number | null
          created_at?: string
          id?: number
          letra_nivel_curso?: string
          rbd_establecimiento?: number
          sigla_nivel_curso?: string
        }
        Relationships: []
      }
      tp_establecimientos: {
        Row: {
          codigo_perfil: number
          create_at: string
          id: number
          nombre_corto: string
          razon_social: string
          rbd: number
        }
        Insert: {
          codigo_perfil: number
          create_at?: string
          id?: number
          nombre_corto: string
          razon_social: string
          rbd: number
        }
        Update: {
          codigo_perfil?: number
          create_at?: string
          id?: number
          nombre_corto?: string
          razon_social?: string
          rbd?: number
        }
        Relationships: [
          {
            foreignKeyName: "tp_establecimientos_codigo_perfil_fkey"
            columns: ["codigo_perfil"]
            isOneToOne: false
            referencedRelation: "tp_perfil_establecimiento"
            referencedColumns: ["codigo_perfil"]
          },
        ]
      }
      tp_genero_alumno: {
        Row: {
          created_at: string
          descripcion_genero_alumno: string
          id: number
          tipo_genero_alumno: number
        }
        Insert: {
          created_at?: string
          descripcion_genero_alumno: string
          id?: number
          tipo_genero_alumno: number
        }
        Update: {
          created_at?: string
          descripcion_genero_alumno?: string
          id?: number
          tipo_genero_alumno?: number
        }
        Relationships: []
      }
      tp_jornada_alumno: {
        Row: {
          created_at: string
          descripcion_jornada: string
          id: number
          tipo_jornada: number
        }
        Insert: {
          created_at?: string
          descripcion_jornada: string
          id?: number
          tipo_jornada: number
        }
        Update: {
          created_at?: string
          descripcion_jornada?: string
          id?: number
          tipo_jornada?: number
        }
        Relationships: []
      }
      tp_nacionalidad_alumno: {
        Row: {
          created_at: string
          descripcion_nacionalidad: string
          id: number
          tipo_nacionalidad: number
        }
        Insert: {
          created_at?: string
          descripcion_nacionalidad: string
          id?: number
          tipo_nacionalidad?: number
        }
        Update: {
          created_at?: string
          descripcion_nacionalidad?: string
          id?: number
          tipo_nacionalidad?: number
        }
        Relationships: []
      }
      tp_nivel_educacional_padres: {
        Row: {
          created_at: string
          descripcion_educacion: string
          id: number
          tipo_educacion: number
        }
        Insert: {
          created_at?: string
          descripcion_educacion: string
          id?: number
          tipo_educacion: number
        }
        Update: {
          created_at?: string
          descripcion_educacion?: string
          id?: number
          tipo_educacion?: number
        }
        Relationships: []
      }
      tp_niveles: {
        Row: {
          created_at: string
          id: number
          nivel_nombre_alternativo: string
          nombre_nivel: string | null
          numero_nivel: number
          sigla_nivel: string
        }
        Insert: {
          created_at?: string
          id?: number
          nivel_nombre_alternativo: string
          nombre_nivel?: string | null
          numero_nivel: number
          sigla_nivel: string
        }
        Update: {
          created_at?: string
          id?: number
          nivel_nombre_alternativo?: string
          nombre_nivel?: string | null
          numero_nivel?: number
          sigla_nivel?: string
        }
        Relationships: []
      }
      tp_parentezco_alumno: {
        Row: {
          created_at: string
          descripcion_parentezco_alumno: string
          id: number
          tipo_parentezco_alumno: number
        }
        Insert: {
          created_at?: string
          descripcion_parentezco_alumno: string
          id?: number
          tipo_parentezco_alumno: number
        }
        Update: {
          created_at?: string
          descripcion_parentezco_alumno?: string
          id?: number
          tipo_parentezco_alumno?: number
        }
        Relationships: []
      }
      tp_perfil_establecimiento: {
        Row: {
          codigo_perfil: number
          created_at: string
          descripcion_perfil: string
          id: number
        }
        Insert: {
          codigo_perfil: number
          created_at?: string
          descripcion_perfil: string
          id?: number
        }
        Update: {
          codigo_perfil?: number
          created_at?: string
          descripcion_perfil?: string
          id?: number
        }
        Relationships: []
      }
      tp_problemas_aprendizaje: {
        Row: {
          created_at: string
          descripcion_problema_aprendizaje: string
          id: number
          tipo_problema_aprendizaje: number
        }
        Insert: {
          created_at?: string
          descripcion_problema_aprendizaje: string
          id?: number
          tipo_problema_aprendizaje: number
        }
        Update: {
          created_at?: string
          descripcion_problema_aprendizaje?: string
          id?: number
          tipo_problema_aprendizaje?: number
        }
        Relationships: []
      }
      tp_procedencia_alumno: {
        Row: {
          created_at: string
          descripcion_procedencia: string
          id: number
          tipo_procedencia: number
        }
        Insert: {
          created_at?: string
          descripcion_procedencia: string
          id?: number
          tipo_procedencia: number
        }
        Update: {
          created_at?: string
          descripcion_procedencia?: string
          id?: number
          tipo_procedencia?: number
        }
        Relationships: []
      }
      tp_pueblo_originario: {
        Row: {
          created_at: string
          descripcion_pertenece: string
          id: number
          tipo_pueblo_originario: number
        }
        Insert: {
          created_at?: string
          descripcion_pertenece: string
          id?: number
          tipo_pueblo_originario: number
        }
        Update: {
          created_at?: string
          descripcion_pertenece?: string
          id?: number
          tipo_pueblo_originario?: number
        }
        Relationships: []
      }
      tp_regiones_comunas_chile: {
        Row: {
          codigo_comuna: number
          codigo_provincia: number
          codigo_region: number
          id: number
          nombre_comuna: string
          nombre_provincia: string
          nombre_region: string
        }
        Insert: {
          codigo_comuna: number
          codigo_provincia: number
          codigo_region: number
          id?: number
          nombre_comuna: string
          nombre_provincia: string
          nombre_region: string
        }
        Update: {
          codigo_comuna?: number
          codigo_provincia?: number
          codigo_region?: number
          id?: number
          nombre_comuna?: string
          nombre_provincia?: string
          nombre_region?: string
        }
        Relationships: []
      }
      tp_situacion_social: {
        Row: {
          created_at: string
          descripcion_situacion_social: string
          id: number
          tipo_situacion_social: number
        }
        Insert: {
          created_at?: string
          descripcion_situacion_social: string
          id?: number
          tipo_situacion_social: number
        }
        Update: {
          created_at?: string
          descripcion_situacion_social?: string
          id?: number
          tipo_situacion_social?: number
        }
        Relationships: []
      }
      tp_tipo_tel: {
        Row: {
          created_at: string
          descripcion_tel: string
          id: number
          tipo_tel: number
        }
        Insert: {
          created_at?: string
          descripcion_tel: string
          id?: number
          tipo_tel: number
        }
        Update: {
          created_at?: string
          descripcion_tel?: string
          id?: number
          tipo_tel?: number
        }
        Relationships: []
      }
      tp_vive_con: {
        Row: {
          created_at: string
          descripcion_vive_con: string
          id: number
          tipo_vive_con: number
        }
        Insert: {
          created_at?: string
          descripcion_vive_con: string
          id?: number
          tipo_vive_con: number
        }
        Update: {
          created_at?: string
          descripcion_vive_con?: string
          id?: number
          tipo_vive_con?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
