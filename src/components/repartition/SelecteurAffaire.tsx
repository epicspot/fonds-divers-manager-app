import { useState, useEffect } from "react";
import { useAffairesSupabase } from "@/hooks/useAffairesSupabase";
import { AffaireContentieuse } from "@/types/affaire";
import { ParametresRepartition } from "@/types/repartition";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SelecteurAffaireProps {
  onAffaireSelectionnee: (affaire: AffaireContentieuse, parametres: ParametresRepartition) => void;
}

export const SelecteurAffaire = ({ onAffaireSelectionnee }: SelecteurAffaireProps) => {
  const { affaires, isLoading } = useAffairesSupabase();
  const [affaireSelectionnee, setAffaireSelectionnee] = useState<string>("");

  // Filtrer uniquement les affaires en statut "en_repartition"
  const affairesDisponibles = affaires.filter(
    (a) => a.statut === "en_repartition"
  );

  const handleSelectionAffaire = (affaireId: string) => {
    setAffaireSelectionnee(affaireId);
    const affaire = affaires.find((a) => a.id === affaireId);
    
    if (!affaire) return;

    // Mapper les données de l'affaire vers les paramètres de répartition
    const parametres: ParametresRepartition = {
      montantAffaire: affaire.montantAffaire || 0,
      montantAmende: affaire.montantAmende || 0,
      montantVente: affaire.montantVente || 0,
      fraisDivers: affaire.montantTotalFrais || 0,
      nombreSaisissants: affaire.nomsSaisissant?.length || 0,
      nombreChefs: affaire.nomsChefs?.length || 0,
      nombreInformateurs: affaire.nombreInformateurs || 0,
      saisissants: affaire.nomsSaisissant || [],
      chefs: affaire.nomsChefs || [],
      informateurs: [], // Pourrait être extrait de nomsIntervenants si disponible
    };

    onAffaireSelectionnee(affaire, parametres);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="affaire-select">Sélectionner une affaire à répartir</Label>
          <Select value={affaireSelectionnee} onValueChange={handleSelectionAffaire}>
            <SelectTrigger id="affaire-select" className="mt-2">
              <SelectValue placeholder="Choisir une affaire..." />
            </SelectTrigger>
            <SelectContent>
              {affairesDisponibles.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Aucune affaire disponible pour répartition
                </div>
              ) : (
                affairesDisponibles.map((affaire) => (
                  <SelectItem key={affaire.id} value={affaire.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{affaire.numeroAffaire}</span>
                      <span className="text-muted-foreground">
                        - {affaire.montantAffaire?.toLocaleString()} FCFA
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        {affaire.statut}
                      </Badge>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {affairesDisponibles.length === 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Aucune affaire en statut "en_repartition" n'est disponible. 
              Les affaires doivent d'abord être validées et approuvées par la hiérarchie.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
