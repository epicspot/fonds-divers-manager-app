import { supabase } from "@/integrations/supabase/client";

export interface ConfigurationModele {
  enTete?: {
    titre?: string;
    sousTitre?: string;
    logo?: string;
    couleurFond?: string;
    couleurTexte?: string;
  };
  piedPage?: {
    texte?: string;
    afficherNumeroPage?: boolean;
    afficherDate?: boolean;
  };
  miseEnPage?: {
    marges?: {
      haut?: number;
      bas?: number;
      gauche?: number;
      droite?: number;
    };
    police?: string;
    taillePolice?: number;
    couleurPrincipale?: string;
    couleurSecondaire?: string;
  };
  sections?: {
    afficherLogo?: boolean;
    afficherEntete?: boolean;
    afficherSignature?: boolean;
    afficherCachet?: boolean;
  };
}

export interface ModeleRapport {
  id: string;
  nom: string;
  typeRapport: string;
  configuration: ConfigurationModele;
  estDefaut: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Récupère tous les modèles de rapports
 */
export const getModelesRapports = async (): Promise<ModeleRapport[]> => {
  const { data, error } = await supabase
    .from("modeles_rapports")
    .select("*")
    .order("est_defaut", { ascending: false })
    .order("nom");

  if (error) throw error;

  return data.map(row => ({
    id: row.id,
    nom: row.nom,
    typeRapport: row.type_rapport,
    configuration: row.configuration as ConfigurationModele,
    estDefaut: row.est_defaut,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
};

/**
 * Récupère un modèle spécifique par ID
 */
export const getModeleRapport = async (id: string): Promise<ModeleRapport | null> => {
  const { data, error } = await supabase
    .from("modeles_rapports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    nom: data.nom,
    typeRapport: data.type_rapport,
    configuration: data.configuration as ConfigurationModele,
    estDefaut: data.est_defaut,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Récupère le modèle par défaut pour un type de rapport
 */
export const getModeleParDefaut = async (typeRapport: string): Promise<ModeleRapport | null> => {
  const { data, error } = await supabase
    .from("modeles_rapports")
    .select("*")
    .eq("type_rapport", typeRapport)
    .eq("est_defaut", true)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;

  return {
    id: data.id,
    nom: data.nom,
    typeRapport: data.type_rapport,
    configuration: data.configuration as ConfigurationModele,
    estDefaut: data.est_defaut,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Crée un nouveau modèle
 */
export const creerModeleRapport = async (
  modele: Omit<ModeleRapport, "id" | "created_at" | "updated_at">
): Promise<ModeleRapport> => {
  // Si le modèle est défini comme défaut, retirer le défaut des autres
  if (modele.estDefaut) {
    await supabase
      .from("modeles_rapports")
      .update({ est_defaut: false })
      .eq("type_rapport", modele.typeRapport);
  }

  const { data, error } = await supabase
    .from("modeles_rapports")
    .insert([{
      nom: modele.nom,
      type_rapport: modele.typeRapport,
      configuration: modele.configuration as any,
      est_defaut: modele.estDefaut,
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nom: data.nom,
    typeRapport: data.type_rapport,
    configuration: data.configuration as ConfigurationModele,
    estDefaut: data.est_defaut,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Met à jour un modèle existant
 */
export const updateModeleRapport = async (
  id: string,
  updates: Partial<Omit<ModeleRapport, "id" | "created_at" | "updated_at">>
): Promise<ModeleRapport> => {
  // Si le modèle devient défaut, retirer le défaut des autres
  if (updates.estDefaut) {
    const modele = await getModeleRapport(id);
    if (modele) {
      await supabase
        .from("modeles_rapports")
        .update({ est_defaut: false })
        .eq("type_rapport", modele.typeRapport)
        .neq("id", id);
    }
  }

  const updateData: any = {};
  if (updates.nom !== undefined) updateData.nom = updates.nom;
  if (updates.typeRapport !== undefined) updateData.type_rapport = updates.typeRapport;
  if (updates.configuration !== undefined) updateData.configuration = updates.configuration as any;
  if (updates.estDefaut !== undefined) updateData.est_defaut = updates.estDefaut;

  const { data, error } = await supabase
    .from("modeles_rapports")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nom: data.nom,
    typeRapport: data.type_rapport,
    configuration: data.configuration as ConfigurationModele,
    estDefaut: data.est_defaut,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

/**
 * Supprime un modèle
 */
export const deleteModeleRapport = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("modeles_rapports")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

/**
 * Définit un modèle comme défaut pour son type
 */
export const setModeleParDefaut = async (id: string): Promise<void> => {
  const modele = await getModeleRapport(id);
  if (!modele) throw new Error("Modèle non trouvé");

  // Retirer le défaut des autres modèles du même type
  await supabase
    .from("modeles_rapports")
    .update({ est_defaut: false })
    .eq("type_rapport", modele.typeRapport);

  // Définir ce modèle comme défaut
  await supabase
    .from("modeles_rapports")
    .update({ est_defaut: true })
    .eq("id", id);
};
