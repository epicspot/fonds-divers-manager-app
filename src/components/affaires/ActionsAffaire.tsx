
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, AlertCircle, Send, Clock, Shield } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { useAffairesSupabase } from "@/hooks/useAffairesSupabase";
import { toast } from "sonner";
import { ModalRepartition } from "./ModalRepartition";
import { useState } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionsAffaireProps {
  affaire: AffaireContentieuse;
  onAffaireUpdated: () => void;
}

export const ActionsAffaire = ({ affaire, onAffaireUpdated }: ActionsAffaireProps) => {
  const { validerAffaire, mettreAJourAffaire } = useAffairesSupabase();
  const [modalRepartitionOpen, setModalRepartitionOpen] = useState(false);
  const { canValider, canTransmettre, canApprouver, role } = usePermissions();

  const handleValider = async () => {
    if (!canValider()) {
      toast.error("Vous n'avez pas les permissions pour valider cette affaire");
      return;
    }
    
    try {
      await validerAffaire(affaire.id);
      toast.success("Affaire validée avec succès");
      onAffaireUpdated();
      window.dispatchEvent(new CustomEvent('affaire-updated'));
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast.error("Erreur lors de la validation de l'affaire");
    }
  };

  const handleTransmettreHierarchie = async () => {
    if (!canTransmettre()) {
      toast.error("Vous n'avez pas les permissions pour transmettre à la hiérarchie");
      return;
    }
    
    try {
      await mettreAJourAffaire(affaire.id, {
        statut: 'en_attente_hierarchie',
        dateTransmissionHierarchie: new Date().toISOString()
      });
      
      toast.success("Affaire transmise à la hiérarchie");
      onAffaireUpdated();
      window.dispatchEvent(new CustomEvent('affaire-updated'));
    } catch (error) {
      console.error('Erreur lors de la transmission:', error);
      toast.error("Erreur lors de la transmission");
    }
  };

  const handleActiverRepartition = async () => {
    if (!canApprouver()) {
      toast.error("Vous n'avez pas les permissions pour approuver la répartition");
      return;
    }
    
    try {
      await mettreAJourAffaire(affaire.id, {
        statut: 'en_repartition',
        dateApprobationHierarchie: new Date().toISOString()
      });
      
      toast.success("Répartition activée suite à l'approbation hiérarchique");
      setModalRepartitionOpen(true);
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
          actions: canValider() ? [
            <Button 
              key="valider"
              size="sm" 
              onClick={handleValider}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              Valider
            </Button>
          ] : [
            <TooltipProvider key="valider-disabled">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button 
                      size="sm" 
                      disabled
                      className="flex items-center gap-1"
                    >
                      <Shield className="h-4 w-4" />
                      Valider
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Réservé aux administrateurs et superviseurs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ]
        };
      case "validee":
        return {
          badge: <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Validée
          </Badge>,
          actions: canTransmettre() ? [
            <Button 
              key="transmettre"
              size="sm" 
              onClick={handleTransmettreHierarchie}
              className="flex items-center gap-1"
            >
              <Send className="h-4 w-4" />
              Transmettre Hiérarchie
            </Button>
          ] : [
            <TooltipProvider key="transmettre-disabled">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button 
                      size="sm" 
                      disabled
                      className="flex items-center gap-1"
                    >
                      <Shield className="h-4 w-4" />
                      Transmettre
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Réservé aux administrateurs et superviseurs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ]
        };
      case "en_attente_hierarchie":
        return {
          badge: <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En Attente Hiérarchie
          </Badge>,
          actions: canApprouver() ? [
            <Button 
              key="approuver"
              size="sm" 
              onClick={handleActiverRepartition}
              className="flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              Approuver Répartition
            </Button>
          ] : [
            <TooltipProvider key="approuver-disabled">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button 
                      size="sm" 
                      disabled
                      className="flex items-center gap-1"
                    >
                      <Shield className="h-4 w-4" />
                      Approuver
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Réservé aux administrateurs et superviseurs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
    <>
      <div className="flex items-center gap-2">
        {badge}
        {actions.map(action => action)}
      </div>
      
      <ModalRepartition
        affaire={affaire}
        open={modalRepartitionOpen}
        onClose={() => setModalRepartitionOpen(false)}
        onRepartitionComplete={() => {
          onAffaireUpdated();
          window.dispatchEvent(new CustomEvent('affaire-updated'));
        }}
      />
    </>
  );
};
