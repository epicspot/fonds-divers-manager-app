import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useConfigurationsSysteme } from "@/hooks/useConfigurationsSysteme";
import { Skeleton } from "@/components/ui/skeleton";

interface Saisissant {
  id: string;
  label: string;
  value: string;
}

export function ConfigurationsSaisissants() {
  const [saisissants, setSaisissants] = useState<Saisissant[]>([]);
  const [newSaisissant, setNewSaisissant] = useState({ label: "", value: "" });
  const { toast } = useToast();
  const { valeur, sauvegarder, loading } = useConfigurationsSysteme('saisissants_config');

  useEffect(() => {
    if (valeur) {
      setSaisissants(Array.isArray(valeur) ? valeur : []);
    }
  }, [valeur]);

  const handleSave = async () => {
    try {
      await sauvegarder(saisissants, 'Liste des saisissants');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleAdd = () => {
    if (!newSaisissant.label.trim()) return;

    const saisissant: Saisissant = {
      id: crypto.randomUUID(),
      label: newSaisissant.label,
      value: newSaisissant.value || newSaisissant.label.toLowerCase().replace(/\s+/g, "_"),
    };

    setSaisissants([...saisissants, saisissant]);
    setNewSaisissant({ label: "", value: "" });
  };

  const handleRemove = (id: string) => {
    setSaisissants(saisissants.filter(s => s.id !== id));
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
      {/* Liste existante */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {saisissants.map((saisissant) => (
          <div key={saisissant.id} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <span className="flex-1 font-medium">{saisissant.label}</span>
            <span className="text-sm text-muted-foreground">{saisissant.value}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(saisissant.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {saisissants.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucun saisissant configuré
          </div>
        )}
      </div>

      {/* Ajouter nouveau */}
      <div className="border-t pt-4 space-y-4">
        <h4 className="font-medium">Ajouter un saisissant</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="label">Nom complet</Label>
            <Input
              id="label"
              value={newSaisissant.label}
              onChange={(e) => setNewSaisissant({ ...newSaisissant, label: e.target.value })}
              placeholder="Ex: Agent John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Code (optionnel)</Label>
            <Input
              id="value"
              value={newSaisissant.value}
              onChange={(e) => setNewSaisissant({ ...newSaisissant, value: e.target.value })}
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
