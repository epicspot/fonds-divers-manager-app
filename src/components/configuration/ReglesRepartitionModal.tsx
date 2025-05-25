
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, RotateCcw, Download, Edit } from "lucide-react";
import { RegleRepartition } from "@/types/repartition";
import { useReglesRepartition } from "@/hooks/useReglesRepartition";
import { toast } from "sonner";

interface ReglesRepartitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegleEditableProps {
  cle: string;
  regle: RegleRepartition;
  onSave: (cle: string, regle: RegleRepartition) => void;
}

const RegleEditable = ({ cle, regle, onSave }: RegleEditableProps) => {
  const [editing, setEditing] = useState(false);
  const [tempRegle, setTempRegle] = useState<RegleRepartition>(regle);

  const handleSave = () => {
    onSave(cle, tempRegle);
    setEditing(false);
    toast.success("Règle mise à jour");
  };

  const handleCancel = () => {
    setTempRegle(regle);
    setEditing(false);
  };

  const getNomRegle = (type: string) => {
    const noms: Record<string, string> = {
      fsp: "Fonds de Soutien aux Politiques (FSP)",
      tresor: "Trésor Public",
      mutuelle: "Mutuelle des Douanes",
      poursuivants: "Poursuivants",
      fonds_solidarite: "Fonds de Solidarité",
      fonds_formation: "Fonds de Formation",
      fonds_equipement: "Fonds d'Équipement",
      prime_rendement: "Primes de Rendement"
    };
    return noms[type] || type;
  };

  if (!editing) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{getNomRegle(regle.type)}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{regle.pourcentageBase}%</Badge>
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-gray-600">Pourcentage de base</Label>
              <p className="font-medium">{regle.pourcentageBase}%</p>
            </div>
            <div>
              <Label className="text-gray-600">Pourcentage maximum</Label>
              <p className="font-medium">{regle.pourcentageMax}%</p>
            </div>
            {regle.conditions?.montantMin !== undefined && (
              <div>
                <Label className="text-gray-600">Montant minimum</Label>
                <p className="font-medium">{regle.conditions.montantMin.toLocaleString()} FCFA</p>
              </div>
            )}
            {regle.conditions?.nombrePersonnes !== undefined && (
              <div>
                <Label className="text-gray-600">Nombre de personnes</Label>
                <p className="font-medium">{regle.conditions.nombrePersonnes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{getNomRegle(regle.type)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`base-${cle}`}>Pourcentage de base (%)</Label>
            <Input
              id={`base-${cle}`}
              type="number"
              value={tempRegle.pourcentageBase}
              onChange={(e) => setTempRegle(prev => ({
                ...prev,
                pourcentageBase: parseFloat(e.target.value) || 0
              }))}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div>
            <Label htmlFor={`max-${cle}`}>Pourcentage maximum (%)</Label>
            <Input
              id={`max-${cle}`}
              type="number"
              value={tempRegle.pourcentageMax}
              onChange={(e) => setTempRegle(prev => ({
                ...prev,
                pourcentageMax: parseFloat(e.target.value) || 0
              }))}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>

        {tempRegle.conditions && (
          <div className="grid grid-cols-2 gap-4">
            {tempRegle.conditions.montantMin !== undefined && (
              <div>
                <Label htmlFor={`montant-${cle}`}>Montant minimum (FCFA)</Label>
                <Input
                  id={`montant-${cle}`}
                  type="number"
                  value={tempRegle.conditions.montantMin}
                  onChange={(e) => setTempRegle(prev => ({
                    ...prev,
                    conditions: {
                      ...prev.conditions,
                      montantMin: parseInt(e.target.value) || 0
                    }
                  }))}
                  min="0"
                />
              </div>
            )}
            {tempRegle.conditions.nombrePersonnes !== undefined && (
              <div>
                <Label htmlFor={`personnes-${cle}`}>Nombre de personnes</Label>
                <Input
                  id={`personnes-${cle}`}
                  type="number"
                  value={tempRegle.conditions.nombrePersonnes}
                  onChange={(e) => setTempRegle(prev => ({
                    ...prev,
                    conditions: {
                      ...prev.conditions,
                      nombrePersonnes: parseInt(e.target.value) || 1
                    }
                  }))}
                  min="1"
                />
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <Button variant="outline" onClick={handleCancel} size="sm">
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const ReglesRepartitionModal = ({ isOpen, onClose }: ReglesRepartitionModalProps) => {
  const { regles, sauvegarderRegle, reinitialiserRegles, exporterRegles } = useReglesRepartition();

  if (!isOpen) return null;

  const handleReinitialiser = () => {
    reinitialiserRegles();
    toast.success("Règles réinitialisées aux valeurs par défaut");
  };

  const handleExporter = () => {
    exporterRegles();
    toast.success("Règles exportées");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Configuration des Règles de Répartition</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExporter}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm" onClick={handleReinitialiser}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Règles de Répartition</h3>
            <p className="text-gray-600 text-sm">
              Configurez les pourcentages et conditions pour chaque type de bénéficiaire de la répartition.
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(regles).map(([cle, regle]) => (
              <RegleEditable
                key={cle}
                cle={cle}
                regle={regle}
                onSave={sauvegarderRegle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
