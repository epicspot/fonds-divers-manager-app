
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Calculator, Settings } from "lucide-react";
import { CalculateurRepartition } from "./CalculateurRepartition";
import { ConfigurationRepartition } from "../configuration/ConfigurationRepartition";
import { ResultatRepartition } from "@/types/repartition";

export const ModuleRepartition = () => {
  const [resultatActuel, setResultatActuel] = useState<ResultatRepartition | null>(null);

  const handleResultatChange = (resultat: ResultatRepartition) => {
    setResultatActuel(resultat);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b bg-white flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Module de Répartition Automatique
          </h1>
          <p className="text-gray-600 text-sm">
            Calcul automatique des parts selon les règles métier de la douane
          </p>
        </div>
      </div>

      <Tabs defaultValue="calculateur" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b flex-shrink-0">
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

        <TabsContent value="calculateur" className="p-4 m-0 flex-1 overflow-auto">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <CardTitle className="text-lg">Calculateur de Répartition</CardTitle>
              <CardDescription className="text-sm">
                Saisissez les paramètres de l'affaire pour calculer automatiquement la répartition des montants
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex-1 overflow-auto">
              <CalculateurRepartition onResultatChange={handleResultatChange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="p-4 m-0 flex-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <CardTitle className="text-lg">Statistiques de Répartition</CardTitle>
              <CardDescription className="text-sm">
                Visualisez les statistiques et l'historique des répartitions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex-1 flex items-center justify-center">
              <div className="text-center">
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

        <TabsContent value="configuration" className="p-4 m-0 flex-1 overflow-auto">
          <div className="h-full">
            <ConfigurationRepartition />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
