
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { ActionsAffaire } from "./ActionsAffaire";

interface CarteAffaireProps {
  affaire: AffaireContentieuse;
  onVoir: (affaire: AffaireContentieuse) => void;
  onModifier: (affaire: AffaireContentieuse) => void;
  onSupprimer: (id: string) => void;
  onAffaireModifiee: () => void;
}

export const CarteAffaire = ({ 
  affaire, 
  onVoir, 
  onModifier, 
  onSupprimer, 
  onAffaireModifiee 
}: CarteAffaireProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {affaire.numeroAffaire}
              <ActionsAffaire 
                affaire={affaire} 
                onAffaireUpdated={onAffaireModifiee}
              />
            </CardTitle>
            <p className="text-sm text-gray-600">{affaire.dateAffaire}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onVoir(affaire)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModifier(affaire)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSupprimer(affaire.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Description:</span>
            <p className="text-gray-600 truncate">
              {affaire.descriptionAffaire}
            </p>
          </div>
          <div>
            <span className="font-medium">Montant:</span>
            <p className="text-gray-600">
              {affaire.montantAffaire?.toLocaleString()} FCFA
            </p>
          </div>
          {affaire.nomPrenomContrevenant && (
            <div>
              <span className="font-medium">Contrevenant:</span>
              <p className="text-gray-600 truncate">
                {affaire.nomPrenomContrevenant}
              </p>
            </div>
          )}
          {affaire.produitNetRepartir && (
            <div>
              <span className="font-medium">Produit Net:</span>
              <p className="text-gray-600">
                {affaire.produitNetRepartir.toLocaleString()} FCFA
              </p>
            </div>
          )}
          {affaire.observations && (
            <div className="md:col-span-2 lg:col-span-3">
              <span className="font-medium">Observations:</span>
              <p className="text-gray-600 truncate">
                {affaire.observations}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
