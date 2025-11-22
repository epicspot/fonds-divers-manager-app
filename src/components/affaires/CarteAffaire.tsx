
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Shield } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { ActionsAffaire } from "./ActionsAffaire";
import { usePermissions } from "@/hooks/usePermissions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const { canModifier, canSupprimer } = usePermissions();
  
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
            {canModifier(affaire) ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onModifier(affaire)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {affaire.statut !== 'brouillon' 
                        ? "Seuls les brouillons peuvent être modifiés" 
                        : "Permissions insuffisantes"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {canSupprimer(affaire) ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSupprimer(affaire.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Réservé aux administrateurs</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
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
