import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ResultatRepartition, ParametresRepartition } from '@/types/repartition';

export interface HistoriqueRepartition {
  id: string;
  affaire_id: string | null;
  numero_affaire: string | null;
  date_repartition: string;
  montant_total: number;
  montant_net: number;
  part_fsp: number;
  part_tresor: number;
  part_mutuelle: number;
  part_fonds_solidarite: number;
  part_fonds_formation: number;
  part_fonds_equipement: number;
  part_prime_rendement: number;
  ayants_droits: any[];
  parametres: any;
  verifications_ok: boolean;
  erreurs: string[];
  utilisateur: string | null;
  created_at: string;
}

export const useHistoriqueRepartitions = () => {
  const [historique, setHistorique] = useState<HistoriqueRepartition[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const chargerHistorique = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('historique_repartitions')
        .select('*')
        .order('date_repartition', { ascending: false });

      if (error) throw error;

      setHistorique(data.map(item => ({
        ...item,
        ayants_droits: Array.isArray(item.ayants_droits) ? item.ayants_droits : [],
        erreurs: Array.isArray(item.erreurs) ? item.erreurs.map(String) : []
      })));
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des répartitions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerHistorique();
  }, []);

  const sauvegarderRepartition = async (
    resultat: ResultatRepartition,
    parametres: ParametresRepartition,
    affaireId?: string,
    numeroAffaire?: string,
    utilisateur?: string
  ) => {
    try {
      const { error } = await supabase
        .from('historique_repartitions')
        .insert([{
          affaire_id: affaireId || null,
          numero_affaire: numeroAffaire || null,
          montant_total: resultat.montantTotal,
          montant_net: resultat.montantNet,
          part_fsp: resultat.partFsp,
          part_tresor: resultat.partTresor,
          part_mutuelle: resultat.partMutuelle,
          part_fonds_solidarite: resultat.partFondsSolidarite,
          part_fonds_formation: resultat.partFondsFormation,
          part_fonds_equipement: resultat.partFondsEquipement,
          part_prime_rendement: resultat.partPrimeRendement,
          ayants_droits: resultat.ayantsDroits as any,
          parametres: parametres as any,
          verifications_ok: resultat.verificationsOk,
          erreurs: resultat.erreurs as any,
          utilisateur: utilisateur || 'Système'
        }]);

      if (error) throw error;

      await chargerHistorique();
      toast({
        title: "Succès",
        description: "Répartition sauvegardée dans l'historique"
      });
    } catch (error) {
      console.error('Erreur sauvegarde répartition:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la répartition",
        variant: "destructive"
      });
    }
  };

  const supprimerRepartition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('historique_repartitions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await chargerHistorique();
      toast({
        title: "Succès",
        description: "Répartition supprimée de l'historique"
      });
    } catch (error) {
      console.error('Erreur suppression répartition:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la répartition",
        variant: "destructive"
      });
    }
  };

  const chargerRepartitionParAffaire = async (affaireId: string) => {
    try {
      const { data, error } = await supabase
        .from('historique_repartitions')
        .select('*')
        .eq('affaire_id', affaireId)
        .order('date_repartition', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erreur chargement répartition:', error);
      return null;
    }
  };

  return {
    historique,
    loading,
    sauvegarderRepartition,
    supprimerRepartition,
    chargerRepartitionParAffaire,
    refetch: chargerHistorique
  };
};
