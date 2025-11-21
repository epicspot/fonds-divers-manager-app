
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Settings, History } from "lucide-react";
import { CalculateurRepartition } from "./CalculateurRepartition";
import { ConfigurationRepartition } from "../configuration/ConfigurationRepartition";
import { GestionReglesRepartition } from "./GestionReglesRepartition";
import { HistoriqueRepartitions } from "./HistoriqueRepartitions";
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
          <TabsTrigger value="historique" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
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

        <TabsContent value="historique" className="p-4 m-0 flex-1 overflow-auto">
          <HistoriqueRepartitions />
        </TabsContent>

        <TabsContent value="configuration" className="p-4 m-0 flex-1 overflow-auto">
          <div className="space-y-6">
            <GestionReglesRepartition />
            <ConfigurationRepartition />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
