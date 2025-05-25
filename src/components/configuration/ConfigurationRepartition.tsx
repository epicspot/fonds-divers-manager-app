
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, FileText, Download, RotateCcw } from "lucide-react";
import { ReglesRepartitionModal } from "./ReglesRepartitionModal";
import { useReglesRepartition } from "@/hooks/useReglesRepartition";

export const ConfigurationRepartition = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { regles, reinitialiserRegles, exporterRegles } = useReglesRepartition();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration des Règles de Répartition
          </CardTitle>
          <CardDescription>
            Gérez les pourcentages et conditions utilisés pour les calculs de répartition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold mb-3">Règles Actuelles</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>FSP:</span>
                  <span className="font-medium">{regles.fsp?.pourcentageBase}%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Trésor:</span>
                  <span className="font-medium">{regles.tresor?.pourcentageBase}%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Mutuelle:</span>
                  <span className="font-medium">{regles.mutuelle?.pourcentageBase}%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Poursuivants:</span>
                  <span className="font-medium">{regles.poursuivants?.pourcentageBase}%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Fonds Solidarité:</span>
                  <span className="font-medium">{regles.fonds_solidarite?.pourcentageBase}%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Fonds Formation:</span>
                  <span className="font-medium">{regles.fonds_formation?.pourcentageBase}%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Fonds Équipement:</span>
                  <span className="font-medium">{regles.fonds_equipement?.pourcentageBase}%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>Primes Rendement:</span>
                  <span className="font-medium">{regles.prime_rendement?.pourcentageBase}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold mb-3">Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => setModalOpen(true)}
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Modifier les Règles
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={exporterRegles}
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter les Règles
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={reinitialiserRegles}
                  className="w-full justify-start"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Information</h4>
                <p className="text-blue-800 text-sm">
                  Les modifications des règles s'appliquent immédiatement aux nouveaux calculs de répartition.
                  Les calculs déjà effectués ne sont pas affectés.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReglesRepartitionModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  );
};
