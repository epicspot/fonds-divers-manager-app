
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface TransportMarchandisesFormProps {
  form: UseFormReturn<any>;
}

export const TransportMarchandisesForm = ({ form }: TransportMarchandisesFormProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Transport et Marchandises</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="natureTransport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nature et Moyen de Transport</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="identificationTransport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identification du Moyen de Transport</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commissionnaireDouane"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commissionnaire en Douane</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="procedureDetectionFraude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procédé de Détection de la Fraude</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="natureMarchandisesFraude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nature des Marchandises de Fraude</FormLabel>
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
