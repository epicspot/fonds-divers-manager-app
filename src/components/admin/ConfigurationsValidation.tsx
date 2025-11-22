import { useState, useEffect } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { configurationsService, ConfigurationValidation } from "@/services/configurationsService";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function ConfigurationsValidation() {
  const [configurations, setConfigurations] = useState<ConfigurationValidation[]>([]);
  const [loading, setLoading] = useState(true);
  const [newConfig, setNewConfig] = useState({ nom: "", description: "" });
  const { toast } = useToast();

  const chargerConfigurations = async () => {
    try {
      setLoading(true);
      const data = await configurationsService.obtenirConfigurationsValidation();
      setConfigurations(data);
    } catch (error) {
      console.error('Error loading configurations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les configurations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerConfigurations();
  }, []);

  const handleCreate = async () => {
    if (!newConfig.nom.trim()) return;

    try {
      await configurationsService.creerConfigurationValidation({
        nom: newConfig.nom,
        description: newConfig.description,
        regles: [],
        est_actif: false
      });
      
      toast({
        title: "Succès",
        description: "Configuration créée avec succès"
      });
      
      setNewConfig({ nom: "", description: "" });
      await chargerConfigurations();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la configuration",
        variant: "destructive"
      });
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await configurationsService.activerConfigurationValidation(id);
      toast({
        title: "Succès",
        description: "Configuration activée avec succès"
      });
      await chargerConfigurations();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'activer la configuration",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await configurationsService.supprimerConfigurationValidation(id);
      toast({
        title: "Succès",
        description: "Configuration supprimée avec succès"
      });
      await chargerConfigurations();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la configuration",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {configurations.map((config) => (
          <div
            key={config.id}
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{config.nom}</h4>
                {config.est_actif && (
                  <Badge variant="default">Active</Badge>
                )}
              </div>
              {config.description && (
                <p className="text-sm text-muted-foreground">{config.description}</p>
              )}
            </div>
            {!config.est_actif && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleActivate(config.id)}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Activer
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(config.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {configurations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucune configuration de validation
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-4">
        <h4 className="font-medium">Créer une configuration</h4>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de la configuration</Label>
            <Input
              id="nom"
              value={newConfig.nom}
              onChange={(e) => setNewConfig({ ...newConfig, nom: e.target.value })}
              placeholder="Ex: Validation stricte"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newConfig.description}
              onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
              placeholder="Ex: Configuration avec tous les champs obligatoires"
            />
          </div>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Créer la configuration
        </Button>
      </div>
    </div>
  );
}
