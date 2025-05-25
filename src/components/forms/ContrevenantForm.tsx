
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface ContrevenantFormProps {
  form: UseFormReturn<any>;
}

export const ContrevenantForm = ({ form }: ContrevenantFormProps) => {
  return (
    <div className="border-b pb-3">
      <h3 className="text-base font-semibold mb-3">Contrevenant</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FormField
          control={form.control}
          name="nomPrenomContrevenant"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Nom et Prénom</FormLabel>
              <FormControl>
                <Input {...field} className="h-8 text-sm" />
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
                <Input {...field} className="h-8 text-sm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adresseComplete"
          render={({ field }) => (
            <FormItem className="md:col-span-3">
              <FormLabel className="text-xs">Adresse Complète</FormLabel>
              <FormControl>
                <Textarea className="min-h-[50px] text-sm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
