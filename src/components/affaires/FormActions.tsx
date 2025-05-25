
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export const FormActions = ({ 
  onCancel, 
  isSubmitting = false, 
  submitText = "Créer l'Affaire" 
}: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} size="sm">
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting} size="sm">
        {submitText}
      </Button>
    </div>
  );
};
