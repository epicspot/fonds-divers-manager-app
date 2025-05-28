import { useState } from "react";
import { obtenirAffaires } from "@/utils/affaireUtils";
import { AffaireContentieuse } from "@/types/affaire";
import { toast } from "sonner";
import { FormData } from "./useAffaireEditForm";

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

  const onUpdate = async (id: string, values: FormData) => {
    setIsUpdating(true);

    try {
      const affaires = obtenirAffaires();
      const affaireIndex = affaires.findIndex(a => a.id === id);
      
      if (affaireIndex === -1) {
        toast.error("Affaire non trouvée");
        return;
      }

      const affaireExistante = affaires[affaireIndex];
      
      const affaireModifiee: AffaireContentieuse = {
        ...affaireExistante,
        numeroAffaire: values.numeroAffaire,
        dateAffaire: values.dateAffaire,
        descriptionAffaire: "",
        montantAffaire: values.montantAffaire,
        regionDgd: values.regionDgd,
        bureauPoste: values.bureauPoste,
        numeroDeclaration: values.numeroDeclaration,
        dateDeclaration: values.dateDeclaration,
        nomPrenomContrevenant: values.nomPrenomContrevenant,
        adresseComplete: values.adresseComplete,
        ifu: values.ifu,
        natureTransport: values.natureTransport,
        identificationTransport: values.identificationTransport,
        commissionnaireDouane: values.commissionnaireDouane,
        procedureDetectionFraude: values.procedureDetectionFraude,
        natureMarchandisesFraude: values.natureMarchandisesFraude,
        origineProvenance: values.origineProvenance,
        poidsKg: values.poidsKg,
        valeurMarchandisesLitigieuses: values.valeurMarchandisesLitigieuses,
        natureInfraction: values.natureInfraction,
        droitsCompromis: values.droitsCompromis,
        numeroQuittanceDate: values.numeroQuittanceDate,
        nombreInformateurs: values.nombreInformateurs,
        suiteAffaire: values.suiteAffaire,
        dateTransaction: values.dateTransaction,
        montantAmende: values.montantAmende,
        montantVente: values.montantVente,
        numeroQuittanceDateTransaction: values.numeroQuittanceDateTransaction,
        montantTotalFrais: values.montantTotalFrais,
        produitNetRepartir: values.produitNetRepartir,
        nomsChefs: values.nomsChefs,
        detailsFrais: values.detailsFrais,
        nomsSaisissant: values.nomsSaisissant,
        nomsIntervenants: values.nomsIntervenants,
        natureNombrePieces: values.natureNombrePieces,
        suiteReserveeMarchandises: values.suiteReserveeMarchandises,
        dateRepartition: values.dateRepartition,
        numeroBordereauRatification: values.numeroBordereauRatification,
        circonstancesParticulieres: values.circonstancesParticulieres,
        observations: values.observations,
      };

      affaires[affaireIndex] = affaireModifiee;
      localStorage.setItem('affaires_contentieuses', JSON.stringify(affaires));
      
      toast.success("Affaire modifiée avec succès");
      resetForm();
      onClose();
      onAffaireModifiee();
    } catch (error) {
      toast.error("Erreur lors de la modification de l'affaire");
    } finally {
      setIsUpdating(false);
    }
  };

  return { onUpdate, isUpdating };
};
