
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface InformationsBaseFormProps {
  form: UseFormReturn<any>;
}

export const InformationsBaseForm = ({ form }: InformationsBaseFormProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Informations de Base</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="numeroAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro d'Affaire</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Date de l'Affaire</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>Montant de l'Affaire (FCFA)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="partIndicateur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Part Indicateur (FCFA)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="descriptionAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description de l'Affaire</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description détaillée de l'affaire contentieuse..."
                  className="min-h-[80px]"
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
