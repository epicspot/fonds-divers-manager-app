
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface SaisissantIntervenantsFormProps {
  form: UseFormReturn<any>;
}

export const SaisissantIntervenantsForm = ({ form }: SaisissantIntervenantsFormProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Saisissant et Intervenants</h3>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="nomsSaisissant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Noms du Saisissant</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nomsIntervenants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Noms des Intervenants</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateRepartition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de Répartition</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numeroBordereauRatification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>N° de Bordereau de Ratification</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="circonstancesParticulieres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Circonstances Particulières à l'Affaire</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
