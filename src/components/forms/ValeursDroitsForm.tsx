
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ValeursDroitsFormProps {
  form: UseFormReturn<any>;
}

export const ValeursDroitsForm = ({ form }: ValeursDroitsFormProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Valeurs et Droits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="valeurMarchandisesLitigieuses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valeur des Marchandises Litigieuses</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="natureInfraction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nature de l'Infraction</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="droitsCompromis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Droits Compromis ou Éludés</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numeroQuittanceDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de Quittance et Date</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nombreInformateurs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre d'Informateurs</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
