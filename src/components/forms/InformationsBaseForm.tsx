
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useFieldRequired } from "@/hooks/useFieldRequired";

interface InformationsBaseFormProps {
  form: UseFormReturn<any>;
}

export const InformationsBaseForm = ({ form }: InformationsBaseFormProps) => {
  const { isFieldRequired } = useFieldRequired();

  return (
    <div className="border-b pb-1">
      <h3 className="text-xs font-medium mb-1">Informations de Base</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        <FormField
          control={form.control}
          name="numeroAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">
                N° d'Affaire {isFieldRequired('numeroAffaire') && <span className="text-destructive">*</span>}
              </FormLabel>
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
              <FormLabel className="text-xs">
                N° de Référence du Registre {isFieldRequired('numeroReference') && <span className="text-destructive">*</span>}
              </FormLabel>
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
              <FormLabel className="text-xs">
                Date de Référence {isFieldRequired('dateReference') && <span className="text-destructive">*</span>}
              </FormLabel>
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
              <FormLabel className="text-xs">
                Date d'Affaire {isFieldRequired('dateAffaire') && <span className="text-destructive">*</span>}
              </FormLabel>
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
              <FormLabel className="text-xs">
                Montant (FCFA) {isFieldRequired('montantAffaire') && <span className="text-destructive">*</span>}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                  className="h-6 text-xs"
                  min="0"
                  max="999999999999"
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
              <FormLabel className="text-xs">
                Description de l'Affaire {isFieldRequired('descriptionAffaire') && <span className="text-destructive">*</span>}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="text-xs min-h-[60px]"
                  placeholder="Description détaillée de l'affaire contentieuse..."
                  maxLength={1000}
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
