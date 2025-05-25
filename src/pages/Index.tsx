
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormulaireDossier } from "@/components/FormulaireDossier";
import { ListeDossiers } from "@/components/ListeDossiers";
import { StatistiquesGenerales } from "@/components/StatistiquesGenerales";
import { ModalCreationAffaire } from "@/components/ModalCreationAffaire";
import { FileText, TrendingUp, Users } from "lucide-react";

const Index = () => {
  const [dossiers, setDossiers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDossierAjoute = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion de Répartition de Contentieux
          </h1>
          <p className="text-gray-600">
            Système de gestion des fonds divers et ayants droits
          </p>
        </div>

        {/* Bouton pour créer une nouvelle affaire */}
        <ModalCreationAffaire onAffaireCreee={handleDossierAjoute} />

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

        <Tabs defaultValue="liste" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="liste">Liste des Dossiers</TabsTrigger>
            <TabsTrigger value="nouveau">Formulaire Simple</TabsTrigger>
          </TabsList>
          
          <TabsContent value="liste">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Dossiers</CardTitle>
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
