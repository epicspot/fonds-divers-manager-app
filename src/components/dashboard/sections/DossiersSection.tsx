
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListeAffairesContentieuses } from "@/components/ListeAffairesContentieuses";
import { ModalCreationAffaireContentieuse } from "@/components/ModalCreationAffaireContentieuse";
import { useState } from "react";

export function DossiersSection() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAffaireCreee = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-4 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gestion des Dossiers</h1>
            <p className="text-gray-600 text-sm">Gérez tous vos dossiers de contentieux</p>
          </div>
          <ModalCreationAffaireContentieuse onAffaireCreee={handleAffaireCreee} />
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="text-lg">Liste des Affaires Contentieuses</CardTitle>
            <CardDescription className="text-sm">
              Gérez et suivez toutes les affaires contentieuses en cours
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="h-full">
              <ListeAffairesContentieuses refreshTrigger={refreshTrigger} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
