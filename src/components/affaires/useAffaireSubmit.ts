import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AffaireContentieuse } from "@/types/affaire";
import { useAffairesSupabase } from "@/hooks/useAffairesSupabase";
import { 
  sanitizeString, 
  sanitizeNumber, 
  sanitizeArray, 
  validateDate,
  validateDateCoherence,
  extractFirst
} from "@/utils/affaireUtils";
import { FormData } from "./useAffaireForm";

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

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Validation de cohérence des dates
      const dateRef = validateDate(values.dateReference);
      const dateAff = validateDate(values.dateAffaire);
      
      if (!validateDateCoherence(dateRef, dateAff)) {
        toast({
          title: "Erreur de validation",
          description: "La date d'affaire ne peut pas être antérieure à la date de référence",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Sanitisation complète des données
      const affaire: Partial<AffaireContentieuse> = {
        numeroAffaire: sanitizeString(values.numeroAffaire, 50),
        numeroReference: sanitizeString(values.numeroReference, 100),
        dateReference: dateRef,
        dateAffaire: dateAff,
        descriptionAffaire: sanitizeString(values.descriptionAffaire, 1000) || '',
        montantAffaire: sanitizeNumber(values.montantAffaire, 1),
        
        // Informations du bureau/poste (conversion tableau vers string unique)
        regionDgd: values.regionDgd,
        bureauPoste: values.bureauPoste,
        
        // Informations de la déclaration
        numeroDeclaration: sanitizeString(values.numeroDeclaration, 100),
        dateDeclaration: values.dateDeclaration ? validateDate(values.dateDeclaration) : undefined,
        
        // Informations du contrevenant
        nomPrenomContrevenant: sanitizeString(values.nomPrenomContrevenant, 200),
        adresseComplete: sanitizeString(values.adresseComplete, 500),
        ifu: sanitizeString(values.ifu, 50),
        
        // Transport et marchandises
        natureTransport: sanitizeArray(values.natureTransport, 20),
        identificationTransport: sanitizeString(values.identificationTransport, 200),
        commissionnaireDouane: sanitizeArray(values.commissionnaireDouane, 20),
        procedureDetectionFraude: sanitizeArray(values.procedureDetectionFraude, 20),
        natureMarchandisesFraude: sanitizeString(values.natureMarchandisesFraude, 500),
        
        // Sucrerie
        origineProvenance: sanitizeArray(values.origineProvenance, 20),
        poidsKg: values.poidsKg ? sanitizeNumber(values.poidsKg, 0) : undefined,
        
        // Valeurs et droits
        valeurMarchandisesLitigieuses: values.valeurMarchandisesLitigieuses 
          ? sanitizeNumber(values.valeurMarchandisesLitigieuses, 0) 
          : undefined,
        natureInfraction: sanitizeArray(values.natureInfraction, 20),
        droitsCompromis: values.droitsCompromis ? sanitizeNumber(values.droitsCompromis, 0) : undefined,
        numeroQuittanceDate: sanitizeString(values.numeroQuittanceDate, 100),
        nombreInformateurs: values.nombreInformateurs ? Math.floor(sanitizeNumber(values.nombreInformateurs, 0)) : undefined,
        
        // Transaction
        suiteAffaire: sanitizeString(values.suiteAffaire, 100),
        dateTransaction: values.dateTransaction ? validateDate(values.dateTransaction) : undefined,
        montantAmende: values.montantAmende ? sanitizeNumber(values.montantAmende, 0) : undefined,
        montantVente: values.montantVente ? sanitizeNumber(values.montantVente, 0) : undefined,
        numeroQuittanceDateTransaction: sanitizeString(values.numeroQuittanceDateTransaction, 100),
        montantTotalFrais: values.montantTotalFrais ? sanitizeNumber(values.montantTotalFrais, 0) : undefined,
        produitNetRepartir: values.produitNetRepartir ? sanitizeNumber(values.produitNetRepartir, 0) : undefined,
        nomsChefs: sanitizeArray(values.nomsChefs, 50),
        detailsFrais: sanitizeArray(values.detailsFrais, 50),
        
        // Saisissant et intervenants
        nomsSaisissant: sanitizeArray(values.nomsSaisissant, 50),
        nomsIntervenants: sanitizeArray(values.nomsIntervenants, 50),
        natureNombrePieces: sanitizeArray(values.natureNombrePieces, 50),
        suiteReserveeMarchandises: sanitizeArray(values.suiteReserveeMarchandises, 50),
        dateRepartition: values.dateRepartition ? validateDate(values.dateRepartition) : undefined,
        numeroBordereauRatification: sanitizeString(values.numeroBordereauRatification, 100),
        circonstancesParticulieres: sanitizeString(values.circonstancesParticulieres, 1000),
        
        observations: sanitizeString(values.observations, 2000),
        
        // Métadonnées
        dateCreation: new Date().toISOString(),
        statut: 'brouillon' as const,
      };

      await creerAffaire(affaire);
      
      toast({
        title: "Succès",
        description: "Affaire contentieuse créée avec succès"
      });
      
      resetForm();
      onClose();
      onAffaireCreee();
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'affaire:', error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de créer l'affaire",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting
  };
};
