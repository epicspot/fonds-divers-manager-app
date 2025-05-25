
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListeAffairesContentieuses } from "@/components/ListeAffairesContentieuses";
import { ModalCreationAffaireContentieuse } from "@/components/ModalCreationAffaireContentieuse";
import { StatistiquesGenerales } from "@/components/StatistiquesGenerales";
import { ConfigurationManager } from "@/components/configuration/ConfigurationManager";
import { ModuleRepartition } from "@/components/repartition/ModuleRepartition";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAffaireCreee = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Affaires Contentieuses
            </h1>
            <p className="text-gray-600 mt-2">
              Système de gestion des dossiers contentieux de la douane
            </p>
          </div>
          <div className="flex gap-2">
            <ConfigurationManager />
            <ModalCreationAffaireContentieuse onAffaireCreee={handleAffaireCreee} />
          </div>
        </div>

        <Tabs defaultValue="affaires" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="affaires">Affaires Contentieuses</TabsTrigger>
            <TabsTrigger value="repartition">Répartition</TabsTrigger>
            <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="affaires" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Liste des Affaires Contentieuses</CardTitle>
                <CardDescription>
                  Gérez et suivez toutes les affaires contentieuses en cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ListeAffairesContentieuses refreshTrigger={refreshTrigger} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repartition" className="space-y-6">
            <ModuleRepartition />
          </TabsContent>

          <TabsContent value="statistiques" className="space-y-6">
            <StatistiquesGenerales type="montant" refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
