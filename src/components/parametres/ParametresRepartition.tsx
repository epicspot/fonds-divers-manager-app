
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReglesRepartition } from "@/hooks/useReglesRepartition";
import { ReglesRepartitionModal } from "@/components/configuration/ReglesRepartitionModal";
import { Settings, Download, Upload, RotateCcw } from "lucide-react";

export const ParametresRepartition = () => {
  const { regles, exporterRegles, reinitialiserRegles } = useReglesRepartition();
  const [showModal, setShowModal] = useState(false);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedRules = JSON.parse(e.target?.result as string);
          localStorage.setItem('regles_repartition', JSON.stringify(importedRules));
          window.location.reload();
        } catch (error) {
          console.error('Erreur lors de l\'import:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Configuration des Règles de Répartition
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Gérez les pourcentages et règles de calcul pour la répartition automatique.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Settings className="h-4 w-4" />
          Configurer les règles
        </Button>
        
        <Button variant="outline" onClick={exporterRegles} className="gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
        
        <div>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
            id="import-rules"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('import-rules')?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Importer
          </Button>
        </div>
        
        <Button
          variant="outline"
          onClick={reinitialiserRegles}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
      </div>

      <div className="grid gap-4">
        {Object.entries(regles).map(([key, regle]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-base capitalize">
                {regle.type.replace('_', ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Pourcentage de base:</span>
                  <span className="font-medium ml-2">{regle.pourcentageBase}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Pourcentage maximum:</span>
                  <span className="font-medium ml-2">{regle.pourcentageMax}%</span>
                </div>
                {regle.conditions && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Conditions:</span>
                    <div className="ml-2 text-xs text-gray-500">
                      {JSON.stringify(regle.conditions, null, 2)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ReglesRepartitionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};
