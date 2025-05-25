
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormSections } from "./FormSections";
import { FormActions } from "./FormActions";
import { ObservationsField } from "./ObservationsField";
import { useAffaireEditForm } from "./useAffaireEditForm";
import { useAffaireUpdate } from "./useAffaireUpdate";
import { AffaireContentieuse } from "@/types/affaire";

interface ModifierAffaireProps {
  affaire: AffaireContentieuse | null;
  isOpen: boolean;
  onClose: () => void;
  onAffaireModifiee: () => void;
}

export const ModifierAffaire = ({ 
  affaire, 
  isOpen, 
  onClose, 
  onAffaireModifiee 
}: ModifierAffaireProps) => {
  const { form, resetForm } = useAffaireEditForm(affaire);
  const { onUpdate, isUpdating } = useAffaireUpdate({
    onAffaireModifiee,
    onClose,
    resetForm
  });

  const handleSubmit = (values: any) => {
    if (affaire) {
      onUpdate(affaire.id, values);
    }
  };

  if (!affaire) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Modifier l'Affaire {affaire.numeroAffaire}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormSections form={form} />
            
            <ObservationsField form={form} />
            
            <FormActions 
              onCancel={onClose} 
              isSubmitting={isUpdating}
              submitText="Mettre à jour"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
