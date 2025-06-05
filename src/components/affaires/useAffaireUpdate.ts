
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AffaireContentieuse } from "@/types/affaire";
import { useAffairesSupabase } from "@/hooks/useAffairesSupabase";

interface UseAffaireUpdateProps {
  onAffaireModifiee: () => void;
  onClose: () => void;
  resetForm: () => void;
}

export const useAffaireUpdate = ({
  onAffaireModifiee,
  onClose,
  resetForm
}: UseAffaireUpdateProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { mettreAJourAffaire } = useAffairesSupabase();

  const onUpdate = async (id: string, values: any) => {
    setIsUpdating(true);
    
    try {
      const affaireUpdate: Partial<AffaireContentieuse> = {
        ...values,
        montantAffaire: Number(values.montantAffaire) || 0
      };

      await mettreAJourAffaire(id, affaireUpdate);
      
      toast({
        title: "Succès",
        description: "Affaire contentieuse mise à jour avec succès"
      });
      
      resetForm();
      onClose();
      onAffaireModifiee();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'affaire:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    onUpdate,
    isUpdating
  };
};
