
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormHeader } from "./affaires/FormHeader";
import { FormSections } from "./affaires/FormSections";
import { FormActions } from "./affaires/FormActions";
import { ObservationsField } from "./affaires/ObservationsField";
import { useAffaireForm } from "./affaires/useAffaireForm";
import { useAffaireSubmit } from "./affaires/useAffaireSubmit";

interface AyantDroitForm {
  nom: string;
  typeAyantDroit: 'syndicat' | 'mutuelle' | 'poursuivant' | 'autre';
  montant: number;
}

interface ModalCreationAffaireContentieuseProps {
  onAffaireCreee: () => void;
}

export const ModalCreationAffaireContentieuse = ({ onAffaireCreee }: ModalCreationAffaireContentieuseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ayantsDroits, setAyantsDroits] = useState<AyantDroitForm[]>([]);
  
  const { form, resetForm } = useAffaireForm();
  const { onSubmit, isSubmitting } = useAffaireSubmit({
    onAffaireCreee,
    onClose: () => setIsOpen(false),
    resetForm,
    setAyantsDroits
  });

  const handleSubmit = (values: any) => {
    onSubmit(values, ayantsDroits);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <FormHeader />
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Création d'une Nouvelle Affaire Contentieuse</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormSections 
              form={form} 
              ayantsDroits={ayantsDroits} 
              setAyantsDroits={setAyantsDroits} 
            />
            
            <ObservationsField form={form} />
            
            <FormActions 
              onCancel={() => setIsOpen(false)} 
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
