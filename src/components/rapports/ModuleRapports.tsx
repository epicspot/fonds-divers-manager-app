import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, History, Download, Printer } from "lucide-react";
import { useRapports } from "@/hooks/useRapports";
import { useAffairesSupabase } from "@/hooks/useAffairesSupabase";
import { SelecteurRapport, TYPES_RAPPORTS } from "./SelecteurRapport";
import { ApercuRapport } from "./ApercuRapport";
import { HistoriqueRapports } from "./HistoriqueRapports";
import { TypeRapport } from "@/hooks/useRapports";
import { printTemplates } from "@/utils/printTemplates";

export const ModuleRapports = () => {
  const { affaires } = useAffairesSupabase();
  const { 
    rapportsGeneres, 
    rapportsGlobaux, 
    isGenerating, 
    genererTousLesRapports,
    obtenirRapport,
    imprimerRapport 
  } = useRapports();

  const [affaireSelectionnee, setAffaireSelectionnee] = useState<string>("");
  const [typeRapport, setTypeRapport] = useState<TypeRapport | "">("");
  const [showApercu, setShowApercu] = useState(false);
  const [contenuApercu, setContenuApercu] = useState("");

  const affaireObj = affaires.find(a => a.id === affaireSelectionnee);

  const handleGenererRapport = async () => {
    if (!affaireObj) return;

    await genererTousLesRapports(affaireObj);
    
    if (typeRapport) {
      const contenu = obtenirRapport(affaireObj.id, typeRapport);
      setContenuApercu(contenu);
      setShowApercu(true);
    }
  };

  const handleVoirApercu = (contenu: string) => {
    setContenuApercu(contenu);
    setShowApercu(true);
  };

  const handleImprimer = (contenu?: string, type?: TypeRapport, affaire?: any) => {
    const rapportType = type || typeRapport;
    const affaireData = affaire || affaireObj;
    
    if (!rapportType || !affaireData) return;

    imprimerRapport(rapportType, affaireData);
  };

  const handleTelecharger = () => {
    if (!contenuApercu || !typeRapport || !affaireObj) return;

    const typeLabel = TYPES_RAPPORTS.find(t => t.value === typeRapport)?.label || typeRapport;
    const blob = new Blob([contenuApercu], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${typeLabel}_${affaireObj.numeroAffaire}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImprimerModele = () => {
    if (!typeRapport || !affaireObj) return;
    
    const template = printTemplates[typeRapport];
    const htmlContent = template.generateHTML(contenuApercu, affaireObj);
    
    const fenetre = window.open('', '_blank');
    if (fenetre) {
      fenetre.document.write(htmlContent);
      fenetre.document.close();
      fenetre.focus();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Module de Gestion des Rapports</h1>
          <p className="text-muted-foreground mt-1">
            Génération, prévisualisation et gestion des rapports d'affaires contentieuses
          </p>
        </div>
        <FileText className="h-12 w-12 text-primary" />
      </div>

      <Tabs defaultValue="generation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generation">
            <FileText className="h-4 w-4 mr-2" />
            Génération
          </TabsTrigger>
          <TabsTrigger value="historique">
            <History className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generation" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sélection */}
            <Card>
              <CardHeader>
                <CardTitle>Sélection</CardTitle>
                <CardDescription>
                  Choisissez l'affaire et le type de rapport à générer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SelecteurRapport
                  affaires={affaires}
                  affaireSelectionnee={affaireSelectionnee}
                  typeRapport={typeRapport}
                  onAffaireChange={setAffaireSelectionnee}
                  onTypeRapportChange={setTypeRapport}
                />

                <div className="mt-6 space-y-2">
                  <Button
                    onClick={handleGenererRapport}
                    disabled={!affaireSelectionnee || !typeRapport || isGenerating}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {isGenerating ? "Génération..." : "Générer le rapport"}
                  </Button>

                  {showApercu && contenuApercu && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleImprimerModele}
                        className="flex-1"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTelecharger}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Aperçu */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu du rapport</CardTitle>
                <CardDescription>
                  Prévisualisation du contenu généré
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApercuRapport
                  showApercu={showApercu}
                  contenuApercu={contenuApercu}
                  typeRapport={typeRapport}
                  affaireSelectionnee={affaireObj}
                  onImprimer={handleImprimerModele}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historique">
          <Card>
            <CardHeader>
              <CardTitle>Historique des rapports</CardTitle>
              <CardDescription>
                Consultez et réimprimez les rapports précédemment générés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HistoriqueRapports
                rapportsGeneres={rapportsGeneres}
                affaires={affaires}
                onVoirApercu={handleVoirApercu}
                onImprimer={handleImprimer}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
