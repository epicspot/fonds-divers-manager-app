
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface ContrevenantFormProps {
  form: UseFormReturn<any>;
}

export const ContrevenantForm = ({ form }: ContrevenantFormProps) => {
  return (
    <div className="border-b pb-1">
      <h3 className="text-xs mb-1">Contrevenant</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        <FormField
          control={form.control}
          name="nomPrenomContrevenant"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Nom et Prénom</FormLabel>
              <FormControl>
                <Input {...field} className="h-6 text-xs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ifu"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">IFU</FormLabel>
              <FormControl>
                <Input {...field} className="h-6 text-xs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adresseComplete"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Adresse Complète</FormLabel>
              <FormControl>
                <Input {...field} className="h-6 text-xs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
