
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, AlertCircle, Send, Clock } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { useAffairesSupabase } from "@/hooks/useAffairesSupabase";
import { creerActionSuivi, ajouterActionSuivi } from "@/utils/suiviUtils";
import { toast } from "sonner";

interface ActionsAffaireProps {
  affaire: AffaireContentieuse;
  onAffaireUpdated: () => void;
}

export const ActionsAffaire = ({ affaire, onAffaireUpdated }: ActionsAffaireProps) => {
  const { validerAffaire, mettreAJourAffaire } = useAffairesSupabase();

  const handleValider = async () => {
    try {
      await validerAffaire(affaire.id);
      
      // Créer une action de suivi
      const action = creerActionSuivi(
        affaire.id,
        'validation',
        'Utilisateur', // TODO: récupérer l'utilisateur connecté
        'Affaire validée et prête pour transmission'
      );
      ajouterActionSuivi(action);
      
      toast.success("Affaire validée avec succès");
      onAffaireUpdated();
      
      window.dispatchEvent(new CustomEvent('affaire-updated'));
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast.error("Erreur lors de la validation de l'affaire");
    }
  };

  const handleTransmettreHierarchie = async () => {
    try {
      await mettreAJourAffaire(affaire.id, {
        statut: 'en_attente_hierarchie',
        dateTransmissionHierarchie: new Date().toISOString()
      });
      
      // Créer une action de suivi avec délai de 7 jours
      const action = creerActionSuivi(
        affaire.id,
        'transmission',
        'Utilisateur', // TODO: récupérer l'utilisateur connecté
        'Affaire transmise à la hiérarchie pour approbation',
        7 // 7 jours de délai
      );
      ajouterActionSuivi(action);
      
      toast.success("Affaire transmise à la hiérarchie");
      onAffaireUpdated();
      
      window.dispatchEvent(new CustomEvent('affaire-updated'));
    } catch (error) {
      console.error('Erreur lors de la transmission:', error);
      toast.error("Erreur lors de la transmission");
    }
  };

  const handleActiverRepartition = async () => {
    try {
      await mettreAJourAffaire(affaire.id, {
        statut: 'en_repartition',
        dateApprobationHierarchie: new Date().toISOString()
      });
      
      // Créer une action de suivi d'approbation
      const action = creerActionSuivi(
        affaire.id,
        'approbation',
        'Hiérarchie', // TODO: récupérer l'utilisateur connecté
        'Affaire approuvée, répartition activée'
      );
      action.statut = 'termine';
      ajouterActionSuivi(action);
      
      toast.success("Répartition activée suite à l'approbation hiérarchique");
      onAffaireUpdated();
      
      window.dispatchEvent(new CustomEvent('affaire-updated'));
    } catch (error) {
      console.error('Erreur lors de l\'activation de la répartition:', error);
      toast.error("Erreur lors de l'activation de la répartition");
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
              key="transmettre"
              size="sm" 
              onClick={handleTransmettreHierarchie}
              className="flex items-center gap-1"
            >
              <Send className="h-4 w-4" />
              Transmettre Hiérarchie
            </Button>
          ]
        };
      case "en_attente_hierarchie":
        return {
          badge: <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En Attente Hiérarchie
          </Badge>,
          actions: [
            <Button 
              key="approuver"
              size="sm" 
              onClick={handleActiverRepartition}
              className="flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              Approuver Répartition
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
