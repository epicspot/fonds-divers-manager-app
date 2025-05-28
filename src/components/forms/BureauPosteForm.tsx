
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { UseFormReturn } from "react-hook-form";

interface BureauPosteFormProps {
  form: UseFormReturn<any>;
}

const regionDgdOptions = [
  { label: "DGD Cotonou", value: "dgd_cotonou" },
  { label: "DGD Porto-Novo", value: "dgd_porto_novo" },
  { label: "DGD Parakou", value: "dgd_parakou" },
  { label: "DGD Natitingou", value: "dgd_natitingou" },
  { label: "DGD Kandi", value: "dgd_kandi" },
  { label: "Autre", value: "autre" },
];

const bureauPosteOptions = [
  { label: "Bureau Principal de Cotonou", value: "bureau_principal_cotonou" },
  { label: "Bureau de l'Aéroport", value: "bureau_aeroport" },
  { label: "Bureau du Port", value: "bureau_port" },
  { label: "Bureau de Kraké", value: "bureau_krake" },
  { label: "Bureau de Malanville", value: "bureau_malanville" },
  { label: "Bureau de Gaya", value: "bureau_gaya" },
  { label: "Autre", value: "autre" },
];

export const BureauPosteForm = ({ form }: BureauPosteFormProps) => {
  return (
    <div className="border-b pb-1">
      <h3 className="text-xs font-medium mb-1">Bureau/Poste</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <FormField
          control={form.control}
          name="regionDgd"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Région/DGD</FormLabel>
              <FormControl>
                <MultiSelect
                  options={regionDgdOptions}
                  selected={Array.isArray(field.value) ? field.value : (field.value ? [field.value] : [])}
                  onChange={field.onChange}
                  placeholder="Sélectionner..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bureauPoste"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Bureau du Poste</FormLabel>
              <FormControl>
                <MultiSelect
                  options={bureauPosteOptions}
                  selected={Array.isArray(field.value) ? field.value : (field.value ? [field.value] : [])}
                  onChange={field.onChange}
                  placeholder="Sélectionner..."
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
