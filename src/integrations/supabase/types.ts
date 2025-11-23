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
      actions_suivi: {
        Row: {
          affaire_id: string
          commentaire: string | null
          created_at: string | null
          date_action: string
          date_echeance: string | null
          delai_prevu: number | null
          id: string
          statut_apres: string | null
          statut_avant: string | null
          type: string
          utilisateur: string
        }
        Insert: {
          affaire_id: string
          commentaire?: string | null
          created_at?: string | null
          date_action?: string
          date_echeance?: string | null
          delai_prevu?: number | null
          id?: string
          statut_apres?: string | null
          statut_avant?: string | null
          type: string
          utilisateur: string
        }
        Update: {
          affaire_id?: string
          commentaire?: string | null
          created_at?: string | null
          date_action?: string
          date_echeance?: string | null
          delai_prevu?: number | null
          id?: string
          statut_apres?: string | null
          statut_avant?: string | null
          type?: string
          utilisateur?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_suivi_affaire_id_fkey"
            columns: ["affaire_id"]
            isOneToOne: false
            referencedRelation: "affaires_contentieuses"
            referencedColumns: ["id"]
          },
        ]
      }
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
      approbations_repartition: {
        Row: {
          action: string
          commentaire: string | null
          created_at: string | null
          date_action: string
          id: string
          niveau_validation: number
          repartition_id: string
          updated_at: string | null
          validateur_id: string
        }
        Insert: {
          action: string
          commentaire?: string | null
          created_at?: string | null
          date_action?: string
          id?: string
          niveau_validation: number
          repartition_id: string
          updated_at?: string | null
          validateur_id: string
        }
        Update: {
          action?: string
          commentaire?: string | null
          created_at?: string | null
          date_action?: string
          id?: string
          niveau_validation?: number
          repartition_id?: string
          updated_at?: string | null
          validateur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approbations_repartition_repartition_id_fkey"
            columns: ["repartition_id"]
            isOneToOne: false
            referencedRelation: "historique_repartitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approbations_repartition_validateur_id_fkey"
            columns: ["validateur_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          anciennes_valeurs: Json | null
          created_at: string
          details: string | null
          entite_id: string | null
          entite_nom: string | null
          id: string
          ip_address: string | null
          nouvelles_valeurs: Json | null
          type_entite: string
          user_agent: string | null
          utilisateur_email: string
          utilisateur_id: string | null
        }
        Insert: {
          action: string
          anciennes_valeurs?: Json | null
          created_at?: string
          details?: string | null
          entite_id?: string | null
          entite_nom?: string | null
          id?: string
          ip_address?: string | null
          nouvelles_valeurs?: Json | null
          type_entite: string
          user_agent?: string | null
          utilisateur_email: string
          utilisateur_id?: string | null
        }
        Update: {
          action?: string
          anciennes_valeurs?: Json | null
          created_at?: string
          details?: string | null
          entite_id?: string | null
          entite_nom?: string | null
          id?: string
          ip_address?: string | null
          nouvelles_valeurs?: Json | null
          type_entite?: string
          user_agent?: string | null
          utilisateur_email?: string
          utilisateur_id?: string | null
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
      configurations_bureau: {
        Row: {
          bureau_nom: string
          created_at: string | null
          id: string
          region: string | null
          updated_at: string | null
          valeurs_defaut: Json
        }
        Insert: {
          bureau_nom: string
          created_at?: string | null
          id?: string
          region?: string | null
          updated_at?: string | null
          valeurs_defaut?: Json
        }
        Update: {
          bureau_nom?: string
          created_at?: string | null
          id?: string
          region?: string | null
          updated_at?: string | null
          valeurs_defaut?: Json
        }
        Relationships: []
      }
      configurations_systeme: {
        Row: {
          cle: string
          created_at: string | null
          description: string | null
          id: string
          updated_at: string | null
          valeur: Json
        }
        Insert: {
          cle: string
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          valeur?: Json
        }
        Update: {
          cle?: string
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          valeur?: Json
        }
        Relationships: []
      }
      configurations_validation: {
        Row: {
          created_at: string | null
          description: string | null
          est_actif: boolean
          id: string
          nom: string
          regles: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          est_actif?: boolean
          id?: string
          nom: string
          regles?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          est_actif?: boolean
          id?: string
          nom?: string
          regles?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      historique_repartitions: {
        Row: {
          affaire_id: string | null
          ayants_droits: Json
          created_at: string
          date_repartition: string
          erreurs: Json | null
          id: string
          montant_net: number
          montant_total: number
          numero_affaire: string | null
          parametres: Json
          part_fonds_equipement: number
          part_fonds_formation: number
          part_fonds_solidarite: number
          part_fsp: number
          part_mutuelle: number
          part_prime_rendement: number
          part_tresor: number
          statut_validation: string | null
          updated_at: string
          utilisateur: string | null
          verifications_ok: boolean
        }
        Insert: {
          affaire_id?: string | null
          ayants_droits?: Json
          created_at?: string
          date_repartition?: string
          erreurs?: Json | null
          id?: string
          montant_net: number
          montant_total: number
          numero_affaire?: string | null
          parametres?: Json
          part_fonds_equipement: number
          part_fonds_formation: number
          part_fonds_solidarite: number
          part_fsp: number
          part_mutuelle: number
          part_prime_rendement: number
          part_tresor: number
          statut_validation?: string | null
          updated_at?: string
          utilisateur?: string | null
          verifications_ok?: boolean
        }
        Update: {
          affaire_id?: string | null
          ayants_droits?: Json
          created_at?: string
          date_repartition?: string
          erreurs?: Json | null
          id?: string
          montant_net?: number
          montant_total?: number
          numero_affaire?: string | null
          parametres?: Json
          part_fonds_equipement?: number
          part_fonds_formation?: number
          part_fonds_solidarite?: number
          part_fsp?: number
          part_mutuelle?: number
          part_prime_rendement?: number
          part_tresor?: number
          statut_validation?: string | null
          updated_at?: string
          utilisateur?: string | null
          verifications_ok?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "historique_repartitions_affaire_id_fkey"
            columns: ["affaire_id"]
            isOneToOne: false
            referencedRelation: "affaires_contentieuses"
            referencedColumns: ["id"]
          },
        ]
      }
      modeles_rapports: {
        Row: {
          configuration: Json
          created_at: string | null
          est_defaut: boolean | null
          id: string
          nom: string
          type_rapport: string
          updated_at: string | null
        }
        Insert: {
          configuration?: Json
          created_at?: string | null
          est_defaut?: boolean | null
          id?: string
          nom: string
          type_rapport: string
          updated_at?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          est_defaut?: boolean | null
          id?: string
          nom?: string
          type_rapport?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      profiles: {
        Row: {
          bureau_id: string | null
          created_at: string | null
          fonction: string | null
          id: string
          is_active: boolean
          nom_complet: string | null
          region_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bureau_id?: string | null
          created_at?: string | null
          fonction?: string | null
          id?: string
          is_active?: boolean
          nom_complet?: string | null
          region_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bureau_id?: string | null
          created_at?: string | null
          fonction?: string | null
          id?: string
          is_active?: boolean
          nom_complet?: string | null
          region_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_bureau_id_fkey"
            columns: ["bureau_id"]
            isOneToOne: false
            referencedRelation: "bureaux"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
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
      reference_lists: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
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
      suggestions_events: {
        Row: {
          action: string
          bureau_nom: string
          confidence: string
          context_data: Json | null
          created_at: string | null
          field_name: string
          id: string
          region: string | null
          source: string
          suggested_value: Json
        }
        Insert: {
          action: string
          bureau_nom: string
          confidence: string
          context_data?: Json | null
          created_at?: string | null
          field_name: string
          id?: string
          region?: string | null
          source: string
          suggested_value: Json
        }
        Update: {
          action?: string
          bureau_nom?: string
          confidence?: string
          context_data?: Json | null
          created_at?: string | null
          field_name?: string
          id?: string
          region?: string | null
          source?: string
          suggested_value?: Json
        }
        Relationships: []
      }
      suggestions_insights: {
        Row: {
          based_on_events_count: number
          bureau_nom: string | null
          confidence_score: number | null
          created_at: string | null
          field_name: string
          id: string
          insight_data: Json
          insight_type: string
          updated_at: string | null
        }
        Insert: {
          based_on_events_count?: number
          bureau_nom?: string | null
          confidence_score?: number | null
          created_at?: string | null
          field_name: string
          id?: string
          insight_data: Json
          insight_type: string
          updated_at?: string | null
        }
        Update: {
          based_on_events_count?: number
          bureau_nom?: string | null
          confidence_score?: number | null
          created_at?: string | null
          field_name?: string
          id?: string
          insight_data?: Json
          insight_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_old_audit_logs: { Args: never; Returns: undefined }
      get_user_primary_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_superviseur: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "superviseur" | "utilisateur"
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
    Enums: {
      app_role: ["admin", "superviseur", "utilisateur"],
    },
  },
} as const
