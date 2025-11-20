export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affaires_contentieuses: {
        Row: {
          created_at: string | null
          date_saisie: string | null
          date_validation: string | null
          donnees: Json
          id: string
          numero_affaire: string
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_saisie?: string | null
          date_validation?: string | null
          donnees?: Json
          id?: string
          numero_affaire: string
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_saisie?: string | null
          date_validation?: string | null
          donnees?: Json
          id?: string
          numero_affaire?: string
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bureaux: {
        Row: {
          adresse: string | null
          created_at: string | null
          id: string
          nom: string
          region_id: string | null
          updated_at: string | null
        }
        Insert: {
          adresse?: string | null
          created_at?: string | null
          id?: string
          nom: string
          region_id?: string | null
          updated_at?: string | null
        }
        Update: {
          adresse?: string | null
          created_at?: string | null
          id?: string
          nom?: string
          region_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bureaux_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      personnel: {
        Row: {
          created_at: string | null
          fonction: string
          id: string
          nom_complet: string
          region: string | null
          role: string
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fonction: string
          id?: string
          nom_complet: string
          region?: string | null
          role: string
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fonction?: string
          id?: string
          nom_complet?: string
          region?: string | null
          role?: string
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rapports_generes: {
        Row: {
          affaire_id: string
          created_at: string | null
          date_generation: string
          id: string
          rapports: Json
          updated_at: string | null
        }
        Insert: {
          affaire_id: string
          created_at?: string | null
          date_generation?: string
          id?: string
          rapports: Json
          updated_at?: string | null
        }
        Update: {
          affaire_id?: string
          created_at?: string | null
          date_generation?: string
          id?: string
          rapports?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rapports_generes_affaire_id_fkey"
            columns: ["affaire_id"]
            isOneToOne: false
            referencedRelation: "affaires_contentieuses"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          created_at: string | null
          id: string
          nom: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nom: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nom?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      regles_repartition: {
        Row: {
          conditions: Json | null
          created_at: string | null
          id: string
          pourcentage_base: number
          pourcentage_max: number
          type: string
          updated_at: string | null
        }
        Insert: {
          conditions?: Json | null
          created_at?: string | null
          id?: string
          pourcentage_base: number
          pourcentage_max: number
          type: string
          updated_at?: string | null
        }
        Update: {
          conditions?: Json | null
          created_at?: string | null
          id?: string
          pourcentage_base?: number
          pourcentage_max?: number
          type?: string
          updated_at?: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
