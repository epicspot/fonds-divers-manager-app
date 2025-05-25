
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormulaireDossier } from "@/components/FormulaireDossier";
import { ListeDossiers } from "@/components/ListeDossiers";
import { StatistiquesGenerales } from "@/components/StatistiquesGenerales";
import { ModalCreationAffaire } from "@/components/ModalCreationAffaire";
import { ModalCreationAffaireContentieuse } from "@/components/ModalCreationAffaireContentieuse";
import { ListeAffairesContentieuses } from "@/components/ListeAffairesContentieuses";
import { FileText, TrendingUp, Users, Scale } from "lucide-react";

const Index = () => {
  const [dossiers, setDossiers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshAffaires, setRefreshAffaires] = useState(0);

  const handleDossierAjoute = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAffaireCreee = () => {
    setRefreshAffaires(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion de Répartition de Contentieux
          </h1>
          <p className="text-gray-600">
            Système de gestion des affaires contentieuses et répartitions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dossiers</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <StatistiquesGenerales type="total" refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <StatistiquesGenerales type="montant" refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ayants Droits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <StatistiquesGenerales type="ayants" refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="affaires" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="affaires">Affaires Contentieuses</TabsTrigger>
            <TabsTrigger value="repartitions">Répartitions</TabsTrigger>
            <TabsTrigger value="liste">Historique</TabsTrigger>
            <TabsTrigger value="nouveau">Formulaire Legacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="affaires">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Scale className="h-5 w-5" />
                  <span>Gestion des Affaires Contentieuses</span>
                </CardTitle>
                <ModalCreationAffaireContentieuse onAffaireCreee={handleAffaireCreee} />
              </CardHeader>
              <CardContent>
                <ListeAffairesContentieuses refreshTrigger={refreshAffaires} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repartitions">
            <Card>
              <CardHeader>
                <CardTitle>Création de Répartitions</CardTitle>
                <p className="text-sm text-gray-600">
                  Créer des répartitions basées sur les affaires contentieuses validées
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">Module de répartition à venir...</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Sélectionnez une affaire validée pour créer sa répartition
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="liste">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Historique des Dossiers (Legacy)</CardTitle>
                <ModalCreationAffaire onAffaireCreee={handleDossierAjoute} />
              </CardHeader>
              <CardContent>
                <ListeDossiers refreshTrigger={refreshTrigger} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nouveau">
            <Card>
              <CardHeader>
                <CardTitle>Formulaire Simple (Legacy)</CardTitle>
              </CardHeader>
              <CardContent>
                <FormulaireDossier onDossierAjoute={handleDossierAjoute} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
