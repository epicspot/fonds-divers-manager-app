import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActionSuivi } from '@/types/suivi';
import { useToast } from '@/hooks/use-toast';

export const useActionsSuivi = (affaireId?: string) => {
  const [actions, setActions] = useState<ActionSuivi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const chargerActions = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('actions_suivi')
        .select('*')
        .order('date_action', { ascending: false });

      if (affaireId) {
        query = query.eq('affaire_id', affaireId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const actionsFormatees: ActionSuivi[] = (data || []).map(item => ({
        id: item.id,
        affaireId: item.affaire_id,
        type: item.type as ActionSuivi['type'],
        statut: 'termine', // Par défaut
        utilisateur: item.utilisateur,
        commentaire: item.commentaire || undefined,
        dateAction: item.date_action,
        delaiPrevu: item.delai_prevu || undefined,
        dateEcheance: item.date_echeance || undefined
      }));

      setActions(actionsFormatees);
    } catch (error) {
      console.error('Erreur chargement actions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chargerActions();

    // S'abonner aux changements en temps réel
    const channel = supabase
      .channel('actions_suivi_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'actions_suivi',
          filter: affaireId ? `affaire_id=eq.${affaireId}` : undefined
        },
        () => {
          chargerActions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [affaireId]);

  const creerAction = async (action: Omit<ActionSuivi, 'id' | 'dateAction'>) => {
    try {
      const { error } = await supabase
        .from('actions_suivi')
        .insert({
          affaire_id: action.affaireId,
          type: action.type,
          utilisateur: action.utilisateur,
          commentaire: action.commentaire,
          delai_prevu: action.delaiPrevu,
          date_echeance: action.dateEcheance
        });

      if (error) throw error;

      await chargerActions();
      
      toast({
        title: "Action enregistrée",
        description: "L'action a été enregistrée avec succès"
      });
    } catch (error) {
      console.error('Erreur création action:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'action",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    actions,
    isLoading,
    chargerActions,
    creerAction
  };
};
