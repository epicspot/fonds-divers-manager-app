
import { supabase } from '@/integrations/supabase/client';
import { Bureau } from '@/types/regions';

export const bureauxService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from('bureaux')
      .select('*')
      .order('nom');

    if (error) throw error;
    return data || [];
  },

  async fetchByRegion(regionId: string) {
    const { data, error } = await supabase
      .from('bureaux')
      .select('*')
      .eq('region_id', regionId)
      .order('nom');

    if (error) throw error;
    return data || [];
  },

  async create(bureau: Omit<Bureau, 'id'>) {
    const { error } = await supabase
      .from('bureaux')
      .insert([{
        nom: bureau.nom,
        region_id: bureau.region_id,
        adresse: bureau.adresse
      }]);

    if (error) throw error;
  },

  async update(id: string, updates: Partial<Bureau>) {
    const dbUpdates: any = {};
    if (updates.nom) dbUpdates.nom = updates.nom;
    if (updates.region_id) dbUpdates.region_id = updates.region_id;
    if (updates.adresse !== undefined) dbUpdates.adresse = updates.adresse;

    const { error } = await supabase
      .from('bureaux')
      .update(dbUpdates)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('bureaux')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
