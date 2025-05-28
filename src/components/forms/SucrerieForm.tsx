
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { UseFormReturn } from "react-hook-form";

interface SucrerieFormProps {
  form: UseFormReturn<any>;
}

const origineProvenanceOptions = [
  { value: "locale", label: "Locale" },
  { value: "importee", label: "Importée" },
  { value: "transit", label: "Transit" },
];

export const SucrerieForm = ({ form }: SucrerieFormProps) => {
  return (
    <div className="border-b pb-1">
      <h3 className="text-xs font-medium mb-1">Origine et Poids</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <FormField
          control={form.control}
          name="origineProvenance"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Origine/Provenance</FormLabel>
              <FormControl>
                <MultiSelect
                  options={origineProvenanceOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Sélectionner..."
                  className="h-6 text-xs"
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
              <FormLabel className="text-xs">Poids (Kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
