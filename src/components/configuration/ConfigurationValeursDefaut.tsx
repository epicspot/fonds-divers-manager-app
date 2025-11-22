import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { saveDefaultValues, getDefaultValuesByBureau } from "@/services/suggestionsService";
import { useBureauxData } from "@/hooks/useBureauxData";
import { Badge } from "@/components/ui/badge";

export const ConfigurationValeursDefaut = () => {
  const { bureaux, loading: bureauxLoading } = useBureauxData();
  const [selectedBureau, setSelectedBureau] = useState("");
  const [region, setRegion] = useState("");
  const [valeursDefaut, setValeursDefaut] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  // Charger les valeurs par défaut quand un bureau est sélectionné
  useEffect(() => {
    if (selectedBureau) {
      loadDefaultValues();
    }
  }, [selectedBureau]);

  const loadDefaultValues = async () => {
    try {
      const values = await getDefaultValuesByBureau(selectedBureau);
      if (values && typeof values === 'object') {
        setValeursDefaut(values as Record<string, any>);
      }
      
      // Trouver la région du bureau
      const bureau = bureaux.find(b => b.nom === selectedBureau);
      if (bureau && bureau.region_id) {
        setRegion(bureau.region_id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedBureau) {
      toast.error("Veuillez sélectionner un bureau");
      return;
    }

    setSaving(true);
    try {
      const result = await saveDefaultValues(selectedBureau, region, valeursDefaut);
      if (result.success) {
        toast.success("Valeurs par défaut enregistrées");
      } else {
        toast.error("Erreur lors de l'enregistrement");
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const updateValue = (field: string, value: any) => {
    setValeursDefaut(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayValue = (field: string, value: string) => {
    if (!value.trim()) return;
    
    const currentArray = valeursDefaut[field] || [];
    if (!Array.isArray(currentArray)) {
      updateValue(field, [value]);
    } else {
      updateValue(field, [...currentArray, value]);
    }
  };

  const removeArrayValue = (field: string, index: number) => {
    const currentArray = valeursDefaut[field] || [];
    if (Array.isArray(currentArray)) {
      updateValue(field, currentArray.filter((_, i) => i !== index));
    }
  };

  const fieldsConfig = [
    { 
      field: 'natureInfraction', 
      label: 'Nature de l\'infraction', 
      type: 'array',
      placeholder: 'Ex: Exportation sans déclaration'
    },
    { 
      field: 'procedureDetectionFraude', 
      label: 'Procédure de détection', 
      type: 'array',
      placeholder: 'Ex: Contrôle physique'
    },
    { 
      field: 'natureTransport', 
      label: 'Nature du transport', 
      type: 'array',
      placeholder: 'Ex: Véhicule'
    },
    { 
      field: 'suiteReserveeMarchandises', 
      label: 'Suite réservée aux marchandises', 
      type: 'array',
      placeholder: 'Ex: Confiscation'
    },
    { 
      field: 'nomsChefs', 
      label: 'Chef(s) de bureau', 
      type: 'array',
      placeholder: 'Nom du chef'
    },
    { 
      field: 'commissionnaireDouane', 
      label: 'Commissionnaire en douane', 
      type: 'array',
      placeholder: 'Nom du commissionnaire'
    }
  ];

  const ArrayFieldInput = ({ field, label, placeholder }: any) => {
    const [newValue, setNewValue] = useState("");
    const values = valeursDefaut[field] || [];

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addArrayValue(field, newValue);
                setNewValue("");
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => {
              addArrayValue(field, newValue);
              setNewValue("");
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {Array.isArray(values) && values.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {values.map((value, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {value}
                <button
                  type="button"
                  onClick={() => removeArrayValue(field, index)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration des Valeurs par Défaut
        </CardTitle>
        <CardDescription>
          Définissez les valeurs par défaut pour chaque bureau afin d'accélérer la saisie des affaires
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Bureau</Label>
            <Select value={selectedBureau} onValueChange={setSelectedBureau}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un bureau" />
              </SelectTrigger>
              <SelectContent>
                {bureaux.map((bureau) => (
                  <SelectItem key={bureau.id} value={bureau.nom}>
                    {bureau.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBureau && (
            <>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Valeurs par Défaut</h3>
                <div className="space-y-4">
                  {fieldsConfig.map((config) => (
                    <ArrayFieldInput
                      key={config.field}
                      field={config.field}
                      label={config.label}
                      placeholder={config.placeholder}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
