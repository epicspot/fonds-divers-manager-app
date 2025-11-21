import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AffaireContentieuse } from "@/types/affaire";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ModalRepartitionProps {
  affaire: AffaireContentieuse;
  open: boolean;
  onClose: () => void;
  onRepartitionComplete: () => void;
}

export const ModalRepartition = ({
  affaire,
  open,
  onClose,
  onRepartitionComplete,
}: ModalRepartitionProps) => {
  const [enCours, setEnCours] = useState(false);

  const handleValiderRepartition = async () => {
    try {
      setEnCours(true);

      // Clôturer l'affaire après répartition
      const { error } = await supabase
        .from('affaires_contentieuses')
        .update({
          statut: 'cloturee',
        })
        .eq('id', affaire.id);

      if (error) throw error;

      toast.success("Répartition validée et affaire clôturée");
      onRepartitionComplete();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast.error("Erreur lors de la validation de la répartition");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Répartition - Affaire {affaire.numeroAffaire}
          </DialogTitle>
          <DialogDescription>
            Finaliser la répartition et clôturer l'affaire
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Pour effectuer les calculs détaillés de répartition, utilisez le module de répartition dans le menu principal.
              Cette action clôturera l'affaire une fois la répartition validée.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <span className="text-sm text-muted-foreground">N° Affaire:</span>
              <p className="font-semibold">{affaire.numeroAffaire}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Montant Affaire:</span>
              <p className="font-semibold">{affaire.montantAffaire?.toLocaleString() || 0} FCFA</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Produit Net:</span>
              <p className="font-semibold">{affaire.produitNetRepartir?.toLocaleString() || 0} FCFA</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Statut:</span>
              <p className="font-semibold">{affaire.statut}</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Prêt pour la clôture</h4>
                <p className="text-sm text-green-700 mt-1">
                  L'affaire a été validée et peut maintenant être clôturée après répartition.
                  Assurez-vous d'avoir effectué tous les calculs nécessaires dans le module de répartition.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={enCours}>
              Annuler
            </Button>
            <Button
              onClick={handleValiderRepartition}
              disabled={enCours}
            >
              {enCours ? "Clôture en cours..." : "Valider et clôturer l'affaire"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
