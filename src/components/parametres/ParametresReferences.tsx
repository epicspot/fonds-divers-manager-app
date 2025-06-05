
import { PageConfigurationEntites } from "@/components/configuration/PageConfigurationEntites";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Settings } from "lucide-react";
import { useState } from "react";
import { PiecesConfigModal } from "@/components/configuration/PiecesConfigModal";

export const ParametresReferences = () => {
  const [isPiecesModalOpen, setIsPiecesModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Listes de Référence
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Gérez les nomenclatures et listes de référence utilisées dans l'application.
        </p>
      </div>

      {/* Section spéciale pour les pièces de dossiers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Configuration des Pièces de Dossiers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Gérez les types de pièces disponibles pour les dossiers contentieux
          </p>
          <Button
            onClick={() => setIsPiecesModalOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Configurer les pièces
          </Button>
        </CardContent>
      </Card>
      
      <PageConfigurationEntites />

      <PiecesConfigModal
        isOpen={isPiecesModalOpen}
        onClose={() => setIsPiecesModalOpen(false)}
      />
    </div>
  );
};
