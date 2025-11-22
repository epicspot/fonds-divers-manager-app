import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, FileText, Loader2, Shield } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { ActionsAffaire } from "./ActionsAffaire";
import { usePermissions } from "@/hooks/usePermissions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ListeAffairesProps {
  affaires: AffaireContentieuse[];
  affairesFiltrees: AffaireContentieuse[];
  onVoir: (affaire: AffaireContentieuse) => void;
  onModifier: (affaire: AffaireContentieuse) => void;
  onSupprimer: (id: string) => void;
  onAffaireModifiee: () => void;
  isLoading?: boolean;
}

export const ListeAffaires = ({
  affaires,
  affairesFiltrees,
  onVoir,
  onModifier,
  onSupprimer,
  onAffaireModifiee,
  isLoading = false
}: ListeAffairesProps) => {
  const { canModifier, canSupprimer } = usePermissions();
  
  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'brouillon':
        return <Badge variant="secondary">Brouillon</Badge>;
      case 'validee':
        return <Badge variant="default">Validée</Badge>;
      case 'en_repartition':
        return <Badge variant="outline">En Répartition</Badge>;
      case 'en_attente_hierarchie':
        return <Badge variant="destructive">En Attente Hiérarchie</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Chargement des affaires...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (affairesFiltrees.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-2">
            {affaires.length === 0 
              ? "Aucune affaire contentieuse créée" 
              : "Aucune affaire ne correspond aux critères de recherche"}
          </p>
          <p className="text-sm text-gray-400">
            {affaires.length === 0 
              ? "Commencez par créer votre première affaire" 
              : "Modifiez vos critères de recherche pour voir plus de résultats"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Contrevenant</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affairesFiltrees.map((affaire) => (
                <TableRow key={affaire.id}>
                  <TableCell className="font-medium">{affaire.numeroAffaire}</TableCell>
                  <TableCell>{new Date(affaire.dateAffaire).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{affaire.descriptionAffaire}</TableCell>
                  <TableCell>{affaire.nomPrenomContrevenant || '-'}</TableCell>
                  <TableCell>{affaire.montantAffaire.toLocaleString()} FCFA</TableCell>
                  <TableCell>{getStatutBadge(affaire.statut)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
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
                      <ActionsAffaire 
                        affaire={affaire} 
                        onAffaireUpdated={onAffaireModifiee}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
