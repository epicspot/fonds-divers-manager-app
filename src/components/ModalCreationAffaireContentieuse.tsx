
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormHeader } from "./affaires/FormHeader";
import { FormActions } from "./affaires/FormActions";
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
import { useSuggestions } from "@/hooks/useSuggestions";
import { toast } from "sonner";

interface ModalCreationAffaireContentieuseProps {
  onAffaireCreee: () => void;
}

export const ModalCreationAffaireContentieuse = ({ onAffaireCreee }: ModalCreationAffaireContentieuseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { form, resetForm } = useAffaireForm();
  const { onSubmit, isSubmitting } = useAffaireSubmit({
    onAffaireCreee,
    onClose: () => setIsOpen(false),
    resetForm
  });

  // Obtenir les valeurs actuelles du formulaire pour les suggestions
  const formValues = form.watch();
  const { 
    suggestions, 
    loading: suggestionsLoading, 
    similarCasesCount,
    dismissSuggestion,
    dismissAllSuggestions
  } = useSuggestions(formValues);

  const handleApplySuggestion = (field: string, value: any) => {
    // Cast pour éviter l'erreur TypeScript sur les champs dynamiques
    (form.setValue as any)(field, value);
    dismissSuggestion(field);
    toast.success(`Suggestion appliquée`);
  };

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <FormHeader />
      <DialogContent className="max-w-6xl h-[95vh] overflow-hidden flex flex-col p-3">
        <DialogHeader className="pb-1 flex-shrink-0">
          <DialogTitle className="text-sm font-medium">Création d'une Nouvelle Affaire Contentieuse</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full flex flex-col">
              <Tabs defaultValue="generale" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-4 h-8">
                  <TabsTrigger value="generale" className="text-xs">Générale</TabsTrigger>
                  <TabsTrigger value="declaration" className="text-xs">Déclaration</TabsTrigger>
                  <TabsTrigger value="valeurs" className="text-xs">Valeurs</TabsTrigger>
                  <TabsTrigger value="finalisation" className="text-xs">Finalisation</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 overflow-y-auto mt-2">
                  <TabsContent value="generale" className="space-y-2 m-0">
                    <SuggestionsPanel
                      suggestions={suggestions}
                      loading={suggestionsLoading}
                      similarCasesCount={similarCasesCount}
                      onApplySuggestion={handleApplySuggestion}
                      onDismissSuggestion={dismissSuggestion}
                      onDismissAll={dismissAllSuggestions}
                    />
                    <InformationsBaseForm form={form} />
                    <BureauPosteForm form={form} />
                    <ContrevenantForm form={form} />
                  </TabsContent>

                  <TabsContent value="declaration" className="space-y-2 m-0">
                    <DeclarationForm form={form} />
                    <TransportMarchandisesForm form={form} />
                    <SucrerieForm form={form} />
                  </TabsContent>

                  <TabsContent value="valeurs" className="space-y-2 m-0">
                    <ValeursDroitsForm form={form} />
                    <TransactionForm form={form} />
                  </TabsContent>

                  <TabsContent value="finalisation" className="space-y-2 m-0">
                    <SaisissantIntervenantsForm form={form} />
                    <ObservationsField form={form} />
                  </TabsContent>
                </div>
              </Tabs>
              
              <div className="pt-2 border-t flex-shrink-0">
                <FormActions 
                  onCancel={() => setIsOpen(false)} 
                  isSubmitting={isSubmitting}
                />
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
