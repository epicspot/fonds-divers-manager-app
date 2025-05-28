
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface DeclarationFormProps {
  form: UseFormReturn<any>;
}

export const DeclarationForm = ({ form }: DeclarationFormProps) => {
  return (
    <div className="border-b pb-1">
      <h3 className="text-xs font-medium mb-1">Déclaration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <FormField
          control={form.control}
          name="numeroDeclaration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">N° Déclaration</FormLabel>
              <FormControl>
                <Input {...field} className="h-6 text-xs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateDeclaration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Date Déclaration</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-6 text-xs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
