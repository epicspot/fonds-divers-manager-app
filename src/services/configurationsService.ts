import { supabase } from "@/integrations/supabase/client";

export interface ConfigurationSysteme {
  id: string;
  cle: string;
  valeur: any;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ConfigurationValidation {
  id: string;
  nom: string;
  description?: string;
  regles: any[];
  est_actif: boolean;
  created_at?: string;
  updated_at?: string;
}

export const configurationsService = {
  // Configurations système
  async obtenirConfiguration(cle: string): Promise<any> {
    const { data, error } = await supabase
      .from('configurations_systeme')
      .select('*')
      .eq('cle', cle)
      .maybeSingle();

    if (error) throw error;
    return data?.valeur || null;
  },

  async sauvegarderConfiguration(cle: string, valeur: any, description?: string): Promise<void> {
    const { error } = await supabase
      .from('configurations_systeme')
      .upsert({
        cle,
        valeur,
        description
      }, {
        onConflict: 'cle'
      });

    if (error) throw error;
  },

  async obtenirToutesConfigurations(): Promise<ConfigurationSysteme[]> {
    const { data, error } = await supabase
      .from('configurations_systeme')
      .select('*')
      .order('cle');

    if (error) throw error;
    return data || [];
  },

  // Configurations de validation
  async obtenirConfigurationsValidation(): Promise<ConfigurationValidation[]> {
    const { data, error } = await supabase
      .from('configurations_validation')
      .select('*')
      .order('nom');

    if (error) throw error;
    return (data || []).map(d => ({
      ...d,
      regles: Array.isArray(d.regles) ? d.regles : []
    }));
  },

  async obtenirConfigurationActive(): Promise<ConfigurationValidation | null> {
    const { data, error } = await supabase
      .from('configurations_validation')
      .select('*')
      .eq('est_actif', true)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return {
      ...data,
      regles: Array.isArray(data.regles) ? data.regles : []
    };
  },

  async creerConfigurationValidation(config: Omit<ConfigurationValidation, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase
      .from('configurations_validation')
      .insert(config);

    if (error) throw error;
  },

  async mettreAJourConfigurationValidation(id: string, updates: Partial<ConfigurationValidation>): Promise<void> {
    const { error } = await supabase
      .from('configurations_validation')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async activerConfigurationValidation(id: string): Promise<void> {
    // Désactiver toutes les autres configurations
    await supabase
      .from('configurations_validation')
      .update({ est_actif: false })
      .neq('id', id);

    // Activer la configuration sélectionnée
    const { error } = await supabase
      .from('configurations_validation')
      .update({ est_actif: true })
      .eq('id', id);

    if (error) throw error;
  },

  async supprimerConfigurationValidation(id: string): Promise<void> {
    const { error } = await supabase
      .from('configurations_validation')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
