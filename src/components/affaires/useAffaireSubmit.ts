
import { useState } from "react";
import { sauvegarderAffaire } from "@/utils/affaireUtils";
import { AffaireContentieuse } from "@/types/affaire";
import { toast } from "sonner";
import { FormData } from "./useAffaireForm";

interface AyantDroitForm {
  nom: string;
  typeAyantDroit: 'syndicat' | 'mutuelle' | 'poursuivant' | 'autre';
  montant: number;
}

interface UseAffaireSubmitProps {
  onAffaireCreee: () => void;
  onClose: () => void;
  resetForm: () => void;
  setAyantsDroits: (ayants: AyantDroitForm[]) => void;
}

export const useAffaireSubmit = ({ 
  onAffaireCreee, 
  onClose, 
  resetForm, 
  setAyantsDroits 
}: UseAffaireSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: FormData, ayantsDroits: AyantDroitForm[]) => {
    if (ayantsDroits.length === 0) {
      toast.error("Veuillez ajouter au moins un ayant droit");
      return;
    }

    setIsSubmitting(true);

    try {
      const nouvelleAffaire: AffaireContentieuse = {
        id: crypto.randomUUID(),
        numeroAffaire: values.numeroAffaire,
        dateAffaire: values.dateAffaire,
        descriptionAffaire: values.descriptionAffaire,
        montantAffaire: values.montantAffaire,
        
        // Informations du bureau/poste
        regionDgd: values.regionDgd,
        bureauPoste: values.bureauPoste,
        
        // Informations de la déclaration
        numeroDeclaration: values.numeroDeclaration,
        dateDeclaration: values.dateDeclaration,
        
        // Informations du contrevenant
        nomPrenomContrevenant: values.nomPrenomContrevenant,
        adresseComplete: values.adresseComplete,
        ifu: values.ifu,
        
        // Transport et marchandises
        natureTransport: values.natureTransport,
        identificationTransport: values.identificationTransport,
        commissionnaireDouane: values.commissionnaireDouane,
        procedureDetectionFraude: values.procedureDetectionFraude,
        natureMarchandisesFraude: values.natureMarchandisesFraude,
        
        // Sucrerie
        origineProvenance: values.origineProvenance,
        poidsKg: values.poidsKg,
        
        // Valeurs et droits
        valeurMarchandisesLitigieuses: values.valeurMarchandisesLitigieuses,
        natureInfraction: values.natureInfraction,
        droitsCompromis: values.droitsCompromis,
        numeroQuittanceDate: values.numeroQuittanceDate,
        nombreInformateurs: values.nombreInformateurs,
        
        // Transaction
        suiteAffaire: values.suiteAffaire,
        dateTransaction: values.dateTransaction,
        montantAmende: values.montantAmende,
        montantVente: values.montantVente,
        numeroQuittanceDateTransaction: values.numeroQuittanceDateTransaction,
        montantTotalFrais: values.montantTotalFrais,
        produitNetRepartir: values.produitNetRepartir,
        nomsChefs: values.nomsChefs,
        detailsFrais: values.detailsFrais,
        
        // Saisissant et intervenants
        nomsSaisissant: values.nomsSaisissant,
        nomsIntervenants: values.nomsIntervenants,
        natureNombrePieces: values.natureNombrePieces,
        suiteReserveeMarchandises: values.suiteReserveeMarchandises,
        dateRepartition: values.dateRepartition,
        numeroBordereauRatification: values.numeroBordereauRatification,
        circonstancesParticulieres: values.circonstancesParticulieres,

        ayantsDroits: ayantsDroits.map(ayant => ({
          nom: ayant.nom,
          typeAyantDroit: ayant.typeAyantDroit,
          montant: ayant.montant,
        })),
        statut: 'brouillon',
        observations: values.observations,
        dateCreation: new Date().toISOString(),
      };

      sauvegarderAffaire(nouvelleAffaire);
      toast.success("Affaire contentieuse créée avec succès");

      // Reset du formulaire
      resetForm();
      setAyantsDroits([]);
      onClose();
      onAffaireCreee();
    } catch (error) {
      toast.error("Erreur lors de la création de l'affaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { onSubmit, isSubmitting };
};
