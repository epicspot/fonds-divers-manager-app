import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

const DRAFT_KEY = 'affaire_draft';
const DRAFT_TIMESTAMP_KEY = 'affaire_draft_timestamp';

export const useDraftSave = (form: UseFormReturn<any>, isOpen: boolean) => {
  const hasShownRestoreToast = useRef(false);

  // Charger le brouillon au démarrage
  useEffect(() => {
    if (isOpen && !hasShownRestoreToast.current) {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      const timestamp = localStorage.getItem(DRAFT_TIMESTAMP_KEY);
      
      if (savedDraft && timestamp) {
        try {
          const draftData = JSON.parse(savedDraft);
          const savedTime = new Date(timestamp);
          const timeDiff = Date.now() - savedTime.getTime();
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          // Proposer la restauration si le brouillon a moins de 24h
          if (hoursDiff < 24) {
            toast.info('Un brouillon a été trouvé', {
              description: `Sauvegardé ${savedTime.toLocaleDateString()} à ${savedTime.toLocaleTimeString()}`,
              action: {
                label: 'Restaurer',
                onClick: () => {
                  // Restaurer toutes les valeurs du brouillon
                  Object.keys(draftData).forEach((key) => {
                    form.setValue(key as any, draftData[key]);
                  });
                  toast.success('Brouillon restauré');
                },
              },
              duration: 10000,
            });
          } else {
            // Supprimer les brouillons trop anciens
            clearDraft();
          }
          hasShownRestoreToast.current = true;
        } catch (error) {
          console.error('Erreur lors de la lecture du brouillon:', error);
          clearDraft();
        }
      }
    }
  }, [isOpen, form]);

  // Sauvegarder automatiquement à chaque changement
  useEffect(() => {
    if (!isOpen) return;

    const subscription = form.watch((data) => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
        localStorage.setItem(DRAFT_TIMESTAMP_KEY, new Date().toISOString());
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du brouillon:', error);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isOpen]);

  // Fonction pour effacer le brouillon
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
  };

  return { clearDraft };
};
