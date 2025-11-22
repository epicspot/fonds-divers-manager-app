import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Check } from "lucide-react";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const WizardNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onCancel,
  onSubmit,
  isSubmitting,
  isFirstStep,
  isLastStep,
}: WizardNavigationProps) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        <X className="h-4 w-4 mr-2" />
        Annuler
      </Button>

      <div className="flex gap-2">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isSubmitting}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>
        )}

        {!isLastStep ? (
          <Button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            <Check className="h-4 w-4 mr-2" />
            {isSubmitting ? "Création en cours..." : "Créer l'affaire"}
          </Button>
        )}
      </div>
    </div>
  );
};
