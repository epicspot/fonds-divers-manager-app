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
      bureaux: {
        Row: {
          created_at: string | null
          id: string
          nom: string
          region_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nom: string
          region_id?: string | null
          updated_at?: string | null
        }
        Update: {
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
      documents: {
        Row: {
          created_at: string | null
          created_by: string | null
          date_ajout: string | null
          dossier_id: string | null
          id: string
          nom: string
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date_ajout?: string | null
          dossier_id?: string | null
          id?: string
          nom: string
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date_ajout?: string | null
          dossier_id?: string | null
          id?: string
          nom?: string
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
        ]
      }
      dossier_personnel: {
        Row: {
          created_at: string | null
          dossier_id: string | null
          id: string
          personnel_id: string | null
          role: Database["public"]["Enums"]["personnel_role"]
        }
        Insert: {
          created_at?: string | null
          dossier_id?: string | null
          id?: string
          personnel_id?: string | null
          role: Database["public"]["Enums"]["personnel_role"]
        }
        Update: {
          created_at?: string | null
          dossier_id?: string | null
          id?: string
          personnel_id?: string | null
          role?: Database["public"]["Enums"]["personnel_role"]
        }
        Relationships: [
          {
            foreignKeyName: "dossier_personnel_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dossier_personnel_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          },
        ]
      }
      dossiers: {
        Row: {
          adresse_complete: string
          bureau: string
          circonstances: string
          commissionnaire_duane: string
          created_at: string | null
          created_by: string | null
          date_affaire: string
          date_creation: string
          date_declaration: string | null
          date_quittance: string | null
          date_quittance_amende: string | null
          droits_compromis: string
          id: string
          identification_mt: string
          ifu: string
          montant_amende: number | null
          montant_total_frais: number | null
          nature_infraction: string
          nature_marchandises: string
          nature_transport: string
          nom_prenom_contrevenant: string
          num_affaire: string
          num_declaration: string | null
          num_quittance: string | null
          num_quittance_amende: string | null
          numero_reference: string
          origine: string
          procede_detection: string
          produit_net: number | null
          region: string
          statut: Database["public"]["Enums"]["dossier_status"]
          updated_at: string | null
          updated_by: string | null
          valeur_marchandises: number
        }
        Insert: {
          adresse_complete: string
          bureau: string
          circonstances: string
          commissionnaire_duane: string
          created_at?: string | null
          created_by?: string | null
          date_affaire: string
          date_creation?: string
          date_declaration?: string | null
          date_quittance?: string | null
          date_quittance_amende?: string | null
          droits_compromis: string
          id?: string
          identification_mt: string
          ifu: string
          montant_amende?: number | null
          montant_total_frais?: number | null
          nature_infraction: string
          nature_marchandises: string
          nature_transport: string
          nom_prenom_contrevenant: string
          num_affaire: string
          num_declaration?: string | null
          num_quittance?: string | null
          num_quittance_amende?: string | null
          numero_reference: string
          origine: string
          procede_detection: string
          produit_net?: number | null
          region: string
          statut?: Database["public"]["Enums"]["dossier_status"]
          updated_at?: string | null
          updated_by?: string | null
          valeur_marchandises: number
        }
        Update: {
          adresse_complete?: string
          bureau?: string
          circonstances?: string
          commissionnaire_duane?: string
          created_at?: string | null
          created_by?: string | null
          date_affaire?: string
          date_creation?: string
          date_declaration?: string | null
          date_quittance?: string | null
          date_quittance_amende?: string | null
          droits_compromis?: string
          id?: string
          identification_mt?: string
          ifu?: string
          montant_amende?: number | null
          montant_total_frais?: number | null
          nature_infraction?: string
          nature_marchandises?: string
          nature_transport?: string
          nom_prenom_contrevenant?: string
          num_affaire?: string
          num_declaration?: string | null
          num_quittance?: string | null
          num_quittance_amende?: string | null
          numero_reference?: string
          origine?: string
          procede_detection?: string
          produit_net?: number | null
          region?: string
          statut?: Database["public"]["Enums"]["dossier_status"]
          updated_at?: string | null
          updated_by?: string | null
          valeur_marchandises?: number
        }
        Relationships: []
      }
      personnel: {
        Row: {
          created_at: string | null
          fonction: string
          id: string
          nom_complet: string
          role: Database["public"]["Enums"]["personnel_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fonction: string
          id?: string
          nom_complet: string
          role: Database["public"]["Enums"]["personnel_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fonction?: string
          id?: string
          nom_complet?: string
          role?: Database["public"]["Enums"]["personnel_role"]
          updated_at?: string | null
        }
        Relationships: []
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
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string | null
          role_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "user_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          code: string
          created_at: string | null
          description: string
          id: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_role_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          description: string
          id: string
          role: Database["public"]["Enums"]["system_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          role: Database["public"]["Enums"]["system_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          role?: Database["public"]["Enums"]["system_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_permission: {
        Args: { user_id: string; permission_code: string }
        Returns: boolean
      }
    }
    Enums: {
      document_type: "Declaration" | "Facture" | "Certificat" | "Autre"
      dossier_status: "En cours" | "Terminé" | "En attente"
      personnel_role: "chef" | "saisissant" | "intervenant"
      system_role:
        | "admin_systeme"
        | "administrateur"
        | "directeur_regional"
        | "chef_subdivision"
        | "caissier"
        | "operateur_saisie"
        | "ratificateur"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_type: ["Declaration", "Facture", "Certificat", "Autre"],
      dossier_status: ["En cours", "Terminé", "En attente"],
      personnel_role: ["chef", "saisissant", "intervenant"],
      system_role: [
        "admin_systeme",
        "administrateur",
        "directeur_regional",
        "chef_subdivision",
        "caissier",
        "operateur_saisie",
        "ratificateur",
      ],
    },
  },
} as const
