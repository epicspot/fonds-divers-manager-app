
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, AlertCircle } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { validerAffaire } from "@/utils/affaireUtils";
import { toast } from "sonner";

interface ActionsAffaireProps {
  affaire: AffaireContentieuse;
  onAffaireUpdated: () => void;
}

export const ActionsAffaire = ({ affaire, onAffaireUpdated }: ActionsAffaireProps) => {
  const handleValider = () => {
    try {
      validerAffaire(affaire.id);
      toast.success("Affaire validée avec succès");
      onAffaireUpdated();
    } catch (error) {
      toast.error("Erreur lors de la validation de l'affaire");
    }
  };

  const handleActiverTraitement = () => {
    try {
      // Update status to en_repartition
      const affaires = JSON.parse(localStorage.getItem('affaires_contentieuses') || '[]');
      const affaireIndex = affaires.findIndex((a: AffaireContentieuse) => a.id === affaire.id);
      
      if (affaireIndex !== -1) {
        affaires[affaireIndex].statut = 'en_repartition';
        localStorage.setItem('affaires_contentieuses', JSON.stringify(affaires));
        toast.success("Traitement activé avec succès");
        onAffaireUpdated();
      }
    } catch (error) {
      toast.error("Erreur lors de l'activation du traitement");
    }
  };

  const getStatutInfo = (statut: string) => {
    switch (statut) {
      case "brouillon":
        return { 
          badge: <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Brouillon
          </Badge>,
          actions: [
            <Button 
              key="valider"
              size="sm" 
              onClick={handleValider}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              Valider
            </Button>
          ]
        };
      case "validee":
        return {
          badge: <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Validée
          </Badge>,
          actions: [
            <Button 
              key="traitement"
              size="sm" 
              onClick={handleActiverTraitement}
              className="flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              Activer Traitement
            </Button>
          ]
        };
      case "en_repartition":
        return {
          badge: <Badge variant="outline" className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            En Répartition
          </Badge>,
          actions: []
        };
      default:
        return {
          badge: <Badge variant="secondary">{statut}</Badge>,
          actions: []
        };
    }
  };

  const { badge, actions } = getStatutInfo(affaire.statut);

  return (
    <div className="flex items-center gap-2">
      {badge}
      {actions.map(action => action)}
    </div>
  );
};
