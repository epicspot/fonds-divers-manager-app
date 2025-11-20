
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListeAffairesContentieuses } from "@/components/ListeAffairesContentieuses";
import { ModalCreationAffaireContentieuse } from "@/components/ModalCreationAffaireContentieuse";
import { ConfigurationManager } from "@/components/configuration/ConfigurationManager";
import { ModuleRepartition } from "@/components/repartition/ModuleRepartition";
import { PageConfigurationEntites } from "@/components/configuration/PageConfigurationEntites";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAffaireCreee = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-full">
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Affaires Contentieuses
            </h1>
            <p className="text-gray-600 text-sm">
              Système de gestion des dossiers contentieux de la douane
            </p>
          </div>
          <div className="flex gap-2">
            <ConfigurationManager />
            <ModalCreationAffaireContentieuse onAffaireCreee={handleAffaireCreee} />
          </div>
        </div>

        <Tabs defaultValue="affaires" className="h-full">
          <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
            <TabsTrigger value="affaires">Affaires Contentieuses</TabsTrigger>
            <TabsTrigger value="repartition">Répartition</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="affaires" className="p-4 m-0">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Liste des Affaires Contentieuses</CardTitle>
                <CardDescription className="text-sm">
                  Gérez et suivez toutes les affaires contentieuses en cours
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ListeAffairesContentieuses refreshTrigger={refreshTrigger} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repartition" className="p-0 m-0">
            <ModuleRepartition />
          </TabsContent>

          <TabsContent value="configuration" className="p-4 m-0">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Configuration du Système</CardTitle>
                <CardDescription className="text-sm">
                  Gérez les entités et paramètres du système
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <PageConfigurationEntites />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistiques" className="p-4 m-0">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
                <CardDescription>Visualisation des statistiques du système</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Module de statistiques temporairement indisponible.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
