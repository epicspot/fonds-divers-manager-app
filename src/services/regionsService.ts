
import { supabase } from '@/integrations/supabase/client';
import { Region } from '@/types/regions';

export const regionsService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .order('nom');

    if (error) throw error;
    return data || [];
  },

  async create(nom: string) {
    const { error } = await supabase
      .from('regions')
      .insert([{ nom }]);

    if (error) throw error;
  },

  async update(id: string, nom: string) {
    const { error } = await supabase
      .from('regions')
      .update({ nom })
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('regions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
