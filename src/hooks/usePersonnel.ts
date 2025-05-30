
import { useState, useEffect, useRef } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { toast } = useToast();
  const cache = useRef<{ data: Personnel[] | null, timestamp: number }>({ data: null, timestamp: 0 });
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  const fetchPersonnel = async (forceRefresh = false) => {
    const now = Date.now();
    
    // Use cache if available and not expired, unless force refresh
    if (!forceRefresh && cache.current.data && (now - cache.current.timestamp) < CACHE_DURATION) {
      setPersonnel(cache.current.data);
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('nom_complet');

      if (error) throw error;
      
      // Map database data to our interface, adding missing properties with defaults
      const mappedData = (data || []).map(item => ({
        ...item,
        region: '', // Default value since not in DB
        statut: 'actif' as const // Default value since not in DB
      }));
      
      setPersonnel(mappedData);
      // Update cache
      cache.current = { data: mappedData, timestamp: now };
    } catch (error) {
      console.error('Error fetching personnel:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le personnel",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const createPersonnel = async (newPersonnel: Omit<Personnel, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('personnel')
        .insert([{
          nom_complet: newPersonnel.nom_complet,
          fonction: newPersonnel.fonction,
          role: newPersonnel.role
        }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchPersonnel(true); // Force refresh after create
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

      const { error } = await supabase
        .from('personnel')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchPersonnel(true); // Force refresh after update
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
      
      await fetchPersonnel(true); // Force refresh after delete
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
    if (initialLoad) {
      fetchPersonnel();
    }
  }, [initialLoad]);

  return {
    personnel,
    loading,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    refetch: () => fetchPersonnel(true)
  };
}
