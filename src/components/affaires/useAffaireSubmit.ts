
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AffaireContentieuse } from "@/types/affaire";
import { useAffairesSupabase } from "@/hooks/useAffairesSupabase";

interface UseAffaireSubmitProps {
  onAffaireCreee: () => void;
  onClose: () => void;
  resetForm: () => void;
}

export const useAffaireSubmit = ({
  onAffaireCreee,
  onClose,
  resetForm
}: UseAffaireSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { creerAffaire } = useAffairesSupabase();

  const genererNumeroAffaire = (): string => {
    const annee = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `AFF-${annee}-${timestamp}`;
  };

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      const affaire: Partial<AffaireContentieuse> = {
        ...values,
        numeroAffaire: genererNumeroAffaire(),
        dateCreation: new Date().toISOString(),
        statut: 'brouillon' as const,
        montantAffaire: Number(values.montantAffaire) || 0
      };

      await creerAffaire(affaire);
      
      toast({
        title: "Succès",
        description: "Affaire contentieuse créée avec succès"
      });
      
      resetForm();
      onClose();
      onAffaireCreee();
    } catch (error) {
      console.error('Erreur lors de la création de l\'affaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting
  };
};
