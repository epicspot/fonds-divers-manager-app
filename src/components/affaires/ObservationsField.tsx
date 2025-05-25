
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface ObservationsFieldProps {
  form: UseFormReturn<any>;
}

export const ObservationsField = ({ form }: ObservationsFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="observations"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observations (Optionnel)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Observations particulières..."
              className="min-h-[60px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
