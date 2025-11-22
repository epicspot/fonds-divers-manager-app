import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useConfigurationsSysteme } from "@/hooks/useConfigurationsSysteme";
import { Skeleton } from "@/components/ui/skeleton";

interface ParametresGenerauxType {
  delaiValidation: number;
  montantMinimal: number;
  nombreMaxInformateurs: number;
}

export function ParametresGeneraux() {
  const [parametres, setParametres] = useState<ParametresGenerauxType>({
    delaiValidation: 7,
    montantMinimal: 100000,
    nombreMaxInformateurs: 10
  });
  const { toast } = useToast();
  const { valeur, sauvegarder, loading } = useConfigurationsSysteme('parametres_generaux');

  useEffect(() => {
    if (valeur) {
      setParametres(valeur);
    }
  }, [valeur]);

  const handleSave = async () => {
    try {
      await sauvegarder(parametres, 'Paramètres généraux du système');
    } catch (error) {
      // Error already handled in hook
    }
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
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="delaiValidation">Délai de validation (jours)</Label>
          <Input
            id="delaiValidation"
            type="number"
            value={parametres.delaiValidation}
            onChange={(e) => setParametres({ ...parametres, delaiValidation: parseInt(e.target.value) || 0 })}
            min="1"
          />
          <p className="text-sm text-muted-foreground">
            Délai maximal pour valider une affaire après sa création
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="montantMinimal">Montant minimal (FCFA)</Label>
          <Input
            id="montantMinimal"
            type="number"
            value={parametres.montantMinimal}
            onChange={(e) => setParametres({ ...parametres, montantMinimal: parseInt(e.target.value) || 0 })}
            min="0"
          />
          <p className="text-sm text-muted-foreground">
            Montant minimal pour créer une affaire contentieuse
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nombreMaxInformateurs">Nombre max d'informateurs</Label>
          <Input
            id="nombreMaxInformateurs"
            type="number"
            value={parametres.nombreMaxInformateurs}
            onChange={(e) => setParametres({ ...parametres, nombreMaxInformateurs: parseInt(e.target.value) || 0 })}
            min="1"
          />
          <p className="text-sm text-muted-foreground">
            Nombre maximum d'informateurs autorisés par affaire
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
}
