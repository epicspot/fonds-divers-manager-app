
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { useRapports, TypeRapport } from "@/hooks/useRapports";
import { obtenirAffaires } from "@/utils/affaireUtils";
import { SelecteurRapport } from "./SelecteurRapport";
import { ApercuRapport } from "./ApercuRapport";
import { ListeRapportsGlobaux } from "./ListeRapportsGlobaux";

export const ModuleRapports = () => {
  const [affaireSelectionnee, setAffaireSelectionnee] = useState<string>("");
  const [typeRapportApercu, setTypeRapportApercu] = useState<TypeRapport | "">("");
  const [contenuApercu, setContenuApercu] = useState<string>("");
  const [showApercu, setShowApercu] = useState(false);
  
  const { rapportsGlobaux, isGenerating, genererTousLesRapports, obtenirRapport, imprimerRapport } = useRapports();
  
  const affaires = obtenirAffaires().filter(a => a.statut !== 'brouillon');

  const handleGenererRapports = async () => {
    if (!affaireSelectionnee) return;
    
    const affaire = affaires.find(a => a.id === affaireSelectionnee);
    if (!affaire) return;

    try {
      await genererTousLesRapports(affaire);
    } catch (error) {
      console.error('Erreur génération:', error);
    }
  };

  const handleVoirApercu = (type: TypeRapport) => {
    if (!affaireSelectionnee) return;
    
    const contenu = obtenirRapport(affaireSelectionnee, type);
    setContenuApercu(contenu);
    setTypeRapportApercu(type);
    setShowApercu(true);
  };

  const handleImprimer = (type: TypeRapport) => {
    if (!affaireSelectionnee) return;
    
    const affaire = affaires.find(a => a.id === affaireSelectionnee);
    if (affaire) {
      imprimerRapport(type, affaire);
    }
  };

  const affaireSelectionneeObj = affaires.find(a => a.id === affaireSelectionnee);
  const rapportsAffaire = rapportsGlobaux.find(r => r.affaireId === affaireSelectionnee);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Génération Globale de Rapports
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Générez tous les types de rapports en une seule fois pour une affaire contentieuse.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Génération Globale
            </CardTitle>
            <CardDescription>
              Sélectionnez une affaire pour générer tous les rapports disponibles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="affaire" className="text-sm font-medium">
                Affaire
              </label>
              <select
                id="affaire"
                value={affaireSelectionnee}
                onChange={(e) => setAffaireSelectionnee(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Sélectionner une affaire</option>
                {affaires.map((affaire) => (
                  <option key={affaire.id} value={affaire.id}>
                    {affaire.numeroAffaire} - {affaire.descriptionAffaire}
                  </option>
                ))}
              </select>
            </div>

            <Button 
              onClick={handleGenererRapports}
              disabled={!affaireSelectionnee || isGenerating}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              {isGenerating ? 'Génération en cours...' : 'Générer Tous les Rapports'}
            </Button>

            {rapportsAffaire && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  ✅ Rapports générés le {new Date(rapportsAffaire.dateGeneration).toLocaleString('fr-FR')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aperçu du Rapport</CardTitle>
            <CardDescription>
              Prévisualisez un rapport spécifique avant impression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApercuRapport
              showApercu={showApercu}
              contenuApercu={contenuApercu}
              typeRapport={typeRapportApercu}
              affaireSelectionnee={affaireSelectionneeObj}
              onImprimer={() => typeRapportApercu && handleImprimer(typeRapportApercu)}
            />
          </CardContent>
        </Card>
      </div>

      {rapportsGlobaux.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rapports Générés</CardTitle>
            <CardDescription>
              Liste des rapports générés avec accès aux différents formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListeRapportsGlobaux
              rapportsGlobaux={rapportsGlobaux}
              affaires={affaires}
              onVoirApercu={handleVoirApercu}
              onImprimer={handleImprimer}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
