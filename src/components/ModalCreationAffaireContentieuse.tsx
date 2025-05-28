
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormHeader } from "./affaires/FormHeader";
import { FormSections } from "./affaires/FormSections";
import { FormActions } from "./affaires/FormActions";
import { ObservationsField } from "./affaires/ObservationsField";
import { useAffaireForm } from "./affaires/useAffaireForm";
import { useAffaireSubmit } from "./affaires/useAffaireSubmit";

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

        <div className="flex-1 overflow-y-auto pr-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-1">
              <FormSections form={form} />
              
              <ObservationsField form={form} />
              
              <div className="pt-2">
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
