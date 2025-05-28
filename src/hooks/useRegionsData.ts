
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Region } from '@/types/regions';
import { regionsService } from '@/services/regionsService';

export function useRegionsData() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRegions = async () => {
    try {
      const data = await regionsService.fetchAll();
      setRegions(data);
    } catch (error) {
      console.error('Error fetching regions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les régions",
        variant: "destructive"
      });
    }
  };

  const createRegion = async (nom: string) => {
    try {
      await regionsService.create(nom);
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

  const updateRegion = async (id: string, nom: string) => {
    try {
      await regionsService.update(id, nom);
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

  const deleteRegion = async (id: string) => {
    try {
      await regionsService.delete(id);
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

  const getRegionById = (id: string): Region | undefined => {
    return regions.find(region => region.id === id);
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return {
    regions,
    loading,
    createRegion,
    updateRegion,
    deleteRegion,
    refetch: fetchRegions,
    getRegionById
  };
}
