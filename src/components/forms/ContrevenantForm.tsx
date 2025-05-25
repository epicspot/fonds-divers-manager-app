
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface ContrevenantFormProps {
  form: UseFormReturn<any>;
}

export const ContrevenantForm = ({ form }: ContrevenantFormProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Contrevenant</h3>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="nomPrenomContrevenant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom et Prénom du Contrevenant</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Adresse Complète</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
              <FormLabel>IFU</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
