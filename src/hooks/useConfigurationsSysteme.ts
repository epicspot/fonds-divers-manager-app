import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { configurationsService } from '@/services/configurationsService';

export function useConfigurationsSysteme(cle: string) {
  const [valeur, setValeur] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const charger = async () => {
    try {
      setLoading(true);
      const data = await configurationsService.obtenirConfiguration(cle);
      setValeur(data);
    } catch (error) {
      console.error('Error fetching configuration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sauvegarder = async (nouvelleValeur: any, description?: string) => {
    try {
      await configurationsService.sauvegarderConfiguration(cle, nouvelleValeur, description);
      setValeur(nouvelleValeur);
      toast({
        title: "Succès",
        description: "Configuration sauvegardée avec succès"
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    charger();
  }, [cle]);

  return {
    valeur,
    loading,
    sauvegarder,
    refetch: charger
  };
}
