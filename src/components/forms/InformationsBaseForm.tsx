
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface InformationsBaseFormProps {
  form: UseFormReturn<any>;
}

export const InformationsBaseForm = ({ form }: InformationsBaseFormProps) => {
  return (
    <div className="border-b pb-2">
      <h3 className="text-sm font-semibold mb-2">Informations de Base</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        <FormField
          control={form.control}
          name="numeroAffaire"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs">N° d'Affaire</FormLabel>
              <FormControl>
                <Input {...field} className="h-7 text-xs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateAffaire"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs">Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-7 text-xs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="montantAffaire"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs">Montant (FCFA)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="h-7 text-xs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-2">
        <FormField
          control={form.control}
          name="descriptionAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description..."
                  className="min-h-[40px] text-xs"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
