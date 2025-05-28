
import { supabase } from '@/integrations/supabase/client';
import { Bureau } from '@/types/regions';

export const bureauxService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from('bureaux')
      .select('*')
      .order('nom');

    if (error) throw error;
    
    // Map database data to our interface, adding missing 'adresse' property
    const mappedData = (data || []).map(item => ({
      ...item,
      adresse: '' // Default value since not in DB schema
    }));
    
    return mappedData;
  },

  async create(bureau: Omit<Bureau, 'id'>) {
    const { error } = await supabase
      .from('bureaux')
      .insert([{
        nom: bureau.nom,
        region_id: bureau.region_id
      }]);

    if (error) throw error;
  },

  async update(id: string, updates: Partial<Bureau>) {
    const dbUpdates: any = {};
    if (updates.nom) dbUpdates.nom = updates.nom;
    if (updates.region_id) dbUpdates.region_id = updates.region_id;

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
