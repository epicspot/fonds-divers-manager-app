
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { UseFormReturn } from "react-hook-form";

interface ValeursDroitsFormProps {
  form: UseFormReturn<any>;
}

const natureInfractionOptions = [
  { label: "Fausse déclaration d'espèce", value: "fausse_declaration_espece" },
  { label: "Fausse déclaration de valeur", value: "fausse_declaration_valeur" },
  { label: "Fausse déclaration d'origine", value: "fausse_declaration_origine" },
  { label: "Fausse déclaration de poids", value: "fausse_declaration_poids" },
  { label: "Importation sans déclaration", value: "importation_sans_declaration" },
  { label: "Exportation sans déclaration", value: "exportation_sans_declaration" },
  { label: "Transit irrégulier", value: "transit_irregulier" },
  { label: "Contrebande", value: "contrebande" },
  { label: "Détournement de régime", value: "detournement_regime" },
  { label: "Autre", value: "autre" },
];

export const ValeursDroitsForm = ({ form }: ValeursDroitsFormProps) => {
  return (
    <div className="border-b pb-2">
      <h3 className="text-sm font-semibold mb-2">Valeurs et Droits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <FormField
          control={form.control}
          name="valeurMarchandisesLitigieuses"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Valeur Marchandises</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  className="h-7 text-xs"
                />
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
              <FormLabel className="text-xs">Droits Compromis</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  className="h-7 text-xs"
                />
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
              <FormLabel className="text-xs">Nb Informateurs</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  className="h-7 text-xs"
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
              <FormLabel className="text-xs">N° Quittance</FormLabel>
              <FormControl>
                <Input {...field} className="h-7 text-xs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="natureInfraction"
          render={({ field }) => (
            <FormItem className="md:col-span-2 lg:col-span-4">
              <FormLabel className="text-xs">Nature Infraction</FormLabel>
              <FormControl>
                <MultiSelect
                  options={natureInfractionOptions}
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
