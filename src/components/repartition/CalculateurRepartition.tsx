
import { useState } from "react";
import { toast } from "sonner";
import { repartirMontants, genererBordereauRepartition } from "@/utils/repartitionUtils";
import { ParametresRepartition, ResultatRepartition } from "@/types/repartition";
import { ParametresAffichage } from "./ParametresAffichage";
import { ResultatsRepartition } from "./ResultatsRepartition";
import { SelecteurAffaire } from "./SelecteurAffaire";
import { FormulaireManuelParametres } from "./FormulaireManuelParametres";
import { ModalApercuBordereau } from "./ModalApercuBordereau";
import { useHistoriqueRepartitions } from "@/hooks/useHistoriqueRepartitions";
import { useAffairesSupabase } from "@/hooks/useAffairesSupabase";
import { AffaireContentieuse } from "@/types/affaire";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalculateurRepartitionProps {
  onResultatChange?: (resultat: ResultatRepartition) => void;
  affairePrechargee?: any;
}

export const CalculateurRepartition = ({ onResultatChange, affairePrechargee }: CalculateurRepartitionProps) => {
  const [parametres, setParametres] = useState<ParametresRepartition | null>(null);
  const [resultat, setResultat] = useState<ResultatRepartition | null>(null);
  const [affaireSelectionnee, setAffaireSelectionnee] = useState<AffaireContentieuse | null>(affairePrechargee || null);
  const [modeActif, setModeActif] = useState<"selection" | "manuel">("selection");
  const [apercuOuvert, setApercuOuvert] = useState(false);
  const { sauvegarderRepartition } = useHistoriqueRepartitions();
  const { validerAffaire } = useAffairesSupabase();

  const handleAffaireSelectionnee = (affaire: AffaireContentieuse, params: ParametresRepartition) => {
    setAffaireSelectionnee(affaire);
    setParametres(params);
    setResultat(null);
    toast.success(`Affaire ${affaire.numeroAffaire} sélectionnée`);
  };

  const handleParametresManuels = (params: ParametresRepartition) => {
    setAffaireSelectionnee(null);
    setParametres(params);
    setResultat(null);
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

  const validerAffaireRepartition = async () => {
    if (!affaireSelectionnee?.id) {
      toast.error("Aucune affaire sélectionnée");
      return;
    }

    try {
      await validerAffaire(affaireSelectionnee.id);
      toast.success("Affaire validée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la validation de l'affaire");
    }
  };

  const ouvrirApercu = () => {
    if (!resultat) {
      toast.error("Veuillez d'abord calculer la répartition");
      return;
    }
    setApercuOuvert(true);
  };

  return (
    <div className="space-y-6">
      {!affairePrechargee && (
        <Tabs value={modeActif} onValueChange={(v) => setModeActif(v as "selection" | "manuel")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="selection">Sélectionner une affaire</TabsTrigger>
            <TabsTrigger value="manuel">Saisie manuelle</TabsTrigger>
          </TabsList>
          <TabsContent value="selection" className="mt-4">
            <SelecteurAffaire onAffaireSelectionnee={handleAffaireSelectionnee} />
          </TabsContent>
          <TabsContent value="manuel" className="mt-4">
            <FormulaireManuelParametres onParametresValides={handleParametresManuels} />
          </TabsContent>
        </Tabs>
      )}

      {parametres && (
        <ParametresAffichage
          parametres={parametres}
          resultat={resultat}
          onCalculer={calculerRepartition}
          onTelecharger={imprimerBordereau}
          onApercu={ouvrirApercu}
          onValider={validerAffaireRepartition}
          affaireId={affaireSelectionnee?.id}
        />
      )}

      {resultat && <ResultatsRepartition resultat={resultat} />}

      {resultat && (
        <ModalApercuBordereau
          open={apercuOuvert}
          onOpenChange={setApercuOuvert}
          affaire={affaireSelectionnee}
          resultat={resultat}
        />
      )}
    </div>
  );
};
