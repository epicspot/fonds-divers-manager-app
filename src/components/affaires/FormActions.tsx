
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
    <div className="flex justify-end space-x-2 pt-2">
      <Button type="button" variant="outline" onClick={onCancel} size="sm" className="h-7 px-3 text-xs">
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting} size="sm" className="h-7 px-3 text-xs">
        {submitText}
      </Button>
    </div>
  );
};
