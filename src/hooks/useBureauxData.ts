
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bureau } from '@/types/regions';
import { bureauxService } from '@/services/bureauxService';

export function useBureauxData() {
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBureaux = async () => {
    try {
      const data = await bureauxService.fetchAll();
      setBureaux(data);
    } catch (error) {
      console.error('Error fetching bureaux:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les bureaux",
        variant: "destructive"
      });
    }
  };

  const createBureau = async (bureau: Omit<Bureau, 'id'>) => {
    try {
      await bureauxService.create(bureau);
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

  const updateBureau = async (id: string, updates: Partial<Bureau>) => {
    try {
      await bureauxService.update(id, updates);
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

  const deleteBureau = async (id: string) => {
    try {
      await bureauxService.delete(id);
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

  const getBureauById = (id: string): Bureau | undefined => {
    return bureaux.find(bureau => bureau.id === id);
  };

  const getBureauxByRegion = (regionId: string): Bureau[] => {
    return bureaux.filter(bureau => bureau.region_id === regionId);
  };

  useEffect(() => {
    fetchBureaux();
  }, []);

  return {
    bureaux,
    loading,
    createBureau,
    updateBureau,
    deleteBureau,
    refetch: fetchBureaux,
    getBureauById,
    getBureauxByRegion
  };
}
