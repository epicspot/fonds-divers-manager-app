
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Region } from '@/types/regions';
import { regionsService } from '@/services/regionsService';

export function useRegionsData() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { toast } = useToast();
  const cache = useRef<{ data: Region[] | null, timestamp: number }>({ data: null, timestamp: 0 });
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  const fetchRegions = async (forceRefresh = false) => {
    const now = Date.now();
    
    // Use cache if available and not expired, unless force refresh
    if (!forceRefresh && cache.current.data && (now - cache.current.timestamp) < CACHE_DURATION) {
      setRegions(cache.current.data);
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    try {
      setLoading(true);
      const data = await regionsService.fetchAll();
      setRegions(data);
      // Update cache
      cache.current = { data, timestamp: now };
    } catch (error) {
      console.error('Error fetching regions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les régions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  const createRegion = async (nom: string) => {
    try {
      await regionsService.create(nom);
      await fetchRegions(true); // Force refresh after create
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

  const updateRegion = async (id: string, nom: string) => {
    try {
      await regionsService.update(id, nom);
      await fetchRegions(true); // Force refresh after update
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

  const deleteRegion = async (id: string) => {
    try {
      await regionsService.delete(id);
      await fetchRegions(true); // Force refresh after delete
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

  const getRegionById = (id: string): Region | undefined => {
    return regions.find(region => region.id === id);
  };

  useEffect(() => {
    if (initialLoad) {
      fetchRegions();
    }
  }, [initialLoad]);

  return {
    regions,
    loading,
    createRegion,
    updateRegion,
    deleteRegion,
    refetch: () => fetchRegions(true),
    getRegionById
  };
}
