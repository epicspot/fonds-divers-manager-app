
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const FormActions = ({ onCancel, isSubmitting = false }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        Créer l'Affaire
      </Button>
    </div>
  );
};
