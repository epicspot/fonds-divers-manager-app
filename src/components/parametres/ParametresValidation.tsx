import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useValidationRules } from "@/hooks/useValidationRules";
import { ValidationConfig, ValidationRule } from "@/types/validation";
import { Plus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ParametresValidation = () => {
  const {
    configs,
    activeConfigId,
    setActiveConfig,
    addConfig,
    deleteConfig,
    toggleFieldRequired,
  } = useValidationRules();

  const [newConfigName, setNewConfigName] = useState("");
  const [newConfigDescription, setNewConfigDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Liste des champs disponibles avec leurs étapes
  const availableFields = [
    { field: 'numeroAffaire', label: 'N° d\'Affaire', step: 1 },
    { field: 'numeroReference', label: 'N° de Référence', step: 1 },
    { field: 'dateReference', label: 'Date de Référence', step: 1 },
    { field: 'dateAffaire', label: 'Date d\'Affaire', step: 1 },
    { field: 'montantAffaire', label: 'Montant', step: 1 },
    { field: 'regionDgd', label: 'Région DGD', step: 1 },
    { field: 'bureauPoste', label: 'Bureau de Poste', step: 1 },
    { field: 'numeroDeclaration', label: 'N° de Déclaration', step: 2 },
    { field: 'dateDeclaration', label: 'Date de Déclaration', step: 2 },
    { field: 'nomPrenomContrevenant', label: 'Nom/Prénom Contrevenant', step: 1 },
    { field: 'natureTransport', label: 'Nature du Transport', step: 2 },
    { field: 'natureInfraction', label: 'Nature de l\'Infraction', step: 2 },
    { field: 'dateTransaction', label: 'Date de Transaction', step: 3 },
    { field: 'montantAmende', label: 'Montant Amende', step: 3 },
    { field: 'nomsSaisissant', label: 'Noms Saisissants', step: 4 },
    { field: 'nomsChefs', label: 'Noms Chefs', step: 4 },
  ];

  const handleCreateConfig = () => {
    if (!newConfigName.trim()) {
      toast.error("Le nom de la configuration est requis");
      return;
    }

    const newConfig: ValidationConfig = {
      id: `config-${Date.now()}`,
      name: newConfigName,
      description: newConfigDescription,
      rules: availableFields.map(f => ({
        ...f,
        required: false,
      })),
    };

    addConfig(newConfig);
    toast.success("Configuration créée avec succès");
    setNewConfigName("");
    setNewConfigDescription("");
    setIsDialogOpen(false);
  };

  const handleDeleteConfig = (id: string) => {
    if (id === 'default') {
      toast.error("Impossible de supprimer la configuration par défaut");
      return;
    }
    deleteConfig(id);
    toast.success("Configuration supprimée");
  };

  const handleSetActive = (id: string) => {
    setActiveConfig(id);
    toast.success("Configuration activée");
  };

  const handleToggleField = (configId: string, fieldName: string) => {
    toggleFieldRequired(configId, fieldName);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Règles de Validation</h2>
          <p className="text-sm text-muted-foreground">
            Configurez les champs obligatoires selon le type d'affaire
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Configuration
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une Configuration de Validation</DialogTitle>
              <DialogDescription>
                Définissez une nouvelle règle de validation pour un type d'affaire spécifique
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="config-name">Nom de la configuration</Label>
                <Input
                  id="config-name"
                  value={newConfigName}
                  onChange={(e) => setNewConfigName(e.target.value)}
                  placeholder="Ex: Affaires de contrebande"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="config-description">Description (optionnelle)</Label>
                <Input
                  id="config-description"
                  value={newConfigDescription}
                  onChange={(e) => setNewConfigDescription(e.target.value)}
                  placeholder="Ex: Pour les affaires de type contrebande..."
                />
              </div>
              <Button onClick={handleCreateConfig} className="w-full">
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {configs.map((config) => (
          <Card key={config.id} className={config.id === activeConfigId ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{config.name}</CardTitle>
                    {config.id === activeConfigId && (
                      <Badge variant="default" className="gap-1">
                        <Check className="w-3 h-3" />
                        Active
                      </Badge>
                    )}
                    {config.isDefault && (
                      <Badge variant="secondary">Par défaut</Badge>
                    )}
                  </div>
                  {config.description && (
                    <CardDescription>{config.description}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  {config.id !== activeConfigId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetActive(config.id)}
                    >
                      Activer
                    </Button>
                  )}
                  {!config.isDefault && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteConfig(config.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm font-medium">Champs obligatoires par étape :</p>
                
                {[1, 2, 3, 4].map(step => {
                  const stepFields = config.rules.filter(r => r.step === step);
                  if (stepFields.length === 0) return null;
                  
                  return (
                    <div key={step} className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">
                        Étape {step}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {stepFields.map((rule) => (
                          <div
                            key={rule.field}
                            className="flex items-center justify-between p-2 rounded-lg border bg-muted/50"
                          >
                            <Label htmlFor={`${config.id}-${rule.field}`} className="text-xs cursor-pointer">
                              {rule.label}
                            </Label>
                            <Switch
                              id={`${config.id}-${rule.field}`}
                              checked={rule.required}
                              onCheckedChange={() => handleToggleField(config.id, rule.field)}
                              disabled={config.isDefault && rule.required}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
