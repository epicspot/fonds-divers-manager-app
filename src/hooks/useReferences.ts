
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ReferenceList {
  id: string;
  nom: string;
  type: string;
  nombre_elements: number;
  date_modification: string;
  statut: 'actif' | 'inactif';
  created_at?: string;
  updated_at?: string;
}

export function useReferences() {
  const [references, setReferences] = useState<ReferenceList[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReferences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reference_lists')
        .select('*')
        .order('nom');

      if (error) throw error;
      setReferences(data || []);
    } catch (error) {
      console.error('Error fetching references:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les listes de référence",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createReference = async (newReference: Omit<ReferenceList, 'id'>) => {
    try {
      const { error } = await supabase
        .from('reference_lists')
        .insert([newReference]);

      if (error) throw error;
      
      await fetchReferences();
      toast({
        title: "Succès",
        description: "Liste de référence ajoutée avec succès"
      });
    } catch (error) {
      console.error('Error creating reference:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la liste de référence",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateReference = async (id: string, updates: Partial<ReferenceList>) => {
    try {
      const { error } = await supabase
        .from('reference_lists')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchReferences();
      toast({
        title: "Succès",
        description: "Liste de référence modifiée avec succès"
      });
    } catch (error) {
      console.error('Error updating reference:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la liste de référence",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteReference = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reference_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchReferences();
      toast({
        title: "Succès",
        description: "Liste de référence supprimée avec succès"
      });
    } catch (error) {
      console.error('Error deleting reference:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la liste de référence",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  return {
    references,
    loading,
    createReference,
    updateReference,
    deleteReference,
    refetch: fetchReferences
  };
}
