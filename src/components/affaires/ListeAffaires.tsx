
import { Card, CardContent } from "@/components/ui/card";
import { AffaireContentieuse } from "@/types/affaire";
import { CarteAffaire } from "./CarteAffaire";

interface ListeAffairesProps {
  affaires: AffaireContentieuse[];
  affairesFiltrees: AffaireContentieuse[];
  onVoir: (affaire: AffaireContentieuse) => void;
  onModifier: (affaire: AffaireContentieuse) => void;
  onSupprimer: (id: string) => void;
  onAffaireModifiee: () => void;
}

export const ListeAffaires = ({ 
  affaires,
  affairesFiltrees, 
  onVoir, 
  onModifier, 
  onSupprimer, 
  onAffaireModifiee 
}: ListeAffairesProps) => {
  if (affairesFiltrees.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          {affaires.length === 0
            ? "Aucune affaire contentieuse enregistrée"
            : "Aucune affaire ne correspond aux critères de recherche"}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {affairesFiltrees.map((affaire) => (
          <CarteAffaire
            key={affaire.id}
            affaire={affaire}
            onVoir={onVoir}
            onModifier={onModifier}
            onSupprimer={onSupprimer}
            onAffaireModifiee={onAffaireModifiee}
          />
        ))}
      </div>

      {affairesFiltrees.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          {affairesFiltrees.length} affaire(s) affichée(s) sur {affaires.length}
        </div>
      )}
    </>
  );
};
