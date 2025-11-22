import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { ValidationError, getFieldLabel } from "@/utils/validation/rapportValidation";

interface ValidationAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errors: ValidationError[];
  warnings: ValidationError[];
  typeRapport: string;
  onContinueAnyway: () => void;
}

export const ValidationAlertDialog = ({
  open,
  onOpenChange,
  errors,
  warnings,
  typeRapport,
  onContinueAnyway,
}: ValidationAlertDialogProps) => {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  const getTitreRapport = () => {
    const titres: Record<string, string> = {
      bordereau_officiel: "CT8 - Bordereau d'Affaire Contentieuse",
      transaction_ct3: "CT3 - Transaction",
      edpn: "EDPN - État Dégageant le Produit Net",
      bordereau: "Bordereau de répartition",
      fiche_indicateur: "Fiche indicateur",
    };
    return titres[typeRapport] || typeRapport;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {hasErrors ? (
              <>
                <AlertCircle className="h-5 w-5 text-destructive" />
                Validation échouée
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-warning" />
                Avertissements de validation
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasErrors ? (
              <>
                Le rapport <strong>{getTitreRapport()}</strong> ne peut pas être généré car des
                informations essentielles sont manquantes.
              </>
            ) : (
              <>
                Le rapport <strong>{getTitreRapport()}</strong> peut être généré, mais certaines
                informations complémentaires sont manquantes.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {hasErrors && (
            <div className="space-y-2">
              <h4 className="font-semibold text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Erreurs ({errors.length})
              </h4>
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                  >
                    <div className="font-medium text-sm">{getFieldLabel(error.field)}</div>
                    <div className="text-sm text-muted-foreground">{error.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasWarnings && (
            <div className="space-y-2">
              <h4 className="font-semibold text-warning flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Avertissements ({warnings.length})
              </h4>
              <div className="space-y-2">
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="p-3 bg-warning/10 border border-warning/20 rounded-md"
                  >
                    <div className="font-medium text-sm">{getFieldLabel(warning.field)}</div>
                    <div className="text-sm text-muted-foreground">{warning.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>
            {hasErrors ? 'Fermer' : 'Annuler'}
          </AlertDialogCancel>
          {!hasErrors && (
            <AlertDialogAction onClick={onContinueAnyway}>
              Générer quand même
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
