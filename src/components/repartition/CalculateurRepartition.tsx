
import { useState } from "react";
import { toast } from "sonner";
import { repartirMontants, genererBordereauRepartition } from "@/utils/repartitionUtils";
import { ParametresRepartition, ResultatRepartition } from "@/types/repartition";
import { ParametresAffichage } from "./ParametresAffichage";
import { ResultatsRepartition } from "./ResultatsRepartition";

interface CalculateurRepartitionProps {
  onResultatChange?: (resultat: ResultatRepartition) => void;
  affairePrechargee?: any;
}

export const CalculateurRepartition = ({ onResultatChange, affairePrechargee }: CalculateurRepartitionProps) => {
  const [parametres, setParametres] = useState<ParametresRepartition | null>(null);
  const [resultat, setResultat] = useState<ResultatRepartition | null>(null);

  const calculerRepartition = () => {
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

    if (nouveauResultat.verificationsOk) {
      toast.success("Répartition calculée avec succès");
    } else {
      toast.warning("Répartition calculée avec des avertissements");
    }
  };

  const telechargerBordereau = () => {
    if (!resultat) return;

    const bordereau = genererBordereauRepartition(resultat);
    const blob = new Blob([bordereau], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bordereau_repartition_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Bordereau téléchargé");
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">
          Module de sélection d'affaires temporairement indisponible. 
          Veuillez saisir manuellement les paramètres de répartition.
        </p>
      </div>

      {parametres && (
        <ParametresAffichage
          parametres={parametres}
          resultat={resultat}
          onCalculer={calculerRepartition}
          onTelecharger={telechargerBordereau}
        />
      )}

      {resultat && <ResultatsRepartition resultat={resultat} />}
    </div>
  );
};
