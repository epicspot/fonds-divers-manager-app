
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Printer, Download, Eye } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { useRapports, TypeRapport } from "@/hooks/useRapports";
import { obtenirAffaires } from "@/utils/affaireUtils";

const TYPES_RAPPORTS = [
  { value: 'bordereau', label: 'Bordereau d\'affaire', description: 'Document de synthèse complet' },
  { value: 'bordereau_officiel', label: 'Bordereau officiel DGD', description: 'Formulaire officiel selon modèle DGD' },
  { value: 'synthese', label: 'Fiche de synthèse', description: 'Résumé exécutif de l\'affaire' },
  { value: 'transmission', label: 'Rapport de transmission', description: 'Document officiel pour la hiérarchie' },
  { value: 'hierarchie', label: 'Rapport hiérarchique', description: 'Note pour validation supérieure' }
] as const;

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
            <div>
              <label className="block text-sm font-medium mb-2">Affaire</label>
              <Select value={affaireSelectionnee} onValueChange={setAffaireSelectionnee}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une affaire" />
                </SelectTrigger>
                <SelectContent>
                  {affaires.map((affaire) => (
                    <SelectItem key={affaire.id} value={affaire.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{affaire.numeroAffaire}</span>
                        <Badge variant={affaire.statut === 'validee' ? 'default' : 'secondary'}>
                          {affaire.statut}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type de rapport</label>
              <Select value={typeRapport} onValueChange={(value) => setTypeRapport(value as TypeRapport)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES_RAPPORTS.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {affaireSelectionneeObj && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Détails de l'affaire</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Numéro: {affaireSelectionneeObj.numeroAffaire}</div>
                  <div>Description: {affaireSelectionneeObj.descriptionAffaire}</div>
                  <div>Montant: {affaireSelectionneeObj.montantAffaire.toLocaleString()} FCFA</div>
                </div>
              </div>
            )}

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
            {showApercu && contenuApercu ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={handleImprimer} size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer (Modèle)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([contenuApercu], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `rapport_${typeRapport}_${affaireSelectionneeObj?.numeroAffaire || 'affaire'}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
                <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {contenuApercu}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Générez un rapport pour le prévisualiser ici</p>
              </div>
            )}
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
            <div className="space-y-2">
              {rapportsGeneres.slice(-5).reverse().map((rapport, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      {TYPES_RAPPORTS.find(t => t.value === rapport.type)?.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(rapport.dateGeneration).toLocaleString('fr-FR')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setContenuApercu(rapport.contenu);
                        setShowApercu(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const affaire = affaires.find(a => a.id === rapport.affaireId);
                        imprimerRapport(rapport.contenu, rapport.type, affaire);
                      }}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
