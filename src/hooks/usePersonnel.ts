
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Personnel {
  id: string;
  nom_complet: string;
  fonction: string;
  role: 'saisissant' | 'chef' | 'intervenant';
  region: string;
  statut: 'actif' | 'inactif';
  created_at?: string;
  updated_at?: string;
}

export function usePersonnel() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPersonnel = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('nom_complet');

      if (error) throw error;
      
      // Map database data to our interface, adding missing properties
      const mappedData = (data || []).map(item => ({
        ...item,
        region: item.region || '',
        statut: 'actif' as const // Default value since it's not in DB yet
      }));
      
      setPersonnel(mappedData);
    } catch (error) {
      console.error('Error fetching personnel:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le personnel",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPersonnel = async (newPersonnel: Omit<Personnel, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .insert([{
          nom_complet: newPersonnel.nom_complet,
          fonction: newPersonnel.fonction,
          role: newPersonnel.role,
          region: newPersonnel.region || ''
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchPersonnel();
      toast({
        title: "Succès",
        description: "Personnel ajouté avec succès"
      });
    } catch (error) {
      console.error('Error creating personnel:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le personnel",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePersonnel = async (id: string, updates: Partial<Personnel>) => {
    try {
      const dbUpdates: any = {};
      if (updates.nom_complet) dbUpdates.nom_complet = updates.nom_complet;
      if (updates.fonction) dbUpdates.fonction = updates.fonction;
      if (updates.role) dbUpdates.role = updates.role;
      if (updates.region) dbUpdates.region = updates.region;

      const { error } = await supabase
        .from('personnel')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchPersonnel();
      toast({
        title: "Succès",
        description: "Personnel modifié avec succès"
      });
    } catch (error) {
      console.error('Error updating personnel:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le personnel",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deletePersonnel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('personnel')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchPersonnel();
      toast({
        title: "Succès",
        description: "Personnel supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting personnel:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le personnel",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  return {
    personnel,
    loading,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    refetch: fetchPersonnel
  };
}
