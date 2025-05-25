
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface InformationsBaseFormProps {
  form: UseFormReturn<any>;
}

export const InformationsBaseForm = ({ form }: InformationsBaseFormProps) => {
  return (
    <div className="border-b pb-1">
      <h3 className="text-xs mb-1">Informations de Base</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        <FormField
          control={form.control}
          name="numeroAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">N° d'Affaire</FormLabel>
              <FormControl>
                <Input {...field} className="h-6 text-xs" readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Date d'Affaire</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-6 text-xs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="montantAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Montant (FCFA)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                  className="h-6 text-xs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descriptionAffaire"
          render={({ field }) => (
            <FormItem className="md:col-span-3">
              <FormLabel className="text-xs">Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[30px] text-xs resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
