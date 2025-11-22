
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormHeader } from "./affaires/FormHeader";
import { ObservationsField } from "./affaires/ObservationsField";
import { useAffaireForm } from "./affaires/useAffaireForm";
import { useAffaireSubmit } from "./affaires/useAffaireSubmit";
import { InformationsBaseForm } from "./forms/InformationsBaseForm";
import { BureauPosteForm } from "./forms/BureauPosteForm";
import { DeclarationForm } from "./forms/DeclarationForm";
import { ContrevenantForm } from "./forms/ContrevenantForm";
import { TransportMarchandisesForm } from "./forms/TransportMarchandisesForm";
import { SucrerieForm } from "./forms/SucrerieForm";
import { ValeursDroitsForm } from "./forms/ValeursDroitsForm";
import { TransactionForm } from "./forms/TransactionForm";
import { SaisissantIntervenantsForm } from "./forms/SaisissantIntervenantsForm";
import { SuggestionsPanel } from "./affaires/SuggestionsPanel";
import { StepIndicator } from "./affaires/StepIndicator";
import { WizardNavigation } from "./affaires/WizardNavigation";
import { RecapitulatifAffaire } from "./affaires/RecapitulatifAffaire";
import { useSuggestions } from "@/hooks/useSuggestions";
import { useDraftSave } from "@/hooks/useDraftSave";
import { toast } from "sonner";

interface ModalCreationAffaireContentieuseProps {
  onAffaireCreee: () => void;
}

const STEPS = [
  { number: 1, title: "Informations générales", description: "Données de base" },
  { number: 2, title: "Déclaration", description: "Transport & marchandises" },
  { number: 3, title: "Valeurs et droits", description: "Montants et transaction" },
  { number: 4, title: "Finalisation", description: "Intervenants et observations" },
];

export const ModalCreationAffaireContentieuse = ({ onAffaireCreee }: ModalCreationAffaireContentieuseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { form, resetForm } = useAffaireForm();
  const { clearDraft } = useDraftSave(form, isOpen);
  
  const { onSubmit, isSubmitting } = useAffaireSubmit({
    onAffaireCreee,
    onClose: () => {
      clearDraft(); // Effacer le brouillon après création réussie
      setIsOpen(false);
      setCurrentStep(1);
      setCompletedSteps([]);
    },
    resetForm
  });

  // Obtenir les valeurs actuelles du formulaire pour les suggestions
  const formValues = form.watch();
  const { 
    suggestions, 
    loading: suggestionsLoading, 
    similarCasesCount,
    learningActive,
    acceptSuggestion,
    dismissSuggestion,
    dismissAllSuggestions,
    toggleLearning
  } = useSuggestions(formValues);

  const handleApplySuggestion = (field: string, value: any) => {
    // Cast pour éviter l'erreur TypeScript sur les champs dynamiques
    (form.setValue as any)(field, value);
    acceptSuggestion(field);
    dismissSuggestion(field);
    toast.success(`Suggestion appliquée`);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCompletedSteps(prev => {
          if (!prev.includes(currentStep)) {
            return [...prev, currentStep];
          }
          return prev;
        });
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleStepClick = (step: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      // Marquer l'étape actuelle comme complétée si on navigue vers l'avant
      if (step > currentStep) {
        setCompletedSteps(prev => {
          if (!prev.includes(currentStep)) {
            return [...prev, currentStep];
          }
          return prev;
        });
      }
      setCurrentStep(step);
      setIsTransitioning(false);
    }, 150);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setCurrentStep(1);
    setCompletedSteps([]);
    resetForm();
  };

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <FormHeader />
      <DialogContent className="max-w-6xl h-[95vh] overflow-hidden flex flex-col p-4">
        <DialogHeader className="pb-2 flex-shrink-0">
          <DialogTitle className="text-lg font-semibold">Création d'une Nouvelle Affaire Contentieuse</DialogTitle>
        </DialogHeader>

        <StepIndicator
          steps={STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        <div className="flex-1 overflow-hidden">
          <Form {...form}>
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                  {currentStep === 1 && (
                  <div className="space-y-4">
                    <SuggestionsPanel
                      suggestions={suggestions}
                      loading={suggestionsLoading}
                      similarCasesCount={similarCasesCount}
                      learningActive={learningActive}
                      onApplySuggestion={handleApplySuggestion}
                      onDismissSuggestion={dismissSuggestion}
                      onDismissAll={dismissAllSuggestions}
                    />
                    <InformationsBaseForm form={form} />
                    <BureauPosteForm form={form} />
                    <ContrevenantForm form={form} />
                  </div>
                )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <DeclarationForm form={form} />
                      <TransportMarchandisesForm form={form} />
                      <SucrerieForm form={form} />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <ValeursDroitsForm form={form} />
                      <TransactionForm form={form} />
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <RecapitulatifAffaire
                        formValues={formValues}
                        onEdit={handleStepClick}
                      />
                      <SaisissantIntervenantsForm form={form} />
                      <ObservationsField form={form} />
                    </div>
                  )}
                </div>
              </div>
              
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={STEPS.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isFirstStep={currentStep === 1}
                isLastStep={currentStep === STEPS.length}
              />
            </div>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
