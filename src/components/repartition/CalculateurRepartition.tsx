
import { useState } from "react";
import { toast } from "sonner";
import { repartirMontants, genererBordereauRepartition } from "@/utils/repartitionUtils";
import { ParametresRepartition, ResultatRepartition } from "@/types/repartition";
import { ParametresAffichage } from "./ParametresAffichage";
import { ResultatsRepartition } from "./ResultatsRepartition";
import { SelecteurAffaire } from "./SelecteurAffaire";
import { useHistoriqueRepartitions } from "@/hooks/useHistoriqueRepartitions";
import { AffaireContentieuse } from "@/types/affaire";

interface CalculateurRepartitionProps {
  onResultatChange?: (resultat: ResultatRepartition) => void;
  affairePrechargee?: any;
}

export const CalculateurRepartition = ({ onResultatChange, affairePrechargee }: CalculateurRepartitionProps) => {
  const [parametres, setParametres] = useState<ParametresRepartition | null>(null);
  const [resultat, setResultat] = useState<ResultatRepartition | null>(null);
  const [affaireSelectionnee, setAffaireSelectionnee] = useState<AffaireContentieuse | null>(affairePrechargee || null);
  const { sauvegarderRepartition } = useHistoriqueRepartitions();

  const handleAffaireSelectionnee = (affaire: AffaireContentieuse, params: ParametresRepartition) => {
    setAffaireSelectionnee(affaire);
    setParametres(params);
    setResultat(null); // Réinitialiser le résultat
    toast.success(`Affaire ${affaire.numeroAffaire} sélectionnée`);
  };

  const calculerRepartition = async () => {
    if (!parametres) {
      toast.error("Veuillez d'abord sélectionner une affaire");
      return;
    }

    if (parametres.montantAffaire <= 0) {
      toast.error("Le montant de l'affaire doit être supérieur à 0");
      return;
    }

    const nouveauResultat = repartirMontants(parametres);
    setResultat(nouveauResultat);
    onResultatChange?.(nouveauResultat);

    // Sauvegarder dans l'historique
    await sauvegarderRepartition(
      nouveauResultat,
      parametres,
      affaireSelectionnee?.id,
      affaireSelectionnee?.numeroAffaire
    );

    if (nouveauResultat.verificationsOk) {
      toast.success("Répartition calculée et sauvegardée avec succès");
    } else {
      toast.warning("Répartition calculée avec des avertissements");
    }
  };

  const imprimerBordereau = () => {
    if (!resultat) return;

    const { printTemplates } = require('@/utils/printTemplates');
    const template = printTemplates.bordereau_repartition;
    
    const html = template.generateHTML('', affaireSelectionnee, resultat);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      toast.success("Bordereau prêt à imprimer");
    } else {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
    }
  };

  return (
    <div className="space-y-6">
      {!affairePrechargee && (
        <SelecteurAffaire onAffaireSelectionnee={handleAffaireSelectionnee} />
      )}

      {parametres && (
        <ParametresAffichage
          parametres={parametres}
          resultat={resultat}
          onCalculer={calculerRepartition}
          onTelecharger={imprimerBordereau}
        />
      )}

      {resultat && <ResultatsRepartition resultat={resultat} />}
    </div>
  );
};
