import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useConfigurationsSysteme } from "@/hooks/useConfigurationsSysteme";
import { Skeleton } from "@/components/ui/skeleton";

interface Intervenant {
  id: string;
  label: string;
  value: string;
}

export function ConfigurationsIntervenants() {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [newIntervenant, setNewIntervenant] = useState({ label: "", value: "" });
  const { toast } = useToast();
  const { valeur, sauvegarder, loading } = useConfigurationsSysteme('intervenants_config');

  useEffect(() => {
    if (valeur) {
      setIntervenants(Array.isArray(valeur) ? valeur : []);
    }
  }, [valeur]);

  const handleSave = async () => {
    try {
      await sauvegarder(intervenants, 'Liste des intervenants');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleAdd = () => {
    if (!newIntervenant.label.trim()) return;

    const intervenant: Intervenant = {
      id: crypto.randomUUID(),
      label: newIntervenant.label,
      value: newIntervenant.value || newIntervenant.label.toLowerCase().replace(/\s+/g, "_"),
    };

    setIntervenants([...intervenants, intervenant]);
    setNewIntervenant({ label: "", value: "" });
  };

  const handleRemove = (id: string) => {
    setIntervenants(intervenants.filter(i => i.id !== id));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {intervenants.map((intervenant) => (
          <div key={intervenant.id} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <span className="flex-1 font-medium">{intervenant.label}</span>
            <span className="text-sm text-muted-foreground">{intervenant.value}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(intervenant.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {intervenants.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucun intervenant configuré
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-4">
        <h4 className="font-medium">Ajouter un intervenant</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="label">Nom complet</Label>
            <Input
              id="label"
              value={newIntervenant.label}
              onChange={(e) => setNewIntervenant({ ...newIntervenant, label: e.target.value })}
              placeholder="Ex: Expert John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Code (optionnel)</Label>
            <Input
              id="value"
              value={newIntervenant.value}
              onChange={(e) => setNewIntervenant({ ...newIntervenant, value: e.target.value })}
              placeholder="Ex: john_doe"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
}
