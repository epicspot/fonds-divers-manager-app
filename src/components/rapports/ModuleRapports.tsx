
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { useRapports, TypeRapport } from "@/hooks/useRapports";
import { obtenirAffaires } from "@/utils/affaireUtils";
import { SelecteurRapport } from "./SelecteurRapport";
import { ApercuRapport } from "./ApercuRapport";
import { HistoriqueRapports } from "./HistoriqueRapports";

export const ModuleRapports = () => {
  const [affaireSelectionnee, setAffaireSelectionnee] = useState<string>("");
  const [typeRapport, setTypeRapport] = useState<TypeRapport | "">("");
  const [contenuApercu, setContenuApercu] = useState<string>("");
  const [showApercu, setShowApercu] = useState(false);
  
  const { rapportsGeneres, isGenerating, genererRapport, imprimerRapport } = useRapports();
  
  const affaires = obtenirAffaires().filter(a => a.statut !== 'brouillon');

  const handleGenererRapport = async () => {
    if (!affaireSelectionnee || !typeRapport) return;
    
    const affaire = affaires.find(a => a.id === affaireSelectionnee);
    if (!affaire) return;

    try {
      const contenu = await genererRapport(affaire, typeRapport);
      setContenuApercu(contenu);
      setShowApercu(true);
    } catch (error) {
      console.error('Erreur génération:', error);
    }
  };

  const handleImprimer = () => {
    if (!typeRapport) return;
    
    const affaire = affaires.find(a => a.id === affaireSelectionnee);
    imprimerRapport(contenuApercu, typeRapport as TypeRapport, affaire);
  };

  const handleVoirApercu = (contenu: string) => {
    setContenuApercu(contenu);
    setShowApercu(true);
  };

  const affaireSelectionneeObj = affaires.find(a => a.id === affaireSelectionnee);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Génération de Rapports
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Générez et imprimez différents types de rapports pour vos affaires contentieuses.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Nouveau Rapport
            </CardTitle>
            <CardDescription>
              Sélectionnez une affaire et le type de rapport à générer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SelecteurRapport
              affaires={affaires}
              affaireSelectionnee={affaireSelectionnee}
              typeRapport={typeRapport}
              onAffaireChange={setAffaireSelectionnee}
              onTypeRapportChange={setTypeRapport}
            />

            <div className="flex gap-2">
              <Button 
                onClick={handleGenererRapport}
                disabled={!affaireSelectionnee || !typeRapport || isGenerating}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isGenerating ? 'Génération...' : 'Générer & Prévisualiser'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aperçu du Rapport</CardTitle>
            <CardDescription>
              Prévisualisez le rapport avant impression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApercuRapport
              showApercu={showApercu}
              contenuApercu={contenuApercu}
              typeRapport={typeRapport}
              affaireSelectionnee={affaireSelectionneeObj}
              onImprimer={handleImprimer}
            />
          </CardContent>
        </Card>
      </div>

      {rapportsGeneres.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des Rapports</CardTitle>
            <CardDescription>
              Rapports récemment générés avec modèles d'impression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HistoriqueRapports
              rapportsGeneres={rapportsGeneres}
              affaires={affaires}
              onVoirApercu={handleVoirApercu}
              onImprimer={imprimerRapport}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
