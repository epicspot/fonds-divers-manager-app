
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListeAffairesContentieuses } from "@/components/ListeAffairesContentieuses";
import { ModalCreationAffaireContentieuse } from "@/components/ModalCreationAffaireContentieuse";
import { useState } from "react";

export function DossiersSection() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAffaireCreee = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Dossiers</h1>
            <p className="text-gray-600">Gérez tous vos dossiers de contentieux</p>
          </div>
          <ModalCreationAffaireContentieuse onAffaireCreee={handleAffaireCreee} />
        </div>

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
      </div>
    </div>
  );
}
