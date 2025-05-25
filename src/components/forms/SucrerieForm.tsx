
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { UseFormReturn } from "react-hook-form";

interface SucrerieFormProps {
  form: UseFormReturn<any>;
}

const origineProvenanceOptions = [
  { label: "Nigéria", value: "nigeria" },
  { label: "Togo", value: "togo" },
  { label: "Burkina Faso", value: "burkina_faso" },
  { label: "Niger", value: "niger" },
  { label: "Ghana", value: "ghana" },
  { label: "Côte d'Ivoire", value: "cote_ivoire" },
  { label: "Mali", value: "mali" },
  { label: "Sénégal", value: "senegal" },
  { label: "Production locale", value: "production_locale" },
  { label: "Autre", value: "autre" },
];

export const SucrerieForm = ({ form }: SucrerieFormProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Sucrerie</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="origineProvenance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origine ou Provenance</FormLabel>
              <FormControl>
                <MultiSelect
                  options={origineProvenanceOptions}
                  selected={Array.isArray(field.value) ? field.value : (field.value ? [field.value] : [])}
                  onChange={field.onChange}
                  placeholder="Sélectionner l'origine..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="poidsKg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poids en KG</FormLabel>
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
