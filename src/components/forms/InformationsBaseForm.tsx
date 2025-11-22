
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface InformationsBaseFormProps {
  form: UseFormReturn<any>;
}

export const InformationsBaseForm = ({ form }: InformationsBaseFormProps) => {
  return (
    <div className="border-b pb-1">
      <h3 className="text-xs font-medium mb-1">Informations de Base</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        <FormField
          control={form.control}
          name="numeroAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">N° d'Affaire <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input {...field} className="h-6 text-xs" readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numeroReference"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">N° de Référence du Registre <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input {...field} className="h-6 text-xs" placeholder="REF-2024-001" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateReference"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Date de Référence <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-6 text-xs" />
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
              <FormLabel className="text-xs">Date d'Affaire <span className="text-destructive">*</span></FormLabel>
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
              <FormLabel className="text-xs">Montant (FCFA) <span className="text-destructive">*</span></FormLabel>
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
      </div>
    </div>
  );
};
