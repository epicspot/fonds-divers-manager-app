
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bureau } from '@/types/regions';
import { bureauxService } from '@/services/bureauxService';

export function useBureauxData() {
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { toast } = useToast();
  const cache = useRef<{ data: Bureau[] | null, timestamp: number }>({ data: null, timestamp: 0 });
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  const fetchBureaux = async (forceRefresh = false) => {
    const now = Date.now();
    
    // Use cache if available and not expired, unless force refresh
    if (!forceRefresh && cache.current.data && (now - cache.current.timestamp) < CACHE_DURATION) {
      setBureaux(cache.current.data);
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    try {
      setLoading(true);
      const data = await bureauxService.fetchAll();
      setBureaux(data);
      // Update cache
      cache.current = { data, timestamp: now };
    } catch (error) {
      console.error('Error fetching bureaux:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les bureaux",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const createBureau = async (bureau: Omit<Bureau, 'id'>) => {
    try {
      await bureauxService.create(bureau);
      await fetchBureaux(true); // Force refresh after create
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

  const updateBureau = async (id: string, updates: Partial<Bureau>) => {
    try {
      await bureauxService.update(id, updates);
      await fetchBureaux(true); // Force refresh after update
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

  const deleteBureau = async (id: string) => {
    try {
      await bureauxService.delete(id);
      await fetchBureaux(true); // Force refresh after delete
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

  const getBureauById = (id: string): Bureau | undefined => {
    return bureaux.find(bureau => bureau.id === id);
  };

  const getBureauxByRegion = (regionId: string): Bureau[] => {
    return bureaux.filter(bureau => bureau.region_id === regionId);
  };

  useEffect(() => {
    if (initialLoad) {
      fetchBureaux();
    }
  }, [initialLoad]);

  return {
    bureaux,
    loading,
    createBureau,
    updateBureau,
    deleteBureau,
    refetch: () => fetchBureaux(true),
    getBureauById,
    getBureauxByRegion
  };
}
