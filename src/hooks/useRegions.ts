
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Region {
  id: string;
  nom: string;
  created_at?: string;
  updated_at?: string;
}

export interface Bureau {
  id: string;
  nom: string;
  region_id: string;
  adresse: string;
  created_at?: string;
  updated_at?: string;
}

export function useRegions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('nom');

      if (error) throw error;
      setRegions(data || []);
    } catch (error) {
      console.error('Error fetching regions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les régions",
        variant: "destructive"
      });
    }
  };

  const fetchBureaux = async () => {
    try {
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
      
      setBureaux(mappedData);
    } catch (error) {
      console.error('Error fetching bureaux:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les bureaux",
        variant: "destructive"
      });
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchRegions(), fetchBureaux()]);
    setLoading(false);
  };

  const createRegion = async (nom: string) => {
    try {
      const { error } = await supabase
        .from('regions')
        .insert([{ nom }]);

      if (error) throw error;
      
      await fetchRegions();
      toast({
        title: "Succès",
        description: "Région ajoutée avec succès"
      });
    } catch (error) {
      console.error('Error creating region:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la région",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createBureau = async (bureau: Omit<Bureau, 'id'>) => {
    try {
      const { error } = await supabase
        .from('bureaux')
        .insert([{
          nom: bureau.nom,
          region_id: bureau.region_id
          // Note: adresse is not included since it doesn't exist in DB schema
        }]);

      if (error) throw error;
      
      await fetchBureaux();
      toast({
        title: "Succès",
        description: "Bureau ajouté avec succès"
      });
    } catch (error) {
      console.error('Error creating bureau:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le bureau",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateRegion = async (id: string, nom: string) => {
    try {
      const { error } = await supabase
        .from('regions')
        .update({ nom })
        .eq('id', id);

      if (error) throw error;
      
      await fetchRegions();
      toast({
        title: "Succès",
        description: "Région modifiée avec succès"
      });
    } catch (error) {
      console.error('Error updating region:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la région",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateBureau = async (id: string, updates: Partial<Bureau>) => {
    try {
      const dbUpdates: any = {};
      if (updates.nom) dbUpdates.nom = updates.nom;
      if (updates.region_id) dbUpdates.region_id = updates.region_id;

      const { error } = await supabase
        .from('bureaux')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchBureaux();
      toast({
        title: "Succès",
        description: "Bureau modifié avec succès"
      });
    } catch (error) {
      console.error('Error updating bureau:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le bureau",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteRegion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('regions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchRegions();
      toast({
        title: "Succès",
        description: "Région supprimée avec succès"
      });
    } catch (error) {
      console.error('Error deleting region:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la région",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteBureau = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bureaux')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchBureaux();
      toast({
        title: "Succès",
        description: "Bureau supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting bureau:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le bureau",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return {
    regions,
    bureaux,
    loading,
    createRegion,
    createBureau,
    updateRegion,
    updateBureau,
    deleteRegion,
    deleteBureau,
    refetch: fetchAll
  };
}
