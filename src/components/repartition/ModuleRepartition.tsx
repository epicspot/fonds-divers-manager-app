
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PieChart, Calculator, FileText, Settings } from "lucide-react";
import { CalculateurRepartition } from "./CalculateurRepartition";
import { ResultatRepartition } from "@/types/repartition";

export const ModuleRepartition = () => {
  const [resultatActuel, setResultatActuel] = useState<ResultatRepartition | null>(null);

  const handleResultatChange = (resultat: ResultatRepartition) => {
    setResultatActuel(resultat);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Module de Répartition Automatique
            </h1>
            <p className="text-gray-600 mt-2">
              Calcul automatique des parts selon les règles métier de la douane
            </p>
          </div>
        </div>

        <Tabs defaultValue="calculateur" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculateur" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculateur
            </TabsTrigger>
            <TabsTrigger value="statistiques" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="configuration" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculateur" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calculateur de Répartition</CardTitle>
                <CardDescription>
                  Saisissez les paramètres de l'affaire pour calculer automatiquement la répartition des montants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalculateurRepartition onResultatChange={handleResultatChange} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistiques" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques de Répartition</CardTitle>
                <CardDescription>
                  Visualisez les statistiques et l'historique des répartitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <PieChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Les statistiques de répartition seront affichées ici après avoir effectué des calculs.
                  </p>
                  {resultatActuel && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="font-semibold">Dernière répartition calculée:</p>
                      <p>Montant total: {resultatActuel.montantTotal.toLocaleString()} FCFA</p>
                      <p>Nombre d'ayants droits: {resultatActuel.ayantsDroits.length}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des Règles</CardTitle>
                <CardDescription>
                  Configurez les règles métier pour le calcul de répartition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Règles actuelles</h3>
                      <ul className="text-sm space-y-1">
                        <li>• FSP: 5% (si montant &lt; 500k) ou 4.5% (si montant ≥ 500k)</li>
                        <li>• Trésor: 50% du montant net</li>
                        <li>• Saisissants: 60% du montant à répartir</li>
                        <li>• Chefs: 30% du montant à répartir</li>
                        <li>• Informateurs: 10% du montant à répartir</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Actions</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Exporter les règles
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Modifier les pourcentages
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
