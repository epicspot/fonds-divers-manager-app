
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RegleRepartition } from '@/types/repartition';

export const useReglesRepartition = () => {
  const [regles, setRegles] = useState<Record<string, RegleRepartition>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const chargerRegles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('regles_repartition')
        .select('*');

      if (error) throw error;

      const reglesMap: Record<string, RegleRepartition> = {};
      (data || []).forEach(regle => {
        const conditions = typeof regle.conditions === 'object' && regle.conditions !== null 
          ? regle.conditions as { montantMin?: number; montantMax?: number; nombrePersonnes?: number }
          : {};
          
        reglesMap[regle.type] = {
          type: regle.type as any,
          pourcentageBase: Number(regle.pourcentage_base),
          pourcentageMax: Number(regle.pourcentage_max),
          conditions
        };
      });

      setRegles(reglesMap);
    } catch (error) {
      console.error('Erreur chargement règles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les règles de répartition",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerRegles();
  }, []);

  const sauvegarderRegle = async (cle: string, regle: RegleRepartition) => {
    try {
      const { error } = await supabase
        .from('regles_repartition')
        .upsert({
          type: cle,
          pourcentage_base: regle.pourcentageBase,
          pourcentage_max: regle.pourcentageMax,
          conditions: regle.conditions || {}
        }, { onConflict: 'type' });

      if (error) throw error;

      await chargerRegles();
      toast({
        title: "Succès",
        description: "Règle sauvegardée avec succès"
      });
    } catch (error) {
      console.error('Erreur sauvegarde règle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la règle",
        variant: "destructive"
      });
    }
  };

  const reinitialiserRegles = async () => {
    try {
      const reglesDefaut = [
        { type: 'fsp', pourcentage_base: 5, pourcentage_max: 5, conditions: { montantMin: 0 } },
        { type: 'tresor', pourcentage_base: 40, pourcentage_max: 40, conditions: {} },
        { type: 'mutuelle', pourcentage_base: 10, pourcentage_max: 10, conditions: {} },
        { type: 'poursuivants', pourcentage_base: 25, pourcentage_max: 30, conditions: { nombrePersonnes: 1 } },
        { type: 'fonds_solidarite', pourcentage_base: 8, pourcentage_max: 10, conditions: {} },
        { type: 'fonds_formation', pourcentage_base: 7, pourcentage_max: 10, conditions: {} },
        { type: 'fonds_equipement', pourcentage_base: 5, pourcentage_max: 8, conditions: {} },
        { type: 'prime_rendement', pourcentage_base: 5, pourcentage_max: 7, conditions: {} }
      ];

      for (const regle of reglesDefaut) {
        await supabase
          .from('regles_repartition')
          .upsert(regle, { onConflict: 'type' });
      }

      await chargerRegles();
      toast({
        title: "Succès",
        description: "Règles réinitialisées avec succès"
      });
    } catch (error) {
      console.error('Erreur réinitialisation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser les règles",
        variant: "destructive"
      });
    }
  };

  const exporterRegles = () => {
    const dataStr = JSON.stringify(regles, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `regles_repartition_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    regles,
    loading,
    sauvegarderRegle,
    reinitialiserRegles,
    exporterRegles,
    refetch: chargerRegles
  };
};
